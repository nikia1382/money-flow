import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
} from '@angular/core';

import {
  FormsModule,
} from '@angular/forms';

import {
  Car,
  Gamepad2,
  GraduationCap,
  HeartPulse,
  LucideAngularModule,
  ReceiptText,
  Shapes,
  ShoppingBag,
  Utensils,
  X,
} from 'lucide-angular';

import {
  TranslatePipe,
} from '@ngx-translate/core';

import {
  Budget,
} from '../../../features/budgets/models/budget.model';

import {
  BudgetsService,
} from '../../../features/budgets/services/budgets';

import {
  MonthOption,
} from '../month-selector/month-option.model';

export interface BudgetForm {
  category: string;
  limit: number | null;
  month: string;
}

@Component({
  selector: 'app-add-budget-modal',

  imports: [
    FormsModule,
    LucideAngularModule,
    TranslatePipe,
  ],

  templateUrl:
    './add-budget-modal.html',

  styleUrl:
    './add-budget-modal.scss',
})
export class AddBudgetModal
  implements OnChanges {

  /* =========================
     Service
  ========================= */

  private readonly budgetsService =
    inject(BudgetsService);

  /* =========================
     Inputs
  ========================= */

  @Input()
  budgetToEdit:
    Budget | null = null;

  /* =========================
     Outputs
  ========================= */

  @Output()
  closeModal =
    new EventEmitter<void>();

  @Output()
  saveBudget =
    new EventEmitter<BudgetForm>();

  /* =========================
     Data
  ========================= */

  readonly categories =
    this.budgetsService.categories;

  /* =========================
     Icons
  ========================= */

  readonly X = X;

  /* =========================
     Months
  ========================= */

  readonly months:
    MonthOption[] = [
      {
        value: '2026-09',
        labelKey:
          'budgets.months.september2026',
      },
      {
        value: '2026-08',
        labelKey:
          'budgets.months.august2026',
      },
      {
        value: '2026-07',
        labelKey:
          'budgets.months.july2026',
      },
      {
        value: '2026-06',
        labelKey:
          'budgets.months.june2026',
      },
    ];

  /* =========================
     Form
  ========================= */

  form: BudgetForm =
    this.createEmptyForm();

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
      !!this.form.category &&
      this.form.limit !== null &&
      this.form.limit > 0 &&
      !!this.form.month
    );
  }

  /* =========================
     Lifecycle
  ========================= */

  ngOnChanges(): void {
    this.setFormData();
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
     Category Icon
  ========================= */

  getCategoryIcon(
    categoryName: string,
  ) {
    switch (
      categoryName
        .trim()
        .toLowerCase()
    ) {
      case 'food':
        return Utensils;

      case 'transportation':
        return Car;

      case 'shopping':
        return ShoppingBag;

      case 'bills':
        return ReceiptText;

      case 'entertainment':
        return Gamepad2;

      case 'health':
        return HeartPulse;

      case 'education':
        return GraduationCap;

      default:
        return Shapes;
    }
  }

  /* =========================
     Helpers
  ========================= */

  private setFormData(): void {
    if (!this.budgetToEdit) {
      this.form =
        this.createEmptyForm();

      return;
    }

    this.form = {
      category:
        this.budgetToEdit
          .category,

      limit:
        this.budgetToEdit
          .limit,

      month:
        this.budgetToEdit
          .month,
    };
  }

  private createEmptyForm():
    BudgetForm {
    return {
      category: '',
      limit: null,
      month: '2026-09',
    };
  }
}