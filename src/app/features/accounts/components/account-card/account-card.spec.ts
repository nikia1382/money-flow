import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCard } from './account-card';

import { Account } from '../../models/account.model';

describe('AccountCard', () => {
  let component: AccountCard;
  let fixture: ComponentFixture<AccountCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountCard],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountCard);

    component = fixture.componentInstance;

    const mockAccount: Account = {
      id: 1,
      name: 'Test Account',
      type: 'bank',
      balance: 10_000_000,
      number: '**** 1234',
    };

    fixture.componentRef.setInput('account', mockAccount);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
