import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {
  provideTranslateService,
  provideTranslateLoader,
  TranslateLoader,
  TranslationObject,
} from '@ngx-translate/core';

import {
  Observable,
  of,
} from 'rxjs';

import {
  BudgetCard,
} from './budget-card';


class FakeLoader implements TranslateLoader {
  getTranslation(
    lang: string,
  ): Observable<TranslationObject> {
    return of({});
  }
}


describe('BudgetCard', () => {
  let component: BudgetCard;
  let fixture:
    ComponentFixture<BudgetCard>;

  beforeEach(async () => {
    await TestBed
      .configureTestingModule({
        imports: [
          BudgetCard,
        ],

        providers: [
          provideTranslateService({
            loader:
              provideTranslateLoader(
                FakeLoader,
              ),
          }),
        ],
      })
      .compileComponents();

    fixture =
      TestBed.createComponent(
        BudgetCard,
      );

    component =
      fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(
      component,
    ).toBeTruthy();
  });
});