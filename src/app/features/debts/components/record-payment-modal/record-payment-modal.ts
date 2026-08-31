import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { LucideAngularModule, X, WalletCards } from 'lucide-angular';

import { TranslatePipe } from '@ngx-translate/core';

import { Debt, DebtType } from '../../model/debt.model';
import { LocaleNumberPipe } from '../../../../shared/pipes/locale-number-pipe';

@Component({
  selector: 'app-record-payment-modal',

  standalone: true,

  imports: [FormsModule, LucideAngularModule, TranslatePipe, LocaleNumberPipe],

  templateUrl: './record-payment-modal.html',
  styleUrl: './record-payment-modal.scss',
})
export class RecordPaymentModal {
  @Input({ required: true })
  debt!: Debt;

  @Output()
  closeModal = new EventEmitter<void>();

  @Output()
  recordPayment = new EventEmitter<number>();

  readonly X = X;
  readonly WalletCards = WalletCards;

  amount: number | null = null;

  get remainingAmount(): number {
    return Math.max(0, this.debt.totalAmount - this.debt.paidAmount);
  }

  get isValid(): boolean {
    return this.amount !== null && this.amount > 0 && this.amount <= this.remainingAmount;
  }

  close(): void {
    this.closeModal.emit();
  }

  save(): void {
    if (!this.isValid || this.amount === null) {
      return;
    }

    this.recordPayment.emit(this.amount);
  }

  payRemaining(): void {
    this.amount = this.remainingAmount;
  }
}
