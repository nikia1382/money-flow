import { TestBed } from '@angular/core/testing';

import { TEST_PROVIDERS } from '@testing/test-providers';

import {
  DebtsService,
} from './debts';

describe('DebtsService', () => {
  let service: DebtsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...TEST_PROVIDERS,
      ],
    });

    service =
      TestBed.inject(
        DebtsService,
      );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});