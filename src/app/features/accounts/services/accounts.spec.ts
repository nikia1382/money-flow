import { TestBed } from '@angular/core/testing';

import { TEST_PROVIDERS } from '@testing/test-providers';

import { AccountsService } from './accounts';

describe('AccountsService', () => {
  let service: AccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...TEST_PROVIDERS,
      ],
    });

    service = TestBed.inject(
      AccountsService,
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});