import {
  provideTranslateService,
  provideTranslateLoader,
  TranslateLoader,
} from '@ngx-translate/core';

import { Observable, of } from 'rxjs';

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of({});
  }
}
