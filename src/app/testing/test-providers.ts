import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

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
  provideHttpClient(),
  provideHttpClientTesting(),

  provideTranslateService({
    loader: provideTranslateLoader(FakeLoader),
  }),
];