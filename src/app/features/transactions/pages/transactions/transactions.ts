import { Component, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { LucideAngularModule, Plus, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-angular';

import { TransactionsService } from '../../services/transactions';

import { Transaction, TransactionType } from '../../models/transaction.model';

import { AccountsService } from '../../../accounts/services/accounts';

import { Pagination } from '../../../../shared/components/pagination/pagination';

import {
  AddTransactionModal,
  TransactionForm,
} from '../../../../shared/components/add-transaction-modal/add-transaction-modal';
import { LocaleNumberPipe } from '../../../../shared/pipes/locale-number-pipe';
import { translate, TranslatePipe } from '@ngx-translate/core';
import { DataTable } from '../../../../shared/components/data-table/data-table';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { DataTableColumn } from '../../../../shared/components/data-table/data-table.model';
type TransactionTypeFilter = 'all' | TransactionType;

type TransactionSort = 'newest' | 'oldest' | 'highest' | 'lowest';

@Component({
  selector: 'app-transactions',

  imports: [
    LucideAngularModule,
    FormsModule,
    Pagination,
    AddTransactionModal,
    LocaleNumberPipe,
    TranslatePipe,
    DataTable,
    ConfirmDialog,
  ],

  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
})
export class Transactions {
  /* =========================
     Services
  ========================= */

  private readonly transactionsService = inject(TransactionsService);

  private readonly accountsService = inject(AccountsService);

  /* =========================
     Data
  ========================= */
  readonly transactionColumns: DataTableColumn<Transaction>[] = [
    {
      key: 'title',
      labelKey: 'transactions.table.transaction',
      width: '2fr',
    },
{
  key: 'category',
  labelKey: 'transactions.filters.category',
  valueKeyPrefix: 'transactions.categories',
  width: '1fr',
},
    {
      key: 'account',
      labelKey: 'transactions.table.account',
      width: '1.4fr',
    },
    {
      key: 'date',
      labelKey: 'transactions.table.date',
      type: 'date',
      width: '1fr',
    },
    {
      key: 'amount',
      labelKey: 'transactions.table.amount',
      type: 'currency',
      align: 'end',
      width: '1fr',
    },
    {
      key: 'actions',
      labelKey: '',
      type: 'actions',
      align: 'end',
      width: '50px',
    },
  ];
  readonly transactions = this.transactionsService.transactions;

  readonly accounts = this.accountsService.accounts;
  readonly editingTransaction = signal<Transaction | null>(null);

  readonly transactionPendingDelete = signal<Transaction | null>(null);
  readonly categories = [
    'Income',
    'Food',
    'Transfer',
    'Bills',
    'Shopping',
    'Transportation',
    'Entertainment',
    'Other',
  ];

  /* =========================
     Icons
  ========================= */

  readonly Plus = Plus;

  readonly Search = Search;

  readonly SlidersHorizontal = SlidersHorizontal;

  readonly ArrowUpDown = ArrowUpDown;

  /* =========================
     Search
  ========================= */

  searchTerm = '';

  /* =========================
     Filters
  ========================= */

  isFilterOpen = false;

  selectedType: TransactionTypeFilter = 'all';

  selectedAccount = 'all';

  selectedCategory = 'all';

  /* =========================
     Sort
  ========================= */

  selectedSort: TransactionSort = 'newest';

  /* =========================
     Pagination
  ========================= */

  currentPage = 1;

  pageSize = 10;

  /* =========================
     Add Transaction Modal
  ========================= */

  /*   isAddTransactionOpen = false;
   */

  /* =========================
     Filter Actions
  ========================= */

  toggleFilter(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }

  selectType(type: TransactionTypeFilter): void {
    this.selectedType = type;

    this.resetPagination();
  }

  clearFilters(): void {
    this.selectedType = 'all';

    this.selectedAccount = 'all';

    this.selectedCategory = 'all';

    this.resetPagination();
  }

  clearTypeFilter(): void {
    this.selectedType = 'all';

    this.resetPagination();
  }

  clearAccountFilter(): void {
    this.selectedAccount = 'all';

    this.resetPagination();
  }

  clearCategoryFilter(): void {
    this.selectedCategory = 'all';

    this.resetPagination();
  }

  /* =========================
     Active Filter Count
  ========================= */

  get activeFiltersCount(): number {
    let count = 0;

    if (this.selectedType !== 'all') {
      count++;
    }

    if (this.selectedAccount !== 'all') {
      count++;
    }

    if (this.selectedCategory !== 'all') {
      count++;
    }

    return count;
  }

  /* =========================
     Filter + Sort
  ========================= */

  get filteredTransactions(): Transaction[] {
    const search = this.searchTerm.trim().toLowerCase();

    const filtered = this.transactions().filter((transaction) => {
      const searchableText = [
        transaction.title,
        transaction.category,
        transaction.account,
        transaction.type,
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch = !search || searchableText.includes(search);

      const matchesType = this.selectedType === 'all' || transaction.type === this.selectedType;

      const matchesAccount =
        this.selectedAccount === 'all' || transaction.account === this.selectedAccount;

      const matchesCategory =
        this.selectedCategory === 'all' || transaction.category === this.selectedCategory;

      return matchesSearch && matchesType && matchesAccount && matchesCategory;
    });

    return [...filtered].sort((a, b) => {
      switch (this.selectedSort) {
        case 'highest':
          return b.amount - a.amount;

        case 'lowest':
          return a.amount - b.amount;

        case 'oldest':
          return a.id - b.id;

        case 'newest':
        default:
          return b.id - a.id;
      }
    });
  }

  /* =========================
     Pagination Data
  ========================= */

  get paginatedTransactions(): Transaction[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;

    return this.filteredTransactions.slice(startIndex, startIndex + this.pageSize);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  resetPagination(): void {
    this.currentPage = 1;
  }

  /* =========================
     Summary
  ========================= */

  get totalIncome(): number {
    return this.transactions()
      .filter((transaction) => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0);
  }

  get totalExpenses(): number {
    return this.transactions()
      .filter((transaction) => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0);
  }

  get netFlow(): number {
    return this.totalIncome - this.totalExpenses;
  }

  /* =========================
     Add Transaction
  ========================= */

  /*   openAddTransaction(): void {

    this.isAddTransactionOpen =
      true;

  }


  closeAddTransaction(): void {

    this.isAddTransactionOpen =
      false;

  } */
  readonly isAddTransactionOpen = signal(false);

  openAddTransaction(): void {
    this.isAddTransactionOpen.set(true);
  }

  closeAddTransaction(): void {
    this.isAddTransactionOpen.set(false);
  }

addTransaction(
  newTransaction: TransactionForm,
): void {
  if (newTransaction.amount === null) {
    return;
  }

  this.transactionsService.addTransaction({
    title: newTransaction.title,
    category: newTransaction.category,
    account: newTransaction.account,
    date: newTransaction.date,
    amount: newTransaction.amount,
    type: newTransaction.type,
    description: newTransaction.description,
  });

  this.closeAddTransaction();
  this.resetPagination();
}

  openEditTransaction(transaction: Transaction): void {
    this.editingTransaction.set(transaction);
  }

  closeEditTransaction(): void {
    this.editingTransaction.set(null);
  }
updateTransaction(
  form: TransactionForm,
): void {
  const transaction =
    this.editingTransaction();

  if (
    !transaction ||
    form.amount === null
  ) {
    return;
  }

  this.transactionsService.updateTransaction({
    ...transaction,

    title: form.title,
    category: form.category,
    account: form.account,
    date: form.date,
    amount: form.amount,
    type: form.type,
    description: form.description,
  });

  this.closeEditTransaction();
  this.resetPagination();
}
  requestDeleteTransaction(transaction: Transaction): void {
    this.transactionPendingDelete.set(transaction);
  }

  cancelDeleteTransaction(): void {
    this.transactionPendingDelete.set(null);
  }

  confirmDeleteTransaction(): void {
    const transaction = this.transactionPendingDelete();

    if (!transaction) {
      return;
    }

    this.transactionsService.deleteTransaction(transaction.id);

    this.transactionPendingDelete.set(null);

    this.resetPagination();
  }
  /*   deleteTransaction(
  id: number,
): void {
  this.transactions.update(
    (transactions) =>
      transactions.filter(
        (transaction) =>
          transaction.id !== id,
      ),
  );
} */
}
