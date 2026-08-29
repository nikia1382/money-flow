import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
  LucideAngularModule,
  Plus,
  Target,
  TrendingUp,
  CalendarDays,
  CircleDollarSign,
  MoreHorizontal
} from 'lucide-angular';
import { AddGoalModal, GoalFormValue } from '../../../../shared/components/add-goal-modal/add-goal-modal';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { StateView } from '../../../../shared/components/state-view/state-view';

interface FinancialGoal {
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
    ConfirmDialog,
    StateView
  ],
  templateUrl: './goals.html',
  styleUrl: './goals.scss'
})
export class Goals {

  readonly Plus = Plus;
  readonly Target = Target;
  readonly TrendingUp = TrendingUp;
  readonly CircleDollarSign = CircleDollarSign;
  readonly CalendarDays = CalendarDays;
  readonly MoreHorizontal = MoreHorizontal;
isAddGoalOpen = false;
isEditGoalOpen = false;
goalToDelete: FinancialGoal | null = null;
selectedGoal: FinancialGoal | null = null;
  goals: FinancialGoal[] = [
    {
      id: 1,
      title: 'Emergency Fund',
      category: 'Savings',
      targetAmount: 50_000_000,
      savedAmount: 32_500_000,
      deadline: '2026-12-20'
    },
    {
      id: 2,
      title: 'New Laptop',
      category: 'Technology',
      targetAmount: 80_000_000,
      savedAmount: 24_000_000,
      deadline: '2027-02-15'
    },
    {
      id: 3,
      title: 'Summer Vacation',
      category: 'Travel',
      targetAmount: 35_000_000,
      savedAmount: 28_000_000,
      deadline: '2026-10-01'
    }
  ];

  get totalTarget(): number {
    return this.goals.reduce(
      (total, goal) => total + goal.targetAmount,
      0
    );
  }

  get totalSaved(): number {
    return this.goals.reduce(
      (total, goal) => total + goal.savedAmount,
      0
    );
  }

  get overallProgress(): number {
    if (!this.totalTarget) return 0;

    return Math.round(
      (this.totalSaved / this.totalTarget) * 100
    );
  }

  get completedGoals(): number {
    return this.goals.filter(
      goal => goal.savedAmount >= goal.targetAmount
    ).length;
  }

  getProgress(goal: FinancialGoal): number {
    if (!goal.targetAmount) return 0;

    return Math.min(
      100,
      Math.round(
        (goal.savedAmount / goal.targetAmount) * 100
      )
    );
  }

  getRemaining(goal: FinancialGoal): number {
    return Math.max(
      0,
      goal.targetAmount - goal.savedAmount
    );
  }

addGoal(): void {
  this.isAddGoalOpen = true;
}

openGoalMenu(goal: FinancialGoal): void {
  this.selectedGoal = goal;
}
  closeAddGoal(): void {
  this.isAddGoalOpen = false;
}

saveGoal(form: GoalFormValue): void {
  const newGoal: FinancialGoal = {
    id: Date.now(),
    title: form.title,
    category: form.category,
    targetAmount: form.targetAmount,
    savedAmount: form.savedAmount,
    deadline: form.deadline
  };

  this.goals = [
    ...this.goals,
    newGoal
  ];
}
editGoal(goal: FinancialGoal): void {
  this.selectedGoal = goal;
  this.isEditGoalOpen = true;
}
closeEditGoal(): void {
  this.isEditGoalOpen = false;
  this.selectedGoal = null;
}
updateGoal(form: GoalFormValue): void {
  if (!this.selectedGoal) return;

  this.goals = this.goals.map(goal =>
    goal.id === this.selectedGoal!.id
      ? {
          ...goal,
          ...form
        }
      : goal
  );

  this.closeEditGoal();
}
requestDelete(goal: FinancialGoal): void {
  this.goalToDelete = goal;
}

cancelDelete(): void {
  this.goalToDelete = null;
}

confirmDelete(): void {
  if (!this.goalToDelete) return;

  this.goals = this.goals.filter(
    goal => goal.id !== this.goalToDelete!.id
  );

  this.goalToDelete = null;
  this.selectedGoal = null;
}
}