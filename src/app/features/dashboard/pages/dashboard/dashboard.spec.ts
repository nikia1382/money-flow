import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  provideTranslateService,
  provideTranslateLoader,
  TranslateLoader,
} from '@ngx-translate/core';

import { Observable, of } from 'rxjs';

import { Dashboard } from './dashboard';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
);

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of({
      dashboard: {
        welcome: 'Welcome back',
        subtitle: 'Here is your financial overview',

        summary: {
          totalBalance: 'Total Balance',
          income: 'Income',
          expenses: 'Expenses',
          savings: 'Savings',
        },

        chart: {
          title: 'Cash Flow',
          subtitle: 'Income and expenses overview',
          income: 'Income',
          expenses: 'Expenses',
          currency: 'Toman',
        },

        spending: {
          title: 'Spending Breakdown',
        },

        budget: {
          title: 'Budget Progress',
        },

        transactions: {
          title: 'Recent Transactions',
          subtitle: 'Latest activity',
          viewAll: 'View all',
        },

        upcomingPayments: {
          title: 'Upcoming Payments',
        },

        goals: {
          title: 'Financial Goals',
        },
      },
    });
  }
}

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],

      providers: [
        provideTranslateService({
          loader: provideTranslateLoader(FakeLoader),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
