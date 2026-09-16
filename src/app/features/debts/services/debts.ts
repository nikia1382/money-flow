import {
  Injectable,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  HttpClient,
} from '@angular/common/http';

import {
  TranslateService,
} from '@ngx-translate/core';

import {
  Debt,
} from '../model/debt.model';

import {
  ToastService,
} from '../../../shared/services/toast';
import { environment } from '../../../../environments/environment';

/* =========================
   API Payloads
========================= */

interface DebtPayload {
  personName: string;
  type: Debt['type'];
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  note: string | null;
}

interface PaymentPayload {
  amount: number;
}

@Injectable({
  providedIn: 'root',
})
export class DebtsService {
  /* =========================
     Services
  ========================= */

  private readonly http =
    inject(HttpClient);

  private readonly toast =
    inject(ToastService);

  private readonly translate =
    inject(TranslateService);

  /* =========================
     API
  ========================= */

  private readonly apiUrl =
    `${environment.apiUrl}/debts`;

  /* =========================
     State
  ========================= */

  readonly debts =
    signal<Debt[]>([]);

  readonly isLoading =
    signal(false);

  /* =========================
     Summary
  ========================= */

  readonly totalIOwe = computed(() =>
    this.debts()
      .filter(
        (debt) =>
          debt.type === 'i-owe' &&
          this.getDebtStatus(debt) !==
            'paid',
      )
      .reduce(
        (total, debt) =>
          total +
          this.getRemainingAmount(debt),
        0,
      ),
  );

  readonly totalOwedToMe = computed(() =>
    this.debts()
      .filter(
        (debt) =>
          debt.type ===
            'owed-to-me' &&
          this.getDebtStatus(debt) !==
            'paid',
      )
      .reduce(
        (total, debt) =>
          total +
          this.getRemainingAmount(debt),
        0,
      ),
  );

  readonly activeCount =
    computed(
      () =>
        this.debts().filter(
          (debt) =>
            this.getDebtStatus(
              debt,
            ) === 'active',
        ).length,
    );

  readonly overdueCount =
    computed(
      () =>
        this.debts().filter(
          (debt) =>
            this.getDebtStatus(
              debt,
            ) ===
            'overdue',
        ).length,
    );

  /* =========================
     Constructor
  ========================= */

  constructor() {
    this.loadDebts();
  }

  /* =========================
     GET
  ========================= */

  loadDebts(): void {
    this.isLoading.set(true);

    this.http
      .get<Debt[]>(
        this.apiUrl,
      )
      .subscribe({
        next: (debts) => {
          this.debts.set(
            debts,
          );

          this.isLoading.set(
            false,
          );
        },

        error: (error) => {
          this.isLoading.set(
            false,
          );

          console.error(
            'Failed to load debts',
            error,
          );

          this.showRequestError();
        },
      });
  }

  /* =========================
     Helpers
  ========================= */

  getRemainingAmount(
    debt: Debt,
  ): number {
    return Math.max(
      0,
      debt.totalAmount -
        debt.paidAmount,
    );
  }

  getDebtStatus(
    debt: Debt,
  ): 'active' | 'paid' | 'overdue' {
    /*
     * وضعیت اصلی از Backend می‌آید.
     * این محاسبه باعث می‌شود تغییر روز
     * بدون Reload نیز درست نمایش داده شود.
     */
    if (
      debt.paidAmount >=
      debt.totalAmount
    ) {
      return 'paid';
    }

    if (this.isOverdue(debt)) {
      return 'overdue';
    }

    return 'active';
  }

  isOverdue(
    debt: Debt,
  ): boolean {
    if (
      debt.paidAmount >=
      debt.totalAmount
    ) {
      return false;
    }

    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0,
    );

    const dueDate =
      new Date(
        `${debt.dueDate}T00:00:00`,
      );

    if (
      Number.isNaN(
        dueDate.getTime(),
      )
    ) {
      return false;
    }

    return dueDate < today;
  }

  /* =========================
     POST
  ========================= */

  addDebt(
    debt: Debt,
  ): void {
    const payload =
      this.toPayload(debt);

    this.http
      .post<Debt>(
        this.apiUrl,
        payload,
      )
      .subscribe({
        next: (createdDebt) => {
          this.debts.update(
            (debts) => [
              ...debts,
              createdDebt,
            ],
          );

          this.toast.success(
            this.translate.instant(
              'debts.toast.added',
            ),
          );
        },

        error: (error) => {
          console.error(
            'Failed to add debt',
            error,
          );

          this.showRequestError();
        },
      });
  }

  /* =========================
     PUT
  ========================= */

  updateDebt(
    updatedDebt: Debt,
  ): void {
    const payload =
      this.toPayload(
        updatedDebt,
      );

    this.http
      .put<Debt>(
        `${this.apiUrl}/${updatedDebt.id}`,
        payload,
      )
      .subscribe({
        next: (savedDebt) => {
          this.debts.update(
            (debts) =>
              debts.map(
                (debt) =>
                  debt.id ===
                  savedDebt.id
                    ? savedDebt
                    : debt,
              ),
          );

          this.toast.success(
            this.translate.instant(
              'debts.toast.updated',
            ),
          );
        },

        error: (error) => {
          console.error(
            'Failed to update debt',
            error,
          );

          this.showRequestError();
        },
      });
  }

  /* =========================
     DELETE
  ========================= */

  deleteDebt(
    id: number,
  ): void {
    this.http
      .delete<void>(
        `${this.apiUrl}/${id}`,
      )
      .subscribe({
        next: () => {
          this.debts.update(
            (debts) =>
              debts.filter(
                (debt) =>
                  debt.id !== id,
              ),
          );

          this.toast.success(
            this.translate.instant(
              'debts.toast.deleted',
            ),
          );
        },

        error: (error) => {
          console.error(
            'Failed to delete debt',
            error,
          );

          this.showRequestError();
        },
      });
  }

  /* =========================
     RECORD PAYMENT
  ========================= */

  recordPayment(
    debtId: number,
    amount: number,
  ): void {
    const debt =
      this.debts().find(
        (item) =>
          item.id === debtId,
      );

    if (!debt) {
      this.toast.error(
        this.translate.instant(
          'debts.toast.notFound',
        ),
      );

      return;
    }

    const remainingAmount =
      this.getRemainingAmount(
        debt,
      );

    if (
      amount <= 0 ||
      amount >
        remainingAmount
    ) {
      this.toast.error(
        this.translate.instant(
          'debts.toast.invalidPayment',
        ),
      );

      return;
    }

    const payload:
      PaymentPayload = {
        amount,
      };

    this.http
      .post<Debt>(
        `${this.apiUrl}/${debtId}/payments`,
        payload,
      )
      .subscribe({
        next: (updatedDebt) => {
          this.debts.update(
            (debts) =>
              debts.map(
                (item) =>
                  item.id ===
                  updatedDebt.id
                    ? updatedDebt
                    : item,
              ),
          );

          this.toast.success(
            this.translate.instant(
              updatedDebt.status ===
                'paid'
                ? 'debts.toast.fullyPaid'
                : 'debts.toast.paymentRecorded',
            ),
          );
        },

        error: (error) => {
          console.error(
            'Failed to record payment',
            error,
          );

          this.showRequestError();
        },
      });
  }

  /* =========================
     Payload
  ========================= */

  private toPayload(
    debt: Debt,
  ): DebtPayload {
    return {
      personName:
        debt.personName.trim(),

      type: debt.type,

      totalAmount:
        debt.totalAmount,

      paidAmount:
        debt.paidAmount,

      dueDate:
        debt.dueDate,

      note:
        debt.note?.trim() ||
        null,
    };
  }

  /* =========================
     Request Error
  ========================= */

  private showRequestError(): void {
    this.toast.error(
      this.translate.instant(
        'debts.toast.requestFailed',
      ),
    );
  }
}
