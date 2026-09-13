import { TEST_PROVIDERS } from '@testing/test-providers';
import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language';

describe('LanguageService', () => {
  let service: LanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...TEST_PROVIDERS],});

    service = TestBed.inject(
      LanguageService,
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
