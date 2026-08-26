import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  LucideAngularModule,
  X
} from 'lucide-angular';

import {
  AccountType
} from '../../models/account.model';


export interface NewAccount {
  name: string;
  type: AccountType;
  balance: number | null;
  number: string;
}


@Component({
  selector: 'app-add-account-modal',

  imports: [
    FormsModule,
    LucideAngularModule
  ],

  templateUrl: './add-account-modal.html',
  styleUrl: './add-account-modal.scss'
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
  closeModal =
    new EventEmitter<void>();


  @Output()
  saveAccount =
    new EventEmitter<NewAccount>();


  readonly X = X;


  form: NewAccount = {
    name: '',
    type: 'bank',
    balance: null,
    number: ''
  };


  ngOnChanges(
    changes: SimpleChanges
  ): void {

    if (
      changes['accountToEdit'] &&
      this.accountToEdit
    ) {

      this.form = {
        name: this.accountToEdit.name,
        type: this.accountToEdit.type,
        balance: this.accountToEdit.balance,
        number: this.accountToEdit.number ?? ''
      };

    }

  }


  close(): void {
    this.closeModal.emit();
  }


  save(): void {

    console.log(
      'SAVE CLICKED:',
      this.form
    );


    if (!this.form.name.trim()) {
      console.log('ACCOUNT NAME IS EMPTY');
      return;
    }


    if (
      this.form.balance === null ||
      this.form.balance === undefined
    ) {
      console.log('BALANCE IS EMPTY');
      return;
    }


    this.saveAccount.emit({
      ...this.form
    });


    console.log(
      'ACCOUNT EMITTED:',
      this.form
    );


    this.close();

  }

}