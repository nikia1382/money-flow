import { TEST_PROVIDERS } from '@testing/test-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  provideTranslateService,
  provideTranslateLoader,
  TranslateLoader,
} from '@ngx-translate/core';

import { Observable, of } from 'rxjs';

import { RecentTransactions } from './recent-transactions';

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of({
      dashboard: {
        transactions: {
          title: 'Recent Transactions',
          subtitle: 'Latest activity',
          viewAll: 'View all',
        },

        chart: {
          currency: 'Toman',
        },
      },
    });
  }
}

describe('RecentTransactions', () => {
  let component: RecentTransactions;
  let fixture: ComponentFixture<RecentTransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    
      imports: [RecentTransactions],

      providers: [
         ...TEST_PROVIDERS,
        provideTranslateService({
          loader: provideTranslateLoader(FakeLoader),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentTransactions);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

