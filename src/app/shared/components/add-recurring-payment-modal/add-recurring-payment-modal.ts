import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import {
  FormsModule,
} from '@angular/forms';

import {
  LucideAngularModule,
  X,
} from 'lucide-angular';

import {
  TranslatePipe,
} from '@ngx-translate/core';

import {
  RecurringPayment,
} from '../../../features/recurring-payments/models/recurring-payment.model';

import {
  RecurringPaymentsService,
} from '../../../features/recurring-payments/services/recurring-payments';

export interface RecurringPaymentForm {
  title: string;
  category: string;
  amount: number | null;
  account: string;
  frequency:
    | 'weekly'
    | 'monthly'
    | 'yearly';
  nextPaymentDate: string;
}

@Component({
  selector:
    'app-add-recurring-payment-modal',

  imports: [
    FormsModule,
    LucideAngularModule,
    TranslatePipe,
  ],

  templateUrl:
    './add-recurring-payment-modal.html',

  styleUrl:
    './add-recurring-payment-modal.scss',
})
export class AddRecurringPaymentModal
  implements OnInit, OnChanges {

  /* =========================
     Service
  ========================= */

  private readonly service =
    inject(
      RecurringPaymentsService,
    );

  /* =========================
     Input
  ========================= */

  @Input()
  paymentToEdit:
    RecurringPayment | null = null;

  /* =========================
     Outputs
  ========================= */

  @Output()
  closeModal =
    new EventEmitter<void>();

  @Output()
  savePayment =
    new EventEmitter<RecurringPaymentForm>();

  /* =========================
     API Data
  ========================= */

  readonly accounts =
    this.service.accounts;

  readonly categories =
    this.service.categories;

  /* =========================
     Icons
  ========================= */

  readonly X = X;

  /* =========================
     Form
  ========================= */

  form: RecurringPaymentForm =
    this.createEmptyForm();

  /* =========================
     Lifecycle
  ========================= */

  ngOnInit(): void {
    this.service
      .refreshReferenceData();
  }

  ngOnChanges(
    changes: SimpleChanges,
  ): void {
    if (
      changes['paymentToEdit']
    ) {
      this.setFormData();
    }
  }

  /* =========================
     Mode
  ========================= */

  get isEditMode(): boolean {
    return !!this.paymentToEdit;
  }

  /* =========================
     Categories
  ========================= */

  get availableCategories() {
    return this.categories()
      .filter(
        (category) =>
          category.type ===
          'expense',
      );
  }

  /* =========================
     Validation
  ========================= */

  get isFormValid(): boolean {
    return (
      !!this.form.title.trim() &&
      !!this.form.category &&
      this.form.amount !== null &&
      this.form.amount > 0 &&
      !!this.form.account &&
      !!this.form.frequency &&
      !!this.form.nextPaymentDate
    );
  }

  /* =========================
     Close
  ========================= */

  close(): void {
    this.closeModal.emit();
  }

  /* =========================
     Save
  ========================= */

  save(): void {
    if (!this.isFormValid) {
      return;
    }

    this.savePayment.emit({
      ...this.form,
    });
  }

  /* =========================
     Helpers
  ========================= */

  private setFormData(): void {
    if (!this.paymentToEdit) {
      this.form =
        this.createEmptyForm();

      return;
    }

    this.form = {
      title:
        this.paymentToEdit.title,

      category:
        this.paymentToEdit.category,

      amount:
        this.paymentToEdit.amount,

      account:
        this.paymentToEdit.account,

      frequency:
        this.paymentToEdit.frequency,

      nextPaymentDate:
        this.paymentToEdit
          .nextPaymentDate,
    };
  }

  private createEmptyForm():
    RecurringPaymentForm {

    return {
      title: '',
      category: '',
      amount: null,
      account: '',
      frequency: 'monthly',
      nextPaymentDate: '',
    };
  }
}