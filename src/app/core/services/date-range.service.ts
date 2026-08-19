import { Injectable, signal } from '@angular/core';

export type DashboardDateRange = 'thisMonth' | 'lastMonth' | 'last3Months' | 'thisYear';

@Injectable({
  providedIn: 'root',
})
export class DateRangeService {
  readonly selectedRange = signal<DashboardDateRange>('thisMonth');

  setRange(range: DashboardDateRange): void {
    this.selectedRange.set(range);
  }
}
