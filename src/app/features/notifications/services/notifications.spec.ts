import { TestBed } from '@angular/core/testing';

import { TEST_PROVIDERS } from '@testing/test-providers';

import {
  NotificationsService,
} from './notifications';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...TEST_PROVIDERS,
      ],
    });

    service =
      TestBed.inject(
        NotificationsService,
      );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});