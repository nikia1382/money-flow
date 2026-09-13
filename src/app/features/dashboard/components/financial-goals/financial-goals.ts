import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  TranslatePipe,
} from '@ngx-translate/core';

import {
  LucideAngularModule,
  Target,
  Plane,
  Car,
  ShieldCheck,
} from 'lucide-angular';

import {
  LocaleNumberPipe,
} from '../../../../shared/pipes/locale-number-pipe';

import {
  FinancialGoalsService,
} from '../../services/financial-goals.service';

import {
  StateView,
} from '../../../../shared/components/state-view/state-view';

import {
  AddGoalModal,
  GoalFormValue,
} from '../../../../shared/components/add-goal-modal/add-goal-modal';

interface FinancialGoalView {
  id: number;
  title: string;
  current: number;
  target: number;
  icon: any;
  iconClass: string;
}

@Component({
  selector: 'app-financial-goals',

  imports: [
    TranslatePipe,
    LucideAngularModule,
    LocaleNumberPipe,
    StateView,
    AddGoalModal,
  ],

  templateUrl:
    './financial-goals.html',

  styleUrl:
    './financial-goals.scss',
})
export class FinancialGoals {
  /* =========================
     Service
  ========================= */

  private readonly financialGoalsService =
    inject(FinancialGoalsService);

  /* =========================
     State
  ========================= */

  readonly isAddGoalOpen =
    signal(false);

  /* =========================
     Icons
  ========================= */

  readonly Target = Target;

  /* =========================
     Goals
  ========================= */

  readonly goals =
    computed<FinancialGoalView[]>(() =>
      this.financialGoalsService
        .goals()
        .map((goal) => ({
          id:
            goal.id,

          title:
            goal.title,

          current:
            goal.currentAmount,

          target:
            goal.targetAmount,

          icon:
            this.getIcon(
              goal.category,
            ),

          iconClass:
            goal.category
              .toLowerCase(),
        })),
    );

  /* =========================
     Add Goal
  ========================= */

  openAddGoal(): void {
    this.isAddGoalOpen.set(
      true,
    );
  }

  closeAddGoal(): void {
    this.isAddGoalOpen.set(
      false,
    );
  }

  addGoal(
    form: GoalFormValue,
  ): void {
    this.financialGoalsService
      .addGoal({
        title:
          form.title,

        category:
          form.category,

        targetAmount:
          form.targetAmount,

        savedAmount:
          form.savedAmount,

        deadline:
          form.deadline,
      });

    this.closeAddGoal();
  }

  /* =========================
     Percentage
  ========================= */

  getPercentage(
    current: number,
    target: number,
  ): number {
    if (target <= 0) {
      return 0;
    }

    return Math.min(
      Math.round(
        (current / target) * 100,
      ),
      100,
    );
  }

  /* =========================
     Icons
  ========================= */

  private getIcon(
    category: string,
  ) {
    switch (
      category.toLowerCase()
    ) {
      case 'emergency':
        return ShieldCheck;

      case 'travel':
        return Plane;

      case 'car':
        return Car;

      default:
        return Target;
    }
  }
}