import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { LucideAngularModule, Utensils, House, Car, ShoppingBag, Gamepad2 } from 'lucide-angular';
import { LocaleNumberPipe } from '../../../../shared/pipes/locale-number-pipe';

interface BudgetItem {
  id: number;
  nameKey: string;
  spent: number;
  limit: number;
  icon: any;
  iconClass: string;
}

@Component({
  selector: 'app-budget-progress',
  imports: [TranslatePipe, LucideAngularModule, LocaleNumberPipe],
  templateUrl: './budget-progress.html',
  styleUrl: './budget-progress.scss',
})
export class BudgetProgress {
  readonly budgets: BudgetItem[] = [
    {
      id: 1,
      nameKey: 'dashboard.budget.food',
      spent: 4_200_000,
      limit: 6_000_000,
      icon: Utensils,
      iconClass: 'food',
    },
    {
      id: 2,
      nameKey: 'dashboard.budget.housing',
      spent: 5_200_000,
      limit: 7_000_000,
      icon: House,
      iconClass: 'housing',
    },
    {
      id: 3,
      nameKey: 'dashboard.budget.transportation',
      spent: 2_100_000,
      limit: 3_000_000,
      icon: Car,
      iconClass: 'transportation',
    },
    {
      id: 4,
      nameKey: 'dashboard.budget.shopping',
      spent: 1_850_000,
      limit: 2_500_000,
      icon: ShoppingBag,
      iconClass: 'shopping',
    },
    {
      id: 5,
      nameKey: 'dashboard.budget.entertainment',
      spent: 1_300_000,
      limit: 1_500_000,
      icon: Gamepad2,
      iconClass: 'entertainment',
    },
  ];

  getPercentage(spent: number, limit: number): number {
    if (limit <= 0) {
      return 0;
    }

    return Math.min(Math.round((spent / limit) * 100), 100);
  }

  getProgressStatus(percentage: number): string {
    if (percentage >= 90) {
      return 'danger';
    }

    if (percentage >= 75) {
      return 'warning';
    }

    return 'safe';
  }
}
