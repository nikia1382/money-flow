import {
  computed,
  inject,
  Injectable,
  signal,
} from '@angular/core';

import {
  HttpClient,
} from '@angular/common/http';

import {
  RecurringPayment,
} from '../models/recurring-payment.model';

/* =========================
   API Models
========================= */

interface CategoryApiResponse {
  id: number;
  name: string;
  type: string;
  icon: string | null;
}

interface AccountApiResponse {
  id: number;
  name: string;
}

interface RecurringPaymentApiResponse {
  id: number;

  title: string;

  category: CategoryApiResponse;

  amount: number;

  account: AccountApiResponse;

  frequency: string;

  nextPaymentDate: string;

  status:
    | 'active'
    | 'dueSoon'
    | 'overdue';
}

interface RecurringPaymentRequest {
  title: string;

  categoryId: number;

  amount: number;

  accountId: number;

  frequency: string;

  nextPaymentDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class RecurringPaymentsService {

  /* =========================
     API
  ========================= */

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8080/api/recurring-payments';

  private readonly categoriesApiUrl =
    'http://localhost:8080/api/categories';

  private readonly accountsApiUrl =
    'http://localhost:8080/api/accounts';

  /* =========================
     State
  ========================= */

  readonly payments =
    signal<RecurringPayment[]>([]);

readonly categories =
  signal<CategoryApiResponse[]>([]);

readonly accounts =
  signal<AccountApiResponse[]>([]);

  /* =========================
     Constructor
  ========================= */
constructor() {
  this.refreshReferenceData();
  this.loadPayments();
}

  /* =========================
     Summary
  ========================= */

  readonly monthlyTotal =
    computed(() =>
      this.payments().reduce(
        (total, payment) =>
          total +
          this.toMonthlyAmount(
            payment,
          ),
        0,
      ),
    );

  readonly activeCount =
    computed(
      () =>
        this.payments().filter(
          (payment) =>
            payment.status ===
            'active',
        ).length,
    );

  readonly dueSoonCount =
    computed(
      () =>
        this.payments().filter(
          (payment) =>
            payment.status ===
            'dueSoon',
        ).length,
    );

  readonly overdueCount =
    computed(
      () =>
        this.payments().filter(
          (payment) =>
            payment.status ===
            'overdue',
        ).length,
    );

  /* =========================
     Upcoming Payments
  ========================= */

  readonly upcomingPayments =
    computed(() => {
      const today =
        new Date();

      today.setHours(
        0,
        0,
        0,
        0,
      );

      return this.payments()
        .filter((payment) => {
          const paymentDate =
            new Date(
              `${payment.nextPaymentDate}T00:00:00`,
            );

          if (
            Number.isNaN(
              paymentDate.getTime(),
            )
          ) {
            return false;
          }

          return (
            paymentDate.getTime() >=
            today.getTime()
          );
        })
        .sort(
          (a, b) =>
            new Date(
              `${a.nextPaymentDate}T00:00:00`,
            ).getTime() -
            new Date(
              `${b.nextPaymentDate}T00:00:00`,
            ).getTime(),
        )
        .slice(
          0,
          4,
        );
    });

  /* =========================
     Categories
  ========================= */

  private loadCategories(): void {
    this.http
      .get<CategoryApiResponse[]>(
        this.categoriesApiUrl,
      )
      .subscribe({
        next: (categories) => {
          this.categories.set(
            categories,
          );
        },

        error: (error) => {
          console.error(
            'Failed to load categories',
            error,
          );
        },
      });
  }

  private getCategoryId(
    categoryName: string,
  ): number | null {

    const normalizedName =
      categoryName
        .trim()
        .toLowerCase();

    const category =
      this.categories().find(
        (item) =>
          item.name
            .trim()
            .toLowerCase() ===
          normalizedName,
      );

    return category?.id ?? null;
  }

  /* =========================
     Accounts
  ========================= */

  private loadAccounts(): void {
    this.http
      .get<AccountApiResponse[]>(
        this.accountsApiUrl,
      )
      .subscribe({
        next: (accounts) => {
          this.accounts.set(
            accounts,
          );
        },

        error: (error) => {
          console.error(
            'Failed to load accounts',
            error,
          );
        },
      });
  }

  private getAccountId(
    accountName: string,
  ): number | null {

    const normalizedName =
      accountName
        .trim()
        .toLowerCase();

    const account =
      this.accounts().find(
        (item) =>
          item.name
            .trim()
            .toLowerCase() ===
          normalizedName,
      );

    return account?.id ?? null;
  }

  /* =========================
     GET
  ========================= */

  private loadPayments(): void {
    this.http
      .get<
        RecurringPaymentApiResponse[]
      >(
        this.apiUrl,
      )
      .subscribe({
        next: (payments) => {
          this.payments.set(
            payments.map(
              (payment) =>
                this.mapPayment(
                  payment,
                ),
            ),
          );
        },

        error: (error) => {
          console.error(
            'Failed to load recurring payments',
            error,
          );
        },
      });
  }

  /* =========================
     POST
  ========================= */

  addPayment(
    payment: Omit<
      RecurringPayment,
      'id' | 'status'
    >,
  ): void {

    const categoryId =
      this.getCategoryId(
        payment.category,
      );

    const accountId =
      this.getAccountId(
        payment.account,
      );

    if (categoryId === null) {
      console.error(
        'Category not found:',
        payment.category,
      );

      return;
    }

    if (accountId === null) {
      console.error(
        'Account not found:',
        payment.account,
      );

      return;
    }

    const payload:
      RecurringPaymentRequest = {

      title:
        payment.title,

      categoryId,

      amount:
        payment.amount,

      accountId,

      frequency:
        payment.frequency,

      nextPaymentDate:
        payment.nextPaymentDate,
    };

    this.http
      .post<
        RecurringPaymentApiResponse
      >(
        this.apiUrl,
        payload,
      )
      .subscribe({
        next: (
          createdPayment,
        ) => {
          this.payments.update(
            (items) => [
              ...items,

              this.mapPayment(
                createdPayment,
              ),
            ],
          );
        },

        error: (error) => {
          console.error(
            'Failed to add recurring payment',
            error,
          );
        },
      });
  }

  /* =========================
     PUT
  ========================= */

  updatePayment(
    updatedPayment:
      RecurringPayment,
  ): void {

    const categoryId =
      this.getCategoryId(
        updatedPayment.category,
      );

    const accountId =
      this.getAccountId(
        updatedPayment.account,
      );

    if (categoryId === null) {
      console.error(
        'Category not found:',
        updatedPayment.category,
      );

      return;
    }

    if (accountId === null) {
      console.error(
        'Account not found:',
        updatedPayment.account,
      );

      return;
    }

    const payload:
      RecurringPaymentRequest = {

      title:
        updatedPayment.title,

      categoryId,

      amount:
        updatedPayment.amount,

      accountId,

      frequency:
        updatedPayment.frequency,

      nextPaymentDate:
        updatedPayment.nextPaymentDate,
    };

    this.http
      .put<
        RecurringPaymentApiResponse
      >(
        `${this.apiUrl}/${updatedPayment.id}`,
        payload,
      )
      .subscribe({
        next: (
          savedPayment,
        ) => {
          const mappedPayment =
            this.mapPayment(
              savedPayment,
            );

          this.payments.update(
            (items) =>
              items.map(
                (item) =>
                  item.id ===
                  mappedPayment.id
                    ? mappedPayment
                    : item,
              ),
          );
        },

        error: (error) => {
          console.error(
            'Failed to update recurring payment',
            error,
          );
        },
      });
  }

  /* =========================
     DELETE
  ========================= */

  deletePayment(
    id: number,
  ): void {

    this.http
      .delete<void>(
        `${this.apiUrl}/${id}`,
      )
      .subscribe({
        next: () => {
          this.payments.update(
            (items) =>
              items.filter(
                (item) =>
                  item.id !== id,
              ),
          );
        },

        error: (error) => {
          console.error(
            'Failed to delete recurring payment',
            error,
          );
        },
      });
  }

  /* =========================
     Mapper
  ========================= */

private mapPayment(
  payment: RecurringPaymentApiResponse,
): RecurringPayment {
  return {
    id:
      payment.id,

    title:
      payment.title,

    category:
      payment.category?.name ??
      'Unknown',

    amount:
      payment.amount,

    account:
      payment.account?.name ??
      'Unknown',

    frequency:
      payment.frequency as
        RecurringPayment['frequency'],

    nextPaymentDate:
      payment.nextPaymentDate,

    status:
      payment.status,
  };
}

  /* =========================
     Monthly Conversion
  ========================= */

  private toMonthlyAmount(
    payment: RecurringPayment,
  ): number {

    switch (
      payment.frequency
    ) {

      case 'weekly':
        return Math.round(
          (payment.amount * 52) /
            12,
        );

      case 'yearly':
        return Math.round(
          payment.amount /
            12,
        );

      case 'monthly':
      default:
        return payment.amount;
    }
  }
  refreshReferenceData(): void {
  this.loadCategories();
  this.loadAccounts();
}
}