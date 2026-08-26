import {
  TestBed
} from '@angular/core/testing';

import {
  TransactionsService
} from './transactions';


describe('TransactionsService', () => {

  let service: TransactionsService;


  beforeEach(() => {

    localStorage.clear();

    TestBed.configureTestingModule({});

    service =
      TestBed.inject(
        TransactionsService
      );

  });


  afterEach(() => {
    localStorage.clear();
  });


  it('should be created', () => {

    expect(service)
      .toBeTruthy();

  });


  it('should load default transactions', () => {

    expect(
      service.transactions().length
    ).toBe(3);

  });


  it('should add a transaction', () => {

    service.addTransaction({
      title: 'Coffee',
      category: 'Food',
      account: 'Cash Wallet',
      date: '2026-08-23',
      amount: 250_000,
      type: 'expense'
    });


    expect(
      service.transactions().length
    ).toBe(4);

  });


  it('should delete a transaction', () => {

    const transaction =
      service.transactions()[0];


    service.deleteTransaction(
      transaction.id
    );


    expect(
      service.transactions()
        .some(
          item =>
            item.id === transaction.id
        )
    ).toBeFalse();

  });

});