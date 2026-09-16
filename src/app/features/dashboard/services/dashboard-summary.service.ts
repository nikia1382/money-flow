import {
  inject,
  Injectable,
  signal,
} from '@angular/core';

import {
  HttpClient,
} from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export interface DashboardSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlySavings: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardSummaryService {
  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/dashboard/summary`;

  readonly summary =
    signal<DashboardSummary>({
      totalBalance: 0,
      monthlyIncome: 0,
      monthlyExpense: 0,
      monthlySavings: 0,
    });

  constructor() {
    this.loadSummary();
  }

  private loadSummary(): void {
    this.http
      .get<DashboardSummary>(
        this.apiUrl,
      )
      .subscribe({
        next: (summary) => {
          this.summary.set(
            summary,
          );
        },

        error: (error) => {
          console.error(
            'Failed to load dashboard summary',
            error,
          );
        },
      });
  }
}
