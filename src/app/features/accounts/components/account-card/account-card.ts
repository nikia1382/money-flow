import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

import {
  LucideAngularModule,
  Landmark,
  Wallet,
  PiggyBank,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-angular';

import { Account } from '../../models/account.model';

@Component({
  selector: 'app-account-card',

  imports: [LucideAngularModule],

  templateUrl: './account-card.html',
  styleUrl: './account-card.scss',
})
export class AccountCard {
  @Input({
    required: true,
  })
  account!: Account;

  @Output()
  deleteAccount = new EventEmitter<number>();

  @Output()
  editAccount = new EventEmitter<Account>();

  readonly isMenuOpen = signal(false);

  readonly Landmark = Landmark;
  readonly Wallet = Wallet;
  readonly PiggyBank = PiggyBank;
  readonly MoreHorizontal = MoreHorizontal;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;

  toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
  }

  edit(): void {
    this.editAccount.emit(this.account);

    this.isMenuOpen.set(false);
  }

  delete(): void {
    this.deleteAccount.emit(this.account.id);

    this.isMenuOpen.set(false);
  }
}
