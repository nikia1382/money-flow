import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

import {
  LucideAngularModule,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-angular';

import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-row',

  imports: [LucideAngularModule],

  templateUrl: './transaction-row.html',
  styleUrl: './transaction-row.scss',
})
export class TransactionRow {
  /* =========================
     Input
  ========================= */

  @Input({
    required: true,
  })
  transaction!: Transaction;

  /* =========================
     Outputs
  ========================= */

  @Output()
  editTransaction = new EventEmitter<Transaction>();

  @Output()
  deleteTransaction = new EventEmitter<number>();

  /* =========================
     State
  ========================= */

  readonly isMenuOpen = signal(false);

  /* =========================
     Icons
  ========================= */

  readonly ArrowDownLeft = ArrowDownLeft;

  readonly ArrowUpRight = ArrowUpRight;

  readonly ArrowLeftRight = ArrowLeftRight;

  readonly MoreHorizontal = MoreHorizontal;

  readonly Pencil = Pencil;

  readonly Trash2 = Trash2;

  /* =========================
     Menu
  ========================= */

  toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
  }

  /* =========================
     Edit
  ========================= */

  edit(): void {
    this.editTransaction.emit(this.transaction);

    this.isMenuOpen.set(false);
  }

  /* =========================
     Delete
  ========================= */

  delete(): void {
    this.deleteTransaction.emit(this.transaction.id);

    this.isMenuOpen.set(false);
  }
}
