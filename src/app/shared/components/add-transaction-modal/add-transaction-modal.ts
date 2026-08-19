import { Component, EventEmitter, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { LucideAngularModule, X } from 'lucide-angular';

type TransactionType = 'income' | 'expense' | 'transfer';

interface TransactionForm {
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
  @Output()
  closeModal = new EventEmitter<void>();

  @Output()
  saveTransaction = new EventEmitter<TransactionForm>();

  readonly X = X;

  form: TransactionForm = {
    type: 'expense',
    amount: null,
    category: '',
    account: '',
    date: '',
    description: '',
  };

  close(): void {
    this.closeModal.emit();
  }

  save(): void {
    if (!this.form.amount) {
      return;
    }

    this.saveTransaction.emit({
      ...this.form,
    });

    this.close();
  }
}
