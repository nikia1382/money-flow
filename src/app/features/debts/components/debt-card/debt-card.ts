import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  LucideAngularModule,
  CalendarDays,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-angular';

import { TranslatePipe } from '@ngx-translate/core';
import { Debt } from '../../model/debt.model';
import { LocaleNumberPipe } from '../../../../shared/pipes/locale-number-pipe';

@Component({
  selector: 'app-debt-card',

  standalone: true,

  imports: [LucideAngularModule, TranslatePipe, LocaleNumberPipe],

  templateUrl: './debt-card.html',
  styleUrl: './debt-card.scss',
})
export class DebtCard {
  @Input({ required: true })
  debt!: Debt;

  @Output()
  editDebt = new EventEmitter<Debt>();

  @Output()
  deleteDebt = new EventEmitter<Debt>();

  readonly CalendarDays = CalendarDays;

  readonly MoreHorizontal = MoreHorizontal;

  readonly ArrowUpRight = ArrowUpRight;

  readonly ArrowDownLeft = ArrowDownLeft;
  menuOpen = false;
  @Output()
  recordPayment = new EventEmitter<Debt>();

  get remainingAmount(): number {
    return Math.max(0, this.debt.totalAmount - this.debt.paidAmount);
  }

  get progress(): number {
    if (!this.debt.totalAmount) {
      return 0;
    }

    return Math.min(100, Math.round((this.debt.paidAmount / this.debt.totalAmount) * 100));
  }

  get isIOwe(): boolean {
    return this.debt.type === 'i-owe';
  }
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  onEdit(): void {
    this.menuOpen = false;
    this.editDebt.emit(this.debt);
  }

  onDelete(): void {
    this.menuOpen = false;
    this.deleteDebt.emit(this.debt);
  }
  onRecordPayment(): void {
    this.menuOpen = false;

    this.recordPayment.emit(this.debt);
  }
  get displayStatus(): 'active' | 'paid' | 'overdue' {
    if (this.debt.paidAmount >= this.debt.totalAmount) {
      return 'paid';
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(`${this.debt.dueDate}T00:00:00`);

    if (dueDate < today) {
      return 'overdue';
    }

    return 'active';
  }
}
