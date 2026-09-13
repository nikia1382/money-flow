import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  LucideAngularModule,
  MoreHorizontal,
} from 'lucide-angular';

import { TranslatePipe } from '@ngx-translate/core';

import { Debt } from '../../model/debt.model';

import { LocaleNumberPipe } from '../../../../shared/pipes/locale-number-pipe';
import { LocaleDatePipe } from '../../../../shared/pipes/locale-date-pipe';

@Component({
  selector: 'app-debt-card',
  standalone: true,

  imports: [
    LucideAngularModule,
    TranslatePipe,
    LocaleNumberPipe,
    LocaleDatePipe,
  ],

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

  @Output()
  recordPayment = new EventEmitter<Debt>();

  readonly CalendarDays = CalendarDays;
  readonly MoreHorizontal = MoreHorizontal;
  readonly ArrowUpRight = ArrowUpRight;
  readonly ArrowDownLeft = ArrowDownLeft;

  menuOpen = false;

  @HostListener('document:click')
  closeMenu(): void {
    this.menuOpen = false;
  }

  get remainingAmount(): number {
    return Math.max(
      0,
      this.debt.totalAmount - this.debt.paidAmount,
    );
  }

  get progress(): number {
    if (this.debt.totalAmount <= 0) {
      return 0;
    }

    return Math.min(
      100,
      Math.round(
        (this.debt.paidAmount /
          this.debt.totalAmount) *
          100,
      ),
    );
  }

  get isIOwe(): boolean {
    return this.debt.type === 'i-owe';
  }

get displayStatus(): 'active' | 'paid' | 'overdue' {
  if (this.debt.paidAmount >= this.debt.totalAmount) {
    return 'paid';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rawDate = this.debt.dueDate;

  const dueDate = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(rawDate)
      ? `${rawDate}T00:00:00`
      : rawDate,
  );

  if (!Number.isNaN(dueDate.getTime()) && dueDate < today) {
    return 'overdue';
  }

  return 'active';
}

  toggleMenu(event: Event): void {
    event.stopPropagation();

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
}