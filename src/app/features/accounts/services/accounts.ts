import {
  inject,
  Injectable,
  signal,
} from '@angular/core';

import {
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';

import {
  Account,
} from '../models/account.model';

import {
  NewAccount,
} from '../components/add-account-modal/add-account-modal';
import { ToastService } from '../../../shared/services/toast';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private readonly http =
    inject(HttpClient);


private readonly toastService =
  inject(ToastService);
private readonly translate =
  inject(TranslateService);
  private readonly apiUrl =
    'http://localhost:8080/api/accounts';

  readonly accounts =
    signal<Account[]>([]);

  constructor() {
    this.loadAccounts();
  }

  /* =========================
     GET
  ========================= */

  private loadAccounts(): void {
    this.http
      .get<Account[]>(
        this.apiUrl,
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

  /* =========================
     POST
  ========================= */

  addAccount(
    newAccount: NewAccount,
  ): void {
    if (
      newAccount.balance === null
    ) {
      return;
    }

    const payload = {
      name: newAccount.name,
      type: newAccount.type,
      balance:
        newAccount.balance,
      number:
        newAccount.number ||
        null,
    };

    this.http
      .post<Account>(
        this.apiUrl,
        payload,
      )
      .subscribe({
        next: (createdAccount) => {
          this.accounts.update(
            (accounts) => [
              ...accounts,
              createdAccount,
            ],
          );
        },

        error: (error) => {
          console.error(
            'Failed to add account',
            error,
          );
        },
      });
  }

  /* =========================
     PUT
  ========================= */

  updateAccount(
    updatedAccount: Account,
  ): void {
    this.http
      .put<Account>(
        `${this.apiUrl}/${updatedAccount.id}`,
        updatedAccount,
      )
      .subscribe({
        next: (savedAccount) => {
          this.accounts.update(
            (accounts) =>
              accounts.map(
                (account) =>
                  account.id ===
                  savedAccount.id
                    ? savedAccount
                    : account,
              ),
          );
        },

        error: (error) => {
          console.error(
            'Failed to update account',
            error,
          );
        },
      });
  }

  /* =========================
     DELETE
  ========================= */

deleteAccount(
  accountId: number,
): void {
  this.http
    .delete<void>(
      `${this.apiUrl}/${accountId}`,
    )
    .subscribe({
      next: () => {
        this.accounts.update(
          (accounts) =>
            accounts.filter(
              (account) =>
                account.id !==
                accountId,
            ),
        );

        this.toastService.show(
          this.translate.instant(
            'accounts.notifications.deleteSuccess',
          ),
          'success',
        );
      },

      error: (
        error: HttpErrorResponse,
      ) => {
        if (error.status === 409) {
          this.toastService.show(
            this.translate.instant(
              'accounts.notifications.deleteConflict',
            ),
            'error',
          );

          return;
        }

        if (error.status === 404) {
          this.toastService.show(
            this.translate.instant(
              'accounts.notifications.notFound',
            ),
            'error',
          );

          this.loadAccounts();

          return;
        }

        this.toastService.show(
          this.translate.instant(
            'accounts.notifications.deleteFailed',
          ),
          'error',
        );

        console.error(
          'Failed to delete account',
          error,
        );
      },
    });
}
}