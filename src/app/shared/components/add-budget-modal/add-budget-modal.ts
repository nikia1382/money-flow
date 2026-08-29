import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  LucideAngularModule,
  X,
  Utensils,
  Car,
  ShoppingBag,
  ReceiptText,
  Gamepad2,
  HeartPulse,
  GraduationCap,
  Shapes,
} from 'lucide-angular';

import { TranslatePipe } from '@ngx-translate/core';

import { Budget } from '../../../features/budgets/models/budget.model';

import { MonthSelector } from '../month-selector/month-selector';

import { MonthOption } from '../month-selector/month-option.model';

export interface BudgetForm {
  category: string;
  limit: number | null;
  month: string;
}

@Component({
  selector: 'app-add-budget-modal',

  imports: [FormsModule, LucideAngularModule, TranslatePipe, MonthSelector],

  templateUrl: './add-budget-modal.html',
  styleUrl: './add-budget-modal.scss',
})
export class AddBudgetModal implements OnChanges {
  /* =========================
     Inputs
  ========================= */

  @Input()
  budgetToEdit: Budget | null = null;

  /* =========================
     Outputs
  ========================= */

  @Output()
  closeModal = new EventEmitter<void>();

  @Output()
  saveBudget = new EventEmitter<BudgetForm>();

  /* =========================
     Icons
  ========================= */

  readonly X = X;

  /* =========================
     Categories
  ========================= */

  readonly categories = [
    {
      value: 'Food',
      icon: Utensils,
    },
    {
      value: 'Transportation',
      icon: Car,
    },
    {
      value: 'Shopping',
      icon: ShoppingBag,
    },
    {
      value: 'Bills',
      icon: ReceiptText,
    },
    {
      value: 'Entertainment',
      icon: Gamepad2,
    },
    {
      value: 'Health',
      icon: HeartPulse,
    },
    {
      value: 'Education',
      icon: GraduationCap,
    },
    {
      value: 'Other',
      icon: Shapes,
    },
  ];

  /* =========================
     Months
  ========================= */

  readonly months: MonthOption[] = [
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

  /* =========================
     Form
  ========================= */

  form: BudgetForm = this.createEmptyForm();

  /* =========================
     Mode
  ========================= */

  get isEditMode(): boolean {
    return !!this.budgetToEdit;
  }

  /* =========================
     Validation
  ========================= */

  get isFormValid(): boolean {
    return (
      !!this.form.category && this.form.limit !== null && this.form.limit > 0 && !!this.form.month
    );
  }

  /* =========================
     Lifecycle
  ========================= */

  ngOnChanges(): void {
    if (!this.budgetToEdit) {
      return;
    }

    this.form = {
      category: this.budgetToEdit.category,

      limit: this.budgetToEdit.limit,

      month: this.budgetToEdit.month,
    };
  }

  /* =========================
     Actions
  ========================= */

  close(): void {
    this.closeModal.emit();
  }

  save(): void {
    if (!this.isFormValid) {
      return;
    }

    this.saveBudget.emit({
      ...this.form,
    });
  }

  /* =========================
     Helpers
  ========================= */

  private setFormData(): void {
    if (!this.budgetToEdit) {
      this.form = this.createEmptyForm();

      return;
    }

    this.form = {
      category: this.budgetToEdit.category,

      limit: this.budgetToEdit.limit,

      month: this.budgetToEdit.month,
    };
  }

  private createEmptyForm(): BudgetForm {
    return {
      category: '',
      limit: null,
      month: '2026-08',
    };
  }
}
