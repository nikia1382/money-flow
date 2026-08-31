import { Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { LucideAngularModule, ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from 'lucide-angular';
import { DashboardSearchService } from '../../../../core/services/dashboard-search.service';
import { LocaleNumberPipe } from '../../../../shared/pipes/locale-number-pipe';

type TransactionType = 'income' | 'expense' | 'transfer';

interface Transaction {
  id: number;
  title: string;
  category: string;
  date: string;
  amount: number;
  type: TransactionType;
}

@Component({
  selector: 'app-recent-transactions',
  imports: [TranslatePipe, LucideAngularModule, LocaleNumberPipe],
  templateUrl: './recent-transactions.html',
  styleUrl: './recent-transactions.scss',
})
export class RecentTransactions {
  private readonly dashboardSearch = inject(DashboardSearchService);

  readonly ArrowDownLeft = ArrowDownLeft;
  readonly ArrowUpRight = ArrowUpRight;
  readonly ArrowLeftRight = ArrowLeftRight;

  readonly transactions: Transaction[] = [
    {
      id: 1,
      title: 'Salary',
      category: 'Income',
      date: 'Aug 12',
      amount: 35_000_000,
      type: 'income',
    },
    {
      id: 2,
      title: 'Restaurant',
      category: 'Food',
      date: 'Aug 11',
      amount: 850_000,
      type: 'expense',
    },
    {
      id: 3,
      title: 'Internet Bill',
      category: 'Bills',
      date: 'Aug 10',
      amount: 350_000,
      type: 'expense',
    },
    {
      id: 4,
      title: 'Transfer to Savings',
      category: 'Transfer',
      date: 'Aug 9',
      amount: 5_000_000,
      type: 'transfer',
    },
  ];
  /*   readonly filteredTransactions =
  computed(() => { */
  /* 
    const search =
      this.dashboardSearch.searchTerm(); */

  /*     if (!search) {
      return this.transactions;
    } */

  /*     return this.transactions.filter(
      transaction =>
        transaction.title
          .toLowerCase()
          .includes(search) ||

        transaction.category
          .toLowerCase()
          .includes(search) ||

        transaction.type
          .toLowerCase()
          .includes(search)
    ); */

  /*   });
} */
}
