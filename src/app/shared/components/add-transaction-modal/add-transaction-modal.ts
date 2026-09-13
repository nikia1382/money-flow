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

import { FormsModule } from '@angular/forms';

import {
  LucideAngularModule,
  X,
} from 'lucide-angular';

import { TranslatePipe } from '@ngx-translate/core';

import {
  Transaction,
  TransactionType,
} from '../../../features/transactions/models/transaction.model';

import {
  TransactionsService,
  CategoryApiResponse,
} from '../../../features/transactions/services/transactions';

export interface TransactionForm {
  title: string;
  type: TransactionType;
  amount: number | null;
  category: string;
  account: string;
  date: string;
  description: string;
}

@Component({
  selector: 'app-add-transaction-modal',

  imports: [
    FormsModule,
    LucideAngularModule,
    TranslatePipe,
  ],

  templateUrl: './add-transaction-modal.html',
  styleUrl: './add-transaction-modal.scss',
})
export class AddTransactionModal
  implements OnInit, OnChanges {

  /* =========================
     Service
  ========================= */

  private transactionsService =
    inject(TransactionsService);

  /* =========================
     Input
  ========================= */

  @Input()
  transactionToEdit: Transaction | null = null;

  /* =========================
     Outputs
  ========================= */

  @Output()
  closeModal =
    new EventEmitter<void>();

  @Output()
  saveTransaction =
    new EventEmitter<TransactionForm>();

  /* =========================
     API Data
  ========================= */

  accounts =
    this.transactionsService.accounts;

  categories =
    this.transactionsService.categories;

  /* =========================
     Icons
  ========================= */

  X = X;

  /* =========================
     Form
  ========================= */

  form: TransactionForm = {
    title: '',
    type: 'expense',
    amount: null,
    category: '',
    account: '',
    date: '',
    description: '',
  };

  /* =========================
     Lifecycle
  ========================= */

  ngOnInit(): void {
    this.transactionsService
      .refreshReferenceData();
  }

  ngOnChanges(
    changes: SimpleChanges,
  ): void {
    if (
      changes['transactionToEdit'] &&
      this.transactionToEdit
    ) {
      this.form = {
        title:
          this.transactionToEdit.title,

        type:
          this.transactionToEdit.type,

        amount:
          this.transactionToEdit.amount,

        category:
          this.transactionToEdit.category,

        account:
          this.transactionToEdit.account,

        date:
          this.transactionToEdit.date,

        description:
          this.transactionToEdit.description ?? '',
      };
    }
  }

  /* =========================
     Mode
  ========================= */

  get isEditMode(): boolean {
    return this.transactionToEdit !== null;
  }

  /* =========================
     Type
  ========================= */

  selectType(
    type: TransactionType,
  ): void {
    this.form.type = type;

    // Category قبلی ممکن است
    // با type جدید سازگار نباشد.
    this.form.category = '';
  }

  /* =========================
     Categories
  ========================= */

  get availableCategories():
    CategoryApiResponse[] {

    if (
      this.form.type === 'transfer'
    ) {
      return this.categories();
    }

    return this.categories().filter(
      (category) =>
        category.type ===
        this.form.type,
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
    this.saveTransaction.emit({
      ...this.form,
    });
  }
}