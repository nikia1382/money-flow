import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import {
  provideTranslateLoader,
  provideTranslateService,
  TranslateLoader,
  TranslationObject,
} from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    return of({});
  }
}

export const TEST_PROVIDERS = [
  provideRouter([]),

  provideTranslateService({
    loader: provideTranslateLoader(FakeLoader),
  }),

  provideHttpClient(),
  provideHttpClientTesting(),
];