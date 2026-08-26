import {
  TestBed
} from '@angular/core/testing';

import {
  AccountsService
} from './accounts';

import {
  Account
} from '../models/account.model';


describe('AccountsService', () => {

  let service: AccountsService;


  beforeEach(() => {

    localStorage.clear();

    TestBed.configureTestingModule({});

    service =
      TestBed.inject(
        AccountsService
      );

  });


  afterEach(() => {
    localStorage.clear();
  });


  it('should be created', () => {

    expect(service)
      .toBeTruthy();

  });


  it('should load default accounts', () => {

    expect(
      service.accounts().length
    ).toBe(3);

  });


  it('should add a new account', () => {

    service.addAccount({
      name: 'Test Account',
      type: 'bank',
      balance: 10_000_000,
      number: '**** 1234'
    });


    expect(
      service.accounts().length
    ).toBe(4);


    const addedAccount =
      service.accounts()
        .find(
          account =>
            account.name ===
            'Test Account'
        );


    expect(
      addedAccount
    ).toBeTruthy();


    expect(
      addedAccount?.balance
    ).toBe(
      10_000_000
    );

  });


  it('should update an account', () => {

    const account =
      service.accounts()[0];


    const updatedAccount: Account = {

      ...account,

      name:
        'Updated Account',

      balance:
        99_000_000

    };


    service.updateAccount(
      updatedAccount
    );


    const result =
      service.accounts()
        .find(
          item =>
            item.id ===
            account.id
        );


    expect(
      result?.name
    ).toBe(
      'Updated Account'
    );


    expect(
      result?.balance
    ).toBe(
      99_000_000
    );

  });


  it('should delete an account', () => {

    const account =
      service.accounts()[0];


    service.deleteAccount(
      account.id
    );


    const result =
      service.accounts()
        .find(
          item =>
            item.id ===
            account.id
        );


    expect(
      result
    ).toBeUndefined();


    expect(
      service.accounts().length
    ).toBe(2);

  });


  it('should save accounts to localStorage', () => {

    service.addAccount({
      name: 'Saved Account',
      type: 'cash',
      balance: 5_000_000,
      number: ''
    });


    const saved =
      localStorage.getItem(
        'moneyflow_accounts'
      );


    expect(
      saved
    ).not.toBeNull();


    const parsed =
      JSON.parse(
        saved!
      );


    expect(
      parsed.length
    ).toBe(4);


    expect(
      parsed.some(
        (account: Account) =>
          account.name ===
          'Saved Account'
      )
    ).toBeTrue();

  });

});