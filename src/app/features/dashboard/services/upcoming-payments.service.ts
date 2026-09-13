import {
  inject,
  Injectable,
  signal,
} from '@angular/core';

import {
  HttpClient,
} from '@angular/common/http';

export interface UpcomingPayment {
  id: number;
  title: string;
  amount: number;
  dueDate: string;
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class UpcomingPaymentsService {
  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8080/api/upcoming-payments';

  readonly payments =
    signal<UpcomingPayment[]>([]);

  constructor() {
    this.loadPayments();
  }

  private loadPayments(): void {
    this.http
      .get<UpcomingPayment[]>(
        this.apiUrl,
      )
      .subscribe({
        next: (payments) => {
          this.payments.set(
            payments,
          );
        },

        error: (error) => {
          console.error(
            'Failed to load upcoming payments',
            error,
          );
        },
      });
  }
}