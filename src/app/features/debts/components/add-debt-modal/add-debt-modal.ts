import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { LucideAngularModule, X } from 'lucide-angular';

import { TranslatePipe } from '@ngx-translate/core';
import { Debt, DebtType } from '../../model/debt.model';

export interface NewDebt {
  personName: string;
  type: DebtType;
  totalAmount: number | null;
  paidAmount: number;
  dueDate: string;
  note: string;
}

@Component({
  selector: 'app-add-debt-modal',

  standalone: true,

  imports: [FormsModule, LucideAngularModule, TranslatePipe],

  templateUrl: './add-debt-modal.html',
  styleUrl: './add-debt-modal.scss',
})
export class AddDebtModal implements OnChanges {
  @Output()
  closeModal = new EventEmitter<void>();

  @Output()
  saveDebt = new EventEmitter<NewDebt>();

  @Input()
  debtToEdit: Debt | null = null;
  readonly X = X;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['debtToEdit'] && this.debtToEdit) {
      this.form = {
        personName: this.debtToEdit.personName,

        type: this.debtToEdit.type,

        totalAmount: this.debtToEdit.totalAmount,

        paidAmount: this.debtToEdit.paidAmount,

        dueDate: this.debtToEdit.dueDate,

        note: this.debtToEdit.note ?? '',
      };
    }
  }
  get isEditMode(): boolean {
    return this.debtToEdit !== null;
  }

  form: NewDebt = {
    personName: '',
    type: 'i-owe',
    totalAmount: null,
    paidAmount: 0,
    dueDate: '',
    note: '',
  };

  get isFormValid(): boolean {
    return (
      this.form.personName.trim().length > 0 &&
      this.form.totalAmount !== null &&
      this.form.totalAmount > 0 &&
      this.form.paidAmount >= 0 &&
      this.form.paidAmount <= this.form.totalAmount &&
      this.form.dueDate.length > 0
    );
  }

  close(): void {
    this.closeModal.emit();
  }

  save(): void {
    if (!this.isFormValid) {
      return;
    }

    this.saveDebt.emit({
      ...this.form,
    });
  }
}
