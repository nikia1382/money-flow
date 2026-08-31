import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { IncomeExpenseChart } from '../../components/income-expense-chart/income-expense-chart';
import { LucideAngularModule, Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-angular';
import { RecentTransactions } from '../../components/recent-transactions/recent-transactions';
import { BudgetProgress } from '../../components/budget-progress/budget-progress';
import { SpendingBreakdown } from '../../components/spending-breakdown/spending-breakdown';
import { UpcomingPayments } from '../../components/upcoming-payments/upcoming-payments';
import { FinancialGoals } from '../../components/financial-goals/financial-goals';
import { LocaleNumberPipe } from '../../../../shared/pipes/locale-number-pipe';
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
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard {
  constructor() {
  }
  readonly Wallet = Wallet;
  readonly TrendingUp = TrendingUp;
  readonly TrendingDown = TrendingDown;
  readonly PiggyBank = PiggyBank;
  readonly totalBalance = 86_500_000;
  readonly monthlyIncome = 35_000_000;
  readonly monthlyExpenses = 21_300_000;
  readonly monthlySavings = 13_700_000;

  readonly totalBalanceTrend = 8.2;
  readonly incomeTrend = 12.5;
  readonly expenseTrend = 4.3;
  readonly savingsTrend = 18.7;
}
