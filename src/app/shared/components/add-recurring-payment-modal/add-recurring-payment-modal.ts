import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  LucideAngularModule,
  X
} from 'lucide-angular';

import {
  TranslatePipe
} from '@ngx-translate/core';

import {
  AccountsService
} from '../../../features/accounts/services/accounts';
import { RecurringPayment } from '../../../features/recurring-payments/models/recurring-payment.model';


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
  selector: 'app-add-recurring-payment-modal',

  imports: [
    FormsModule,
    LucideAngularModule,
    TranslatePipe
  ],

  templateUrl:
    './add-recurring-payment-modal.html',

  styleUrl:
    './add-recurring-payment-modal.scss'
})
export class AddRecurringPaymentModal
  implements OnChanges {

  private readonly accountsService =
    inject(AccountsService);
@Input()
paymentToEdit:
  RecurringPayment | null = null;

  @Output()
  closeModal =
    new EventEmitter<void>();

  @Output()
  savePayment =
    new EventEmitter<RecurringPaymentForm>();


  readonly X = X;


  readonly accounts =
    this.accountsService.accounts;


  readonly categories = [
    'Housing',
    'Bills',
    'Health',
    'Entertainment',
    'Education',
    'Subscriptions',
    'Insurance',
    'Other'
  ];


  form: RecurringPaymentForm = {
    title: '',
    category: '',
    amount: null,
    account: '',
    frequency: 'monthly',
    nextPaymentDate: ''
  };


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


  close(): void {

    this.closeModal.emit();

  }


  save(): void {

    if (!this.isFormValid) {
      return;
    }

    this.savePayment.emit({
      ...this.form
    });

  }
get isEditMode(): boolean {
  return !!this.paymentToEdit;
}
ngOnChanges(
  changes: SimpleChanges
): void {

  if (
    changes['paymentToEdit']
  ) {
    this.setFormData();
  }

}
private setFormData(): void {

  if (!this.paymentToEdit) {

    this.form = {
      title: '',
      category: '',
      amount: null,
      account: '',
      frequency: 'monthly',
      nextPaymentDate: ''
    };

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
      this.paymentToEdit.nextPaymentDate
  };

}
}