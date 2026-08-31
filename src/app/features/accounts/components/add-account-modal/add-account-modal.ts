import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { LucideAngularModule, X } from 'lucide-angular';

import { AccountType } from '../../models/account.model';
import { TranslatePipe } from '@ngx-translate/core';

export interface NewAccount {
  name: string;
  type: AccountType;
  balance: number | null;
  number: string;
}

@Component({
  selector: 'app-add-account-modal',

  imports: [FormsModule, LucideAngularModule, TranslatePipe],

  templateUrl: './add-account-modal.html',
  styleUrl: './add-account-modal.scss',
})
export class AddAccountModal implements OnChanges {
  @Input()
  accountToEdit: {
    id: number;
    name: string;
    type: AccountType;
    balance: number;
    number?: string;
  } | null = null;

  @Output()
  closeModal = new EventEmitter<void>();

  @Output()
  saveAccount = new EventEmitter<NewAccount>();

  readonly X = X;

  form: NewAccount = {
    name: '',
    type: 'bank',
    balance: null,
    number: '',
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['accountToEdit'] && this.accountToEdit) {
      this.form = {
        name: this.accountToEdit.name,
        type: this.accountToEdit.type,
        balance: this.accountToEdit.balance,
        number: this.accountToEdit.number ?? '',
      };
    }
  }

  close(): void {
    this.closeModal.emit();
  }

  save(): void {
    if (!this.isFormValid) {
      return;
    }

    this.saveAccount.emit({
      ...this.form,
    });
  }
  get isFormValid(): boolean {
    return (
      this.form.name.trim().length > 0 &&
      this.form.type.length > 0 &&
      this.form.balance !== null &&
      this.form.balance >= 0
    );
  }
}
