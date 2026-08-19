import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  provideTranslateService,
  provideTranslateLoader,
  TranslateLoader,
} from '@ngx-translate/core';

import { Observable, of } from 'rxjs';

import { SpendingBreakdown } from './spending-breakdown';

import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);
class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of({
      dashboard: {
        spending: {
          title: 'Spending Breakdown',
          subtitle: 'Where your money went this month',
          total: 'Total spent',
          food: 'Food',
          housing: 'Housing',
          transport: 'Transport',
          shopping: 'Shopping',
          other: 'Other',
        },

        chart: {
          currency: 'Toman',
        },
      },
    });
  }
}

describe('SpendingBreakdown', () => {
  let component: SpendingBreakdown;
  let fixture: ComponentFixture<SpendingBreakdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendingBreakdown],

      providers: [
        provideTranslateService({
          loader: provideTranslateLoader(FakeLoader),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SpendingBreakdown);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
