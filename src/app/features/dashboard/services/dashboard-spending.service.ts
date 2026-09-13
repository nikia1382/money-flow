import {
  computed,
  inject,
  Injectable,
} from '@angular/core';

import {
  TransactionsService,
} from '../../transactions/services/transactions';

export interface SpendingCategory {
  category: string;
  amount: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardSpendingService {
  private readonly transactionsService =
    inject(TransactionsService);

  /* =========================
     Current Month Expenses
  ========================= */

  readonly monthlyExpenses = computed(() =>
    this.transactionsService
      .transactions()
      .filter(
        (transaction) =>
          transaction.type === 'expense' &&
          this.isCurrentMonth(
            transaction.date,
          ),
      ),
  );

  /* =========================
     Total Spending
  ========================= */

  readonly totalSpending = computed(() =>
    this.monthlyExpenses().reduce(
      (total, transaction) =>
        total + transaction.amount,
      0,
    ),
  );

  /* =========================
     Category Totals
  ========================= */

  readonly categoryTotals = computed<
    SpendingCategory[]
  >(() => {
    const totals =
      new Map<string, number>();

    for (
      const transaction of
      this.monthlyExpenses()
    ) {
      const category =
        transaction.category ||
        'Other';

      totals.set(
        category,
        (totals.get(category) ?? 0) +
          transaction.amount,
      );
    }

    return Array.from(
      totals.entries(),
    ).map(
      ([category, amount]) => ({
        category,
        amount,
      }),
    );
  });

  /* =========================
     Date Helper
  ========================= */

  private isCurrentMonth(
    value: string,
  ): boolean {
    const date = new Date(
      /^\d{4}-\d{2}-\d{2}$/.test(
        value,
      )
        ? `${value}T00:00:00`
        : value,
    );

    if (
      Number.isNaN(date.getTime())
    ) {
      return false;
    }

    const now = new Date();

    return (
      date.getFullYear() ===
        now.getFullYear() &&
      date.getMonth() ===
        now.getMonth()
    );
  }
}