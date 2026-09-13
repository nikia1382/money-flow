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
  Utensils,
  House,
  Car,
  ShoppingBag,
  Gamepad2,
  Wallet,
} from 'lucide-angular';

import {
  LocaleNumberPipe,
} from '../../../../shared/pipes/locale-number-pipe';

import {
  BudgetsService,
} from '../../../budgets/services/budgets';

interface BudgetItem {
  id: number;
  category: string;
  spent: number;
  limit: number;
  icon: any;
  iconClass: string;
}

@Component({
  selector: 'app-budget-progress',

  imports: [
    TranslatePipe,
    LucideAngularModule,
    LocaleNumberPipe,
  ],

  templateUrl: './budget-progress.html',
  styleUrl: './budget-progress.scss',
})
export class BudgetProgress {
  /* =========================
     Service
  ========================= */

  private readonly budgetsService =
    inject(BudgetsService);

  /* =========================
     Budget Data
  ========================= */

  readonly budgets =
  computed<BudgetItem[]>(() => {
    const currentMonth =
      this.getCurrentMonth();

    return this.budgetsService
      .budgets()
      .filter(
        (budget) =>
          budget.month ===
          currentMonth,
      )
      .map((budget) => ({
        id: budget.id,

        category:
          budget.category,

        limit:
          budget.limit,

        spent:
          budget.spent,

        icon:
          this.getCategoryIcon(
            budget.category,
          ),

        iconClass:
          budget.category
            .toLowerCase(),
      }));
  });

  /* =========================
     Percentage
  ========================= */

  getPercentage(
    spent: number,
    limit: number,
  ): number {
    if (limit <= 0) {
      return 0;
    }

    return Math.min(
      Math.round(
        (spent / limit) * 100,
      ),
      100,
    );
  }

  /* =========================
     Progress Status
  ========================= */

  getProgressStatus(
    percentage: number,
  ):
    | 'safe'
    | 'warning'
    | 'danger' {

    if (percentage >= 90) {
      return 'danger';
    }

    if (percentage >= 75) {
      return 'warning';
    }

    return 'safe';
  }

  /* =========================
     Category Icon
  ========================= */

  private getCategoryIcon(
    category: string,
  ) {
    switch (
      category
        .trim()
        .toLowerCase()
    ) {
      case 'food':
        return Utensils;

      case 'housing':
        return House;

      case 'transportation':
        return Car;

      case 'shopping':
        return ShoppingBag;

      case 'entertainment':
        return Gamepad2;

      default:
        return Wallet;
    }
  }
  private getCurrentMonth(): string {
  const now = new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1,
    ).padStart(2, '0');

  return `${year}-${month}`;
}
}