import {
  Injectable,
  computed,
  inject,
  signal,
} from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Debt } from '../model/debt.model';

import { ToastService } from '../../../shared/services/toast';

@Injectable({
  providedIn: 'root',
})
export class DebtsService {
  /* =========================
     Services
  ========================= */

  private readonly toast =
    inject(ToastService);

  private readonly translate =
    inject(TranslateService);

  /* =========================
     Storage
  ========================= */

  private readonly storageKey =
    'moneyflow_debts';

  /* =========================
     Data
  ========================= */

  readonly debts = signal<Debt[]>(
    this.loadDebts(),
  );

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
          debt.type === 'owed-to-me' &&
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

  readonly activeCount = computed(
    () =>
      this.debts().filter(
        (debt) =>
          this.getDebtStatus(debt) ===
          'active',
      ).length,
  );

  readonly overdueCount = computed(
    () =>
      this.debts().filter(
        (debt) =>
          this.getDebtStatus(debt) ===
          'overdue',
      ).length,
  );

  /* =========================
     Storage Helpers
  ========================= */

  private loadDebts(): Debt[] {
    const saved =
      localStorage.getItem(
        this.storageKey,
      );

    if (saved) {
      try {
        const debts =
          JSON.parse(saved) as Debt[];

        return debts.map((debt) => ({
          ...debt,
          status:
            this.getDebtStatus(debt),
        }));
      } catch {
        localStorage.removeItem(
          this.storageKey,
        );
      }
    }

    return this.getInitialDebts();
  }

  private saveDebts(): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.debts()),
    );
  }

  private getInitialDebts(): Debt[] {
    return [
      {
        id: 1,
        personName: 'Ali',
        type: 'i-owe',
        totalAmount: 20_000_000,
        paidAmount: 5_000_000,
        dueDate: '2026-09-15',
        status: 'active',
        note: 'debts.items.ali.note',
      },
      {
        id: 2,
        personName: 'Sara',
        type: 'owed-to-me',
        totalAmount: 12_000_000,
        paidAmount: 0,
        dueDate: '2026-09-05',
        status: 'active',
        note: 'debts.items.sara.note',
      },
      {
        id: 3,
        personName: 'Reza',
        type: 'owed-to-me',
        totalAmount: 8_000_000,
        paidAmount: 8_000_000,
        dueDate: '2026-08-20',
        status: 'paid',
      },
    ];
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

    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(
      /^\d{4}-\d{2}-\d{2}$/.test(
        debt.dueDate,
      )
        ? `${debt.dueDate}T00:00:00`
        : debt.dueDate,
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
     Add
  ========================= */

  addDebt(
    debt: Debt,
  ): void {
    const newDebt: Debt = {
      ...debt,

      status:
        this.getDebtStatus(debt),
    };

    this.debts.update(
      (debts) => [
        ...debts,
        newDebt,
      ],
    );

    this.saveDebts();

    this.toast.success(
      this.translate.instant(
        'debts.toast.added',
      ),
    );
  }

  /* =========================
     Update
  ========================= */

  updateDebt(
    updatedDebt: Debt,
  ): void {
    const debtWithStatus: Debt = {
      ...updatedDebt,

      status:
        this.getDebtStatus(
          updatedDebt,
        ),
    };

    this.debts.update(
      (debts) =>
        debts.map(
          (debt) =>
            debt.id ===
            updatedDebt.id
              ? debtWithStatus
              : debt,
        ),
    );

    this.saveDebts();

    this.toast.success(
      this.translate.instant(
        'debts.toast.updated',
      ),
    );
  }

  /* =========================
     Delete
  ========================= */

  deleteDebt(
    id: number,
  ): void {
    this.debts.update(
      (debts) =>
        debts.filter(
          (debt) =>
            debt.id !== id,
        ),
    );

    this.saveDebts();

    this.toast.success(
      this.translate.instant(
        'debts.toast.deleted',
      ),
    );
  }

  /* =========================
     Record Payment
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

    const updatedDebt: Debt = {
      ...debt,

      paidAmount:
        debt.paidAmount + amount,
    };

    updatedDebt.status =
      this.getDebtStatus(
        updatedDebt,
      );

    this.debts.update(
      (debts) =>
        debts.map(
          (item) =>
            item.id === debtId
              ? updatedDebt
              : item,
        ),
    );

    this.saveDebts();

    this.toast.success(
      this.translate.instant(
        updatedDebt.status ===
          'paid'
          ? 'debts.toast.fullyPaid'
          : 'debts.toast.paymentRecorded',
      ),
    );
  }
}