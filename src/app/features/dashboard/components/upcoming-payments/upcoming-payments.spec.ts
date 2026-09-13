import { TEST_PROVIDERS } from '@testing/test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  provideTranslateService,
  provideTranslateLoader,
  TranslateLoader,
} from '@ngx-translate/core';

import { Observable, of } from 'rxjs';

import { UpcomingPayments } from './upcoming-payments';

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of({
      dashboard: {
        upcomingPayments: {
          title: 'Upcoming Payments',
          subtitle: 'Payments due soon',
          viewAll: 'View all',

          rent: 'Monthly Rent',
          internet: 'Internet Bill',
          mobile: 'Mobile Bill',
          creditCard: 'Credit Card',

          tomorrow: 'Due tomorrow',
          inThreeDays: 'Due in 3 days',
          inFiveDays: 'Due in 5 days',
          nextWeek: 'Due next week',
        },

        chart: {
          currency: 'Toman',
        },
      },
    });
  }
}

describe('UpcomingPayments', () => {
  let component: UpcomingPayments;
  let fixture: ComponentFixture<UpcomingPayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpcomingPayments],

      providers: [
         ...TEST_PROVIDERS,
        provideTranslateService({
          loader: provideTranslateLoader(FakeLoader),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpcomingPayments);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

