import { Injectable, signal } from '@angular/core';

import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private readonly storageKey = 'moneyflow_transactions';

  readonly transactions = signal<Transaction[]>(this.loadTransactions());

  private loadTransactions(): Transaction[] {
    const saved = localStorage.getItem(this.storageKey);

    if (saved) {
      return JSON.parse(saved);
    }

    return [
      {
        id: 1,
        title: 'Salary',
        category: 'Income',
        account: 'Main Bank Account',
        date: 'Aug 19, 2026',
        amount: 35_000_000,
        type: 'income',
      },

      {
        id: 2,
        title: 'Grocery Shopping',
        category: 'Food',
        account: 'Main Bank Account',
        date: 'Aug 18, 2026',
        amount: 1_850_000,
        type: 'expense',
      },

      {
        id: 3,
        title: 'Transfer to Savings',
        category: 'Transfer',
        account: 'Savings Account',
        date: 'Aug 17, 2026',
        amount: 5_000_000,
        type: 'transfer',
      },
    ];
  }

  private saveTransactions(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.transactions()));
  }

  addTransaction(transaction: Omit<Transaction, 'id'>): void {
    const newTransaction: Transaction = {
      id: Date.now(),
      ...transaction,
    };

    this.transactions.update((transactions) => [...transactions, newTransaction]);

    this.saveTransactions();
  }

  updateTransaction(updatedTransaction: Transaction): void {
    this.transactions.update((transactions) =>
      transactions.map((transaction) =>
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction,
      ),
    );

    this.saveTransactions();
  }

  deleteTransaction(transactionId: number): void {
    this.transactions.update((transactions) =>
      transactions.filter((transaction) => transaction.id !== transactionId),
    );

    this.saveTransactions();
  }
}
