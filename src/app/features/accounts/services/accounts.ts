import {
  Injectable,
  signal
} from '@angular/core';

import {
  Account
} from '../models/account.model';

import {
  NewAccount
} from '../components/add-account-modal/add-account-modal';


@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  private readonly storageKey =
    'moneyflow_accounts';


  readonly accounts =
    signal<Account[]>(
      this.loadAccounts()
    );


  private loadAccounts(): Account[] {

    const saved =
      localStorage.getItem(
        this.storageKey
      );

    if (saved) {
      return JSON.parse(saved);
    }

    return [
      {
        id: 1,
        name: 'Main Bank Account',
        type: 'bank',
        balance: 48_500_000,
        number: '**** 4821'
      },
      {
        id: 2,
        name: 'Cash Wallet',
        type: 'cash',
        balance: 8_000_000
      },
      {
        id: 3,
        name: 'Savings Account',
        type: 'savings',
        balance: 30_000_000,
        number: '**** 9145'
      }
    ];

  }


  private saveAccounts(): void {

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(
        this.accounts()
      )
    );

  }


  addAccount(
    newAccount: NewAccount
  ): void {

    if (
      newAccount.balance === null
    ) {
      return;
    }

    const account: Account = {

      id: Date.now(),

      name: newAccount.name,

      type: newAccount.type,

      balance: newAccount.balance,

      number:
        newAccount.number || undefined

    };


    this.accounts.update(
      accounts => [
        ...accounts,
        account
      ]
    );


    this.saveAccounts();

  }


  updateAccount(
    updatedAccount: Account
  ): void {

    this.accounts.update(
      accounts =>
        accounts.map(
          account =>
            account.id === updatedAccount.id
              ? updatedAccount
              : account
        )
    );


    this.saveAccounts();

  }


  deleteAccount(
    accountId: number
  ): void {

    this.accounts.update(
      accounts =>
        accounts.filter(
          account =>
            account.id !== accountId
        )
    );


    this.saveAccounts();

  }

}