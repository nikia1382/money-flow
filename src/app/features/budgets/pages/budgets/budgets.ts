import { Component, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { LucideAngularModule, Plus, SlidersHorizontal } from 'lucide-angular';

import { TranslatePipe } from '@ngx-translate/core';

import { BudgetCard } from '../../components/budget-card/budget-card';

import { Budget } from '../../models/budget.model';

import { BudgetsService } from '../../services/budgets';
import {
  AddBudgetModal,
  BudgetForm,
} from '../../../../shared/components/add-budget-modal/add-budget-modal';
import { MonthSelector } from '../../../../shared/components/month-selector/month-selector';
import { MonthOption } from '../../../../shared/components/month-selector/month-option.model';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { PiggyBank, SearchX } from 'lucide-angular';

import { StateView } from '../../../../shared/components/state-view/state-view';
import { LocaleNumberPipe } from '../../../../shared/pipes/locale-number-pipe';

type BudgetStatusFilter = 'all' | 'active' | 'over';

@Component({
  selector: 'app-budgets',

  imports: [
    LucideAngularModule,
    FormsModule,
    TranslatePipe,
    BudgetCard,
    AddBudgetModal,
    MonthSelector,
    ConfirmDialog,
    StateView,
    LocaleNumberPipe,
  ],

  templateUrl: './budgets.html',
  styleUrl: './budgets.scss',
})
export class Budgets {
  private readonly budgetsService = inject(BudgetsService);

  readonly budgets = this.budgetsService.budgets;
  readonly editingBudget = signal<Budget | null>(null);
  readonly PiggyBank = PiggyBank;
  readonly SearchX = SearchX;
  readonly Plus = Plus;

  /*   readonly CalendarDays =
    CalendarDays; */

  readonly SlidersHorizontal = SlidersHorizontal;

  readonly budgetPendingDelete = signal<Budget | null>(null);
  selectedStatus: BudgetStatusFilter = 'all';

selectedMonth = '2026-09';

readonly months: MonthOption[] = [
  {
    value: '2026-09',
    labelKey: 'budgets.months.september2026',
  },
  {
    value: '2026-08',
    labelKey: 'budgets.months.august2026',
  },
  {
    value: '2026-07',
    labelKey: 'budgets.months.july2026',
  },
  {
    value: '2026-06',
    labelKey: 'budgets.months.june2026',
  },
];

  get budgetsForSelectedMonth(): Budget[] {
    return this.budgets().filter((budget) => budget.month === this.selectedMonth);
  }

  get filteredBudgets(): Budget[] {
    return this.budgetsForSelectedMonth.filter((budget) => {
      switch (this.selectedStatus) {
        case 'over':
          return budget.spent > budget.limit;

        case 'active':
          return budget.spent <= budget.limit;

        case 'all':
        default:
          return true;
      }
    });
  }

  get totalBudget(): number {
    return this.budgetsForSelectedMonth.reduce((total, budget) => total + budget.limit, 0);
  }

  get totalSpent(): number {
    return this.budgetsForSelectedMonth.reduce((total, budget) => total + budget.spent, 0);
  }

  get totalRemaining(): number {
    return this.totalBudget - this.totalSpent;
  }

  get overBudgetCount(): number {
    return this.budgetsForSelectedMonth.filter((budget) => budget.spent > budget.limit).length;
  }
  readonly isAddBudgetOpen = signal(false);

  openAddBudget(): void {
    this.isAddBudgetOpen.set(true);
  }

  closeAddBudget(): void {
    this.isAddBudgetOpen.set(false);
  }

  addBudget(form: BudgetForm): void {
    if (form.limit === null) {
      return;
    }

    this.budgetsService.addBudget({
      category: form.category,
      limit: form.limit,
      spent: 0,
      month: form.month,
    });

    this.selectedMonth = form.month;

    this.closeAddBudget();
  }
  openEditBudget(budget: Budget): void {
    this.editingBudget.set(budget);
  }

  closeEditBudget(): void {
    this.editingBudget.set(null);
  }

  updateBudget(form: BudgetForm): void {
    const budget = this.editingBudget();

    if (!budget || form.limit === null) {
      return;
    }

    this.budgetsService.updateBudget({
      ...budget,
      category: form.category,
      limit: form.limit,
      month: form.month,
    });

    this.selectedMonth = form.month;

    this.closeEditBudget();
  }
  openDeleteBudget(budgetId: number): void {
    const budget = this.budgets().find((item) => item.id === budgetId);

    if (!budget) {
      return;
    }

    this.budgetPendingDelete.set(budget);
  }
  cancelDeleteBudget(): void {
    this.budgetPendingDelete.set(null);
  }
  confirmDeleteBudget(): void {
    const budget = this.budgetPendingDelete();

    if (!budget) {
      return;
    }

    this.budgetsService.deleteBudget(budget.id);

    this.budgetPendingDelete.set(null);
  }
  clearFilters(): void {
    this.selectedStatus = 'all';
  }
}
