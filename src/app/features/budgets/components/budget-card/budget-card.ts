import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

import { Budget } from '../../models/budget.model';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule, MoreHorizontal, Pencil, Trash2 } from 'lucide-angular';
import { LocaleNumberPipe } from '../../../../shared/pipes/locale-number-pipe';

@Component({
  selector: 'app-budget-card',
  imports: [TranslatePipe, LucideAngularModule, LocaleNumberPipe],
  templateUrl: './budget-card.html',
  styleUrl: './budget-card.scss',
})
export class BudgetCard {
  @Input({
    required: true,
  })
  budget!: Budget;

  @Output()
  editBudget = new EventEmitter<Budget>();

  @Output()
  deleteBudget = new EventEmitter<number>();
  readonly MoreHorizontal = MoreHorizontal;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  get progress(): number {
    if (this.budget.limit <= 0) {
      return 0;
    }

    return Math.min((this.budget.spent / this.budget.limit) * 100, 100);
  }

  get remaining(): number {
    return this.budget.limit - this.budget.spent;
  }

  get isOverBudget(): boolean {
    return this.budget.spent > this.budget.limit;
  }
  get progressState(): 'normal' | 'warning' | 'danger' {
    if (this.isOverBudget || this.progress >= 90) {
      return 'danger';
    }

    if (this.progress >= 70) {
      return 'warning';
    }

    return 'normal';
  }

  get statusLabelKey(): string {
    switch (this.progressState) {
      case 'danger':
        return 'budgets.status.danger';

      case 'warning':
        return 'budgets.status.warning';

      case 'normal':
      default:
        return 'budgets.status.normal';
    }
  }
  edit(): void {
    this.editBudget.emit(this.budget);

    this.isMenuOpen.set(false);
  }
  readonly isMenuOpen = signal(false);

  delete(): void {
    this.deleteBudget.emit(this.budget.id);

    this.isMenuOpen.set(false);
  }
  toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
  }
}
