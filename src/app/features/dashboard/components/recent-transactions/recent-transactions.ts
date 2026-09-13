import {
  Component,
  computed,
  inject,
} from '@angular/core';

import {
  TranslatePipe,
} from '@ngx-translate/core';

import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  LucideAngularModule,
} from 'lucide-angular';

import {
  LocaleNumberPipe,
} from '../../../../shared/pipes/locale-number-pipe';

import {
  LocaleDatePipe,
} from '../../../../shared/pipes/locale-date-pipe';

import {
  TransactionsService,
} from '../../../transactions/services/transactions';

@Component({
  selector: 'app-recent-transactions',

  imports: [
    TranslatePipe,
    LucideAngularModule,
    LocaleNumberPipe,
    LocaleDatePipe,
  ],

  templateUrl:
    './recent-transactions.html',

  styleUrl:
    './recent-transactions.scss',
})
export class RecentTransactions {
  private readonly transactionsService =
    inject(TransactionsService);

  readonly ArrowDownLeft =
    ArrowDownLeft;

  readonly ArrowUpRight =
    ArrowUpRight;

  readonly ArrowLeftRight =
    ArrowLeftRight;

  readonly recentTransactions =
    computed(() =>
      [
        ...this.transactionsService
          .transactions(),
      ]
        .sort(
          (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime(),
        )
        .slice(0, 4),
    );
}