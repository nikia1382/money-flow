import { TEST_PROVIDERS } from '@testing/test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionRow } from './transaction-row';

import { Transaction } from '../../models/transaction.model';

describe('TransactionRow', () => {
  let component: TransactionRow;
  let fixture: ComponentFixture<TransactionRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [...TEST_PROVIDERS],
      imports: [TransactionRow],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionRow);

    const mockTransaction: Transaction = {
      id: 1,
      title: 'Test Transaction',
      category: 'Food',
      account: 'accounts.items.mainBankAccount',
      date: '2026-08-23',
      amount: 1_000_000,
      type: 'expense',
    };

    fixture.componentRef.setInput('transaction', mockTransaction);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

