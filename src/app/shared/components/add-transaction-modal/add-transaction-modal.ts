import { Component, EventEmitter, inject, Input, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { LucideAngularModule, X } from 'lucide-angular';

import { AccountsService } from '../../../features/accounts/services/accounts';

import {
  Transaction,
  TransactionType,
} from '../../../features/transactions/models/transaction.model';

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

  imports: [FormsModule, LucideAngularModule],

  templateUrl: './add-transaction-modal.html',
  styleUrl: './add-transaction-modal.scss',
})
export class AddTransactionModal {
  /* =========================
     Service
  ========================= */

  private readonly accountsService = inject(AccountsService);

  /* =========================
     Outputs
  ========================= */
  @Input()
  transactionToEdit: Transaction | null = null;
  @Output()
  closeModal = new EventEmitter<void>();

  @Output()
  saveTransaction = new EventEmitter<TransactionForm>();

  /* =========================
     Data
  ========================= */

  readonly accounts = this.accountsService.accounts;

  readonly categories = [
    'Food',
    'Bills',
    'Shopping',
    'Transportation',
    'Entertainment',
    'Salary',
    'Transfer',
    'Other',
  ];

  /* =========================
     Icons
  ========================= */

  readonly X = X;

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
     Close
  ========================= */

  close(): void {
    this.closeModal.emit();
  }

  /* =========================
     Save
  ========================= */

  save(): void {
    if (
      !this.form.title.trim() ||
      this.form.amount === null ||
      this.form.amount <= 0 ||
      !this.form.category ||
      !this.form.account ||
      !this.form.date
    ) {
      return;
    }

    this.saveTransaction.emit({
      ...this.form,
    });

    this.close();
  }
}
