import { TestBed } from '@angular/core/testing';
import { LocaleNumberPipe } from './locale-number-pipe';
import { TEST_PROVIDERS } from '@testing/test-providers';

describe('LocaleNumberPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...TEST_PROVIDERS],
    });
  });

  it('create an instance', () => {
    const pipe = TestBed.runInInjectionContext(
      () => new LocaleNumberPipe(),
    );

    expect(pipe).toBeTruthy();
  });
});