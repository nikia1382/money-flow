import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { IncomeExpenseChart } from '../../components/income-expense-chart/income-expense-chart';
import { LucideAngularModule, Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-angular';
import { RecentTransactions } from '../../components/recent-transactions/recent-transactions';
import { BudgetProgress } from '../../components/budget-progress/budget-progress';
import { SpendingBreakdown } from '../../components/spending-breakdown/spending-breakdown';
import { UpcomingPayments } from '../../components/upcoming-payments/upcoming-payments';
import { FinancialGoals } from '../../components/financial-goals/financial-goals';
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
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard {
  constructor() {
    console.log('MY REAL DASHBOARD LOADED');
  }
  readonly Wallet = Wallet;
  readonly TrendingUp = TrendingUp;
  readonly TrendingDown = TrendingDown;
  readonly PiggyBank = PiggyBank;
}
