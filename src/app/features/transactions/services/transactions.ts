import {
  inject,
  Injectable,
  signal,
} from '@angular/core';

import {
  HttpClient,
} from '@angular/common/http';

import {
  Transaction,
} from '../models/transaction.model';
import { environment } from '../../../../environments/environment';

/* =========================
   API Models
========================= */

export interface CategoryApiResponse {
  id: number;
  name: string;
  type: string;
  icon: string | null;
}

export interface AccountApiResponse {
  id: number;
  name: string;
  type: string;
  balance: number;
  number?: string | null;
}

interface TransactionApiResponse {
  id: number;
  title: string;
  category: CategoryApiResponse;
  account: AccountApiResponse;
  amount: number;
  type: Transaction['type'];
  date: string;
  description?: string | null;
}

interface TransactionRequest {
  title: string;
  categoryId: number;
  accountId: number;
  amount: number;
  type: Transaction['type'];
  date: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  /* =========================
     API
  ========================= */

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/transactions`;

  private readonly categoriesApiUrl =
    `${environment.apiUrl}/categories`;

  private readonly accountsApiUrl =
    `${environment.apiUrl}/accounts`;

  /* =========================
     State
  ========================= */

  readonly transactions =
    signal<Transaction[]>([]);

  /*
   * این دو قبلاً private بودن.
   * چون Modal باید ازشون استفاده کنه،
   * باید public باشن.
   */
  readonly categories =
    signal<CategoryApiResponse[]>([]);

  readonly accounts =
    signal<AccountApiResponse[]>([]);

  /* =========================
     Constructor
  ========================= */

  constructor() {
    this.refreshReferenceData();
    this.loadTransactions();
  }

  /* =========================
     Reference Data
  ========================= */

  refreshReferenceData(): void {
    this.loadCategories();
    this.loadAccounts();
  }

  /* =========================
     Categories
  ========================= */

  private loadCategories(): void {
    this.http
      .get<CategoryApiResponse[]>(
        this.categoriesApiUrl,
      )
      .subscribe({
        next: (categories) => {
          this.categories.set(
            categories,
          );
        },

        error: (error) => {
          console.error(
            'Failed to load categories',
            error,
          );
        },
      });
  }

  private getCategoryId(
    categoryName: string,
  ): number | null {
    const normalizedName =
      categoryName
        .trim()
        .toLowerCase();

    const category =
      this.categories().find(
        (item) =>
          item.name
            .trim()
            .toLowerCase() ===
          normalizedName,
      );

    return category?.id ?? null;
  }

  /* =========================
     Accounts
  ========================= */

  private loadAccounts(): void {
    this.http
      .get<AccountApiResponse[]>(
        this.accountsApiUrl,
      )
      .subscribe({
        next: (accounts) => {
          this.accounts.set(
            accounts,
          );
        },

        error: (error) => {
          console.error(
            'Failed to load accounts',
            error,
          );
        },
      });
  }

  private getAccountId(
    accountName: string,
  ): number | null {
    const normalizedName =
      accountName
        .trim()
        .toLowerCase();

    const account =
      this.accounts().find(
        (item) =>
          item.name
            .trim()
            .toLowerCase() ===
          normalizedName,
      );

    return account?.id ?? null;
  }

  /* =========================
     GET
  ========================= */

  private loadTransactions(): void {
    this.http
      .get<TransactionApiResponse[]>(
        this.apiUrl,
      )
      .subscribe({
        next: (transactions) => {
          this.transactions.set(
            transactions.map(
              (transaction) =>
                this.mapTransaction(
                  transaction,
                ),
            ),
          );
        },

        error: (error) => {
          console.error(
            'Failed to load transactions',
            error,
          );
        },
      });
  }

  /* =========================
     POST
  ========================= */

  addTransaction(
    transaction: Omit<
      Transaction,
      'id'
    >,
  ): void {
    const categoryId =
      this.getCategoryId(
        transaction.category,
      );

    const accountId =
      this.getAccountId(
        transaction.account,
      );

    if (categoryId === null) {
      console.error(
        'Category not found:',
        transaction.category,
      );

      return;
    }

    if (accountId === null) {
      console.error(
        'Account not found:',
        transaction.account,
      );

      return;
    }

    const payload: TransactionRequest = {
      title:
        transaction.title,

      categoryId,

      accountId,

      amount:
        transaction.amount,

      type:
        transaction.type,

      date:
        transaction.date,

      description:
        transaction.description ?? '',
    };

    this.http
      .post<TransactionApiResponse>(
        this.apiUrl,
        payload,
      )
      .subscribe({
        next: (createdTransaction) => {
          this.transactions.update(
            (transactions) => [
              ...transactions,
              this.mapTransaction(
                createdTransaction,
              ),
            ],
          );
        },

        error: (error) => {
          console.error(
            'Failed to add transaction',
            error,
          );
        },
      });
  }

  /* =========================
     PUT
  ========================= */

  updateTransaction(
    updatedTransaction: Transaction,
  ): void {
    const categoryId =
      this.getCategoryId(
        updatedTransaction.category,
      );

    const accountId =
      this.getAccountId(
        updatedTransaction.account,
      );

    if (categoryId === null) {
      console.error(
        'Category not found:',
        updatedTransaction.category,
      );

      return;
    }

    if (accountId === null) {
      console.error(
        'Account not found:',
        updatedTransaction.account,
      );

      return;
    }

    const payload: TransactionRequest = {
      title:
        updatedTransaction.title,

      categoryId,

      accountId,

      amount:
        updatedTransaction.amount,

      type:
        updatedTransaction.type,

      date:
        updatedTransaction.date,

      description:
        updatedTransaction.description ?? '',
    };

    this.http
      .put<TransactionApiResponse>(
        `${this.apiUrl}/${updatedTransaction.id}`,
        payload,
      )
      .subscribe({
        next: (savedTransaction) => {
          const mappedTransaction =
            this.mapTransaction(
              savedTransaction,
            );

          this.transactions.update(
            (transactions) =>
              transactions.map(
                (transaction) =>
                  transaction.id ===
                  mappedTransaction.id
                    ? mappedTransaction
                    : transaction,
              ),
          );
        },

        error: (error) => {
          console.error(
            'Failed to update transaction',
            error,
          );
        },
      });
  }

  /* =========================
     DELETE
  ========================= */

  deleteTransaction(
    id: number,
  ): void {
    this.http
      .delete<void>(
        `${this.apiUrl}/${id}`,
      )
      .subscribe({
        next: () => {
          this.transactions.update(
            (transactions) =>
              transactions.filter(
                (transaction) =>
                  transaction.id !== id,
              ),
          );
        },

        error: (error) => {
          console.error(
            'Failed to delete transaction',
            error,
          );
        },
      });
  }

  /* =========================
     Mapper
  ========================= */

  private mapTransaction(
    transaction: TransactionApiResponse,
  ): Transaction {
    return {
      id:
        transaction.id,

      title:
        transaction.title,

      category:
        transaction.category?.name ??
        'Unknown',

      account:
        transaction.account?.name ??
        'Unknown',

      amount:
        transaction.amount,

      type:
        transaction.type,

      date:
        transaction.date,

      description:
        transaction.description ?? '',
    };
  }
}
