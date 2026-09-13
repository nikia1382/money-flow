import { TEST_PROVIDERS } from '@testing/test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  provideTranslateService,
  provideTranslateLoader,
  TranslateLoader,
} from '@ngx-translate/core';

import { Observable, of } from 'rxjs';

import { BudgetProgress } from './budget-progress';

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of({
      dashboard: {
        budget: {
          title: 'Budget Progress',
          viewAll: 'View all',

          food: 'Food',
          housing: 'Housing',
          transportation: 'Transportation',
          shopping: 'Shopping',
          entertainment: 'Entertainment',
        },

        chart: {
          currency: 'Toman',
        },
      },
    });
  }
}

describe('BudgetProgress', () => {
  let component: BudgetProgress;
  let fixture: ComponentFixture<BudgetProgress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetProgress],

      providers: [
         ...TEST_PROVIDERS,
        provideTranslateService({
          loader: provideTranslateLoader(FakeLoader),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetProgress);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

