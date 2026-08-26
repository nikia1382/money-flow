import { TestBed } from '@angular/core/testing';

import { RecurringPayments } from './recurring-payments';

describe('RecurringPayments', () => {
  let service: RecurringPayments;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecurringPayments);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
