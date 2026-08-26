import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  AccountCard
} from '../../components/account-card/account-card';

import {
  AddAccountModal,
  NewAccount
} from '../../components/add-account-modal/add-account-modal';

import {
  ConfirmDialog
} from '../../../../shared/components/confirm-dialog/confirm-dialog';

import {
  AccountsService
} from '../../services/accounts';
import {
  Account
} from '../../models/account.model';

/* export interface Account {
  id: number;
  name: string;
  type: 'bank' | 'cash' | 'savings';
  balance: number;
  number?: string;
} */



@Component({
  selector: 'app-accounts',

  imports: [
    AccountCard,
    AddAccountModal,
    ConfirmDialog
  ],

  templateUrl: './accounts.html',
  styleUrl: './accounts.scss'
})
export class Accounts {

  /* =========================
     Service
  ========================= */

  private readonly accountsService =
    inject(AccountsService);


  /* =========================
     Accounts Data
  ========================= */

  readonly accounts =
    this.accountsService.accounts;


  /* =========================
     UI State
  ========================= */

  readonly isAddAccountOpen =
    signal(false);

  readonly editingAccount =
    signal<Account | null>(null);

  readonly accountPendingDelete =
    signal<Account | null>(null);


  /* =========================
     Total Balance
  ========================= */

  get totalBalance(): number {

    return this.accounts()
      .reduce(
        (total, account) =>
          total + account.balance,
        0
      );

  }


  /* =========================
     Add Account
  ========================= */

  openAddAccount(): void {
    this.isAddAccountOpen.set(true);
  }


  closeAddAccount(): void {
    this.isAddAccountOpen.set(false);
  }


  addAccount(
    newAccount: NewAccount
  ): void {

    this.accountsService
      .addAccount(newAccount);

    this.closeAddAccount();

  }


  /* =========================
     Edit Account
  ========================= */

  openEditAccount(
    account: Account
  ): void {

    this.editingAccount.set(
      account
    );

  }


  closeEditAccount(): void {

    this.editingAccount.set(
      null
    );

  }


  updateAccount(
    updatedAccount: Account
  ): void {

    this.accountsService
      .updateAccount(
        updatedAccount
      );

    this.closeEditAccount();

  }


  /* =========================
     Delete Account
  ========================= */

  requestDeleteAccount(
    accountId: number
  ): void {

    const account =
      this.accounts().find(
        item =>
          item.id === accountId
      );

    if (!account) {
      return;
    }

    this.accountPendingDelete
      .set(account);

  }


  cancelDeleteAccount(): void {

    this.accountPendingDelete
      .set(null);

  }


  confirmDeleteAccount(): void {

    const account =
      this.accountPendingDelete();

    if (!account) {
      return;
    }


    this.accountsService
      .deleteAccount(
        account.id
      );


    this.accountPendingDelete
      .set(null);

  }

}