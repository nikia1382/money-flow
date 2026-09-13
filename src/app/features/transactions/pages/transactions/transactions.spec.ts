import { TestBed } from '@angular/core/testing';

import { TEST_PROVIDERS } from '@testing/test-providers';
import { TransactionsService } from '../../services/transactions';


describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...TEST_PROVIDERS,
      ],
    });

    service = TestBed.inject(
      TransactionsService,
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});