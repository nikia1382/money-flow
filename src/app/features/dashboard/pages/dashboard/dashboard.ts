import {
  Component,
  computed,
  inject,
} from '@angular/core';

import {
  TranslatePipe,
} from '@ngx-translate/core';

import {
  LucideAngularModule,
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from 'lucide-angular';

import {
  IncomeExpenseChart,
} from '../../components/income-expense-chart/income-expense-chart';

import {
  RecentTransactions,
} from '../../components/recent-transactions/recent-transactions';

import {
  BudgetProgress,
} from '../../components/budget-progress/budget-progress';

import {
  SpendingBreakdown,
} from '../../components/spending-breakdown/spending-breakdown';

import {
  UpcomingPayments,
} from '../../components/upcoming-payments/upcoming-payments';

import {
  FinancialGoals,
} from '../../components/financial-goals/financial-goals';

import {
  LocaleNumberPipe,
} from '../../../../shared/pipes/locale-number-pipe';

import {
  DashboardSummaryService,
} from '../../services/dashboard-summary.service';

@Component({
  selector: 'app-dashboard',

  imports: [
    TranslatePipe,
    LucideAngularModule,
    IncomeExpenseChart,
    RecentTransactions,
    BudgetProgress,
    SpendingBreakdown,
    UpcomingPayments,
    FinancialGoals,
    LocaleNumberPipe,
  ],

  templateUrl:
    './dashboard.html',

  styleUrl:
    './dashboard.scss',
})
export class Dashboard {
  /* =========================
     Service
  ========================= */

  private readonly dashboardSummaryService =
    inject(
      DashboardSummaryService,
    );

  /* =========================
     Icons
  ========================= */

  readonly Wallet =
    Wallet;

  readonly TrendingUp =
    TrendingUp;

  readonly TrendingDown =
    TrendingDown;

  readonly PiggyBank =
    PiggyBank;

  /* =========================
     Summary
  ========================= */

  readonly totalBalance =
    computed(
      () =>
        this.dashboardSummaryService
          .summary()
          .totalBalance,
    );

  readonly monthlyIncome =
    computed(
      () =>
        this.dashboardSummaryService
          .summary()
          .monthlyIncome,
    );

  readonly monthlyExpenses =
    computed(
      () =>
        this.dashboardSummaryService
          .summary()
          .monthlyExpense,
    );

  readonly monthlySavings =
    computed(
      () =>
        this.dashboardSummaryService
          .summary()
          .monthlySavings,
    );

  /* =========================
     Trends
  ========================= */

  readonly totalBalanceTrend = 0;
  readonly incomeTrend = 0;
  readonly expenseTrend = 0;
  readonly savingsTrend = 0;
}