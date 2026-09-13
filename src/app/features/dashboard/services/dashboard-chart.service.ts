import {
  computed,
  inject,
  Injectable,
} from '@angular/core';

import {
  TransactionsService,
} from '../../transactions/services/transactions';

export interface MonthlyCashFlow {
  year: number;
  month: number;
  income: number;
  expenses: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardChartService {
  private readonly transactionsService =
    inject(TransactionsService);

  readonly monthlyCashFlow =
    computed<MonthlyCashFlow[]>(() => {
      const map =
        new Map<
          string,
          MonthlyCashFlow
        >();

      for (
        const transaction of
        this.transactionsService
          .transactions()
      ) {
        if (
          transaction.type !==
            'income' &&
          transaction.type !==
            'expense'
        ) {
          continue;
        }

        const date = new Date(
          `${transaction.date}T00:00:00`,
        );

        if (
          Number.isNaN(
            date.getTime(),
          )
        ) {
          continue;
        }

        const year =
          date.getFullYear();

        const month =
          date.getMonth();

        const key =
          `${year}-${month}`;

        const item =
          map.get(key) ?? {
            year,
            month,
            income: 0,
            expenses: 0,
          };

        if (
          transaction.type ===
          'income'
        ) {
          item.income +=
            transaction.amount;
        }

        if (
          transaction.type ===
          'expense'
        ) {
          item.expenses +=
            transaction.amount;
        }

        map.set(key, item);
      }

      return Array.from(
        map.values(),
      ).sort(
        (a, b) =>
          a.year - b.year ||
          a.month - b.month,
      );
    });
}