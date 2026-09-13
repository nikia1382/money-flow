import {
  TestBed,
} from '@angular/core/testing';

import {
  RecurringPaymentsService,
} from './recurring-payments';

import {
  TEST_PROVIDERS,
} from '../../../testing/test-providers';

describe('RecurringPaymentsService', () => {
  let service: RecurringPaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...TEST_PROVIDERS,
      ],
    });

    service =
      TestBed.inject(
        RecurringPaymentsService,
      );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});