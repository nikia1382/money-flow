import {
  TestBed,
} from '@angular/core/testing';

import {
  ToastService,
} from './toast';

import {
  TEST_PROVIDERS,
} from '@testing/test-providers';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...TEST_PROVIDERS,
      ],
    });

    service =
      TestBed.inject(
        ToastService,
      );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});