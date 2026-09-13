import { CommonModule } from '@angular/common';

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
  Plus,
  Target,
  TrendingUp,
  CalendarDays,
  CircleDollarSign,
  MoreHorizontal,
} from 'lucide-angular';

import {
  AddGoalModal,
  GoalFormValue,
} from '../../../../shared/components/add-goal-modal/add-goal-modal';

import {
  ConfirmDialog,
} from '../../../../shared/components/confirm-dialog/confirm-dialog';

import {
  StateView,
} from '../../../../shared/components/state-view/state-view';

import {
  LocaleNumberPipe,
} from '../../../../shared/pipes/locale-number-pipe';
import { FinancialGoal, FinancialGoalsService } from '../../../dashboard/services/financial-goals.service';
import { ContributeGoalModal } from '../../../../shared/components/contribute-goal-modal/contribute-goal-modal';



interface FinancialGoalView {
  id: number;
  title: string;
  category: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
}

@Component({
  selector: 'app-goals',
  standalone: true,

imports: [
  CommonModule,
  TranslatePipe,
  LucideAngularModule,
  AddGoalModal,
  ContributeGoalModal,
  ConfirmDialog,
  StateView,
  LocaleNumberPipe,
],

  templateUrl: './goals.html',
  styleUrl: './goals.scss',
})
export class Goals {
  /* =========================
     Service
  ========================= */

  private readonly financialGoalsService =
    inject(FinancialGoalsService);

  /* =========================
     Icons
  ========================= */

  readonly Plus = Plus;
  readonly Target = Target;
  readonly TrendingUp = TrendingUp;
  readonly CircleDollarSign = CircleDollarSign;
  readonly CalendarDays = CalendarDays;
  readonly MoreHorizontal = MoreHorizontal;

  /* =========================
     UI State
  ========================= */
  readonly contributionGoal =
  signal<FinancialGoalView | null>(
    null,
  );

  readonly isAddGoalOpen =
    signal(false);

  readonly isEditGoalOpen =
    signal(false);

  readonly goalToDelete =
    signal<FinancialGoalView | null>(null);

  readonly selectedGoal =
    signal<FinancialGoalView | null>(null);

  /* =========================
     Goals
  ========================= */

  readonly goals =
    computed<FinancialGoalView[]>(() =>
      this.financialGoalsService
        .goals()
        .map(
          (
            goal: FinancialGoal,
          ) => ({
            id: goal.id,

            title: goal.title,

            category:
              goal.category,

            targetAmount:
              goal.targetAmount,

            savedAmount:
              goal.currentAmount,

            deadline:
              goal.deadline ?? '',
          }),
        ),
    );

  /* =========================
     Summary
  ========================= */

  readonly totalTarget =
    computed(() =>
      this.goals().reduce(
        (total, goal) =>
          total +
          goal.targetAmount,
        0,
      ),
    );

  readonly totalSaved =
    computed(() =>
      this.goals().reduce(
        (total, goal) =>
          total +
          goal.savedAmount,
        0,
      ),
    );

  readonly overallProgress =
    computed(() => {
      const target =
        this.totalTarget();

      if (!target) {
        return 0;
      }

      return Math.round(
        (this.totalSaved() /
          target) *
          100,
      );
    });

  readonly completedGoals =
    computed(
      () =>
        this.goals().filter(
          (goal) =>
            goal.savedAmount >=
            goal.targetAmount,
        ).length,
    );

  /* =========================
     Progress
  ========================= */

  getProgress(
    goal: FinancialGoalView,
  ): number {
    if (!goal.targetAmount) {
      return 0;
    }

    return Math.min(
      100,
      Math.round(
        (goal.savedAmount /
          goal.targetAmount) *
          100,
      ),
    );
  }

  getRemaining(
    goal: FinancialGoalView,
  ): number {
    return Math.max(
      0,
      goal.targetAmount -
        goal.savedAmount,
    );
  }

  /* =========================
     Add
  ========================= */

  addGoal(): void {
    this.isAddGoalOpen.set(
      true,
    );
  }

  closeAddGoal(): void {
    this.isAddGoalOpen.set(
      false,
    );
  }

  saveGoal(
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
     Menu
  ========================= */

  openGoalMenu(
    goal: FinancialGoalView,
  ): void {
    this.selectedGoal.set(
      goal,
    );
  }

  /* =========================
     Edit
  ========================= */

  editGoal(
    goal: FinancialGoalView,
  ): void {
    this.selectedGoal.set(
      goal,
    );

    this.isEditGoalOpen.set(
      true,
    );
  }

  closeEditGoal(): void {
    this.isEditGoalOpen.set(
      false,
    );

    this.selectedGoal.set(
      null,
    );
  }

  updateGoal(
    form: GoalFormValue,
  ): void {
    const goal =
      this.selectedGoal();

    if (!goal) {
      return;
    }

    this.financialGoalsService
      .updateGoal(
        goal.id,
        {
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
        },
      );

    this.closeEditGoal();
  }

  /* =========================
     Delete
  ========================= */

  requestDelete(
    goal: FinancialGoalView,
  ): void {
    this.goalToDelete.set(
      goal,
    );
  }

  cancelDelete(): void {
    this.goalToDelete.set(
      null,
    );
  }

  confirmDelete(): void {
    const goal =
      this.goalToDelete();

    if (!goal) {
      return;
    }

    this.financialGoalsService
      .deleteGoal(
        goal.id,
      );

    this.goalToDelete.set(
      null,
    );

    this.selectedGoal.set(
      null,
    );
  }
  /* =========================
   Contribution
========================= */

openContribution(
  goal: FinancialGoalView,
): void {
  this.contributionGoal.set(
    goal,
  );

  this.selectedGoal.set(
    null,
  );
}

closeContribution(): void {
  this.contributionGoal.set(
    null,
  );
}

contributeToGoal(
  amount: number,
): void {
  const goal =
    this.contributionGoal();

  if (!goal) {
    return;
  }

  this.financialGoalsService
    .contributeToGoal(
      goal.id,
      amount,
    );

  this.closeContribution();
}
}