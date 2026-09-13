import { TEST_PROVIDERS } from '@testing/test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  provideTranslateService,
  provideTranslateLoader,
  TranslateLoader,
} from '@ngx-translate/core';

import { Observable, of } from 'rxjs';

import { FinancialGoals } from './financial-goals';

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of({
      dashboard: {
        goals: {
          title: 'Financial Goals',
          subtitle: 'Track your progress toward your goals',
          viewAll: 'View all',

          emergencyFund: 'Emergency Fund',
          travel: 'Travel',
          car: 'New Car',
        },

        chart: {
          currency: 'Toman',
        },
      },
    });
  }
}

describe('FinancialGoals', () => {
  let component: FinancialGoals;
  let fixture: ComponentFixture<FinancialGoals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
     
      imports: [FinancialGoals],

      providers: [
         ...TEST_PROVIDERS,
        provideTranslateService({
          loader: provideTranslateLoader(FakeLoader),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialGoals);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

