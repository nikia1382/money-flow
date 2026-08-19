import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import {
  LucideAngularModule,
  House,
  Wifi,
  Smartphone,
  CreditCard,
  ChevronRight,
} from 'lucide-angular';

interface UpcomingPayment {
  id: number;
  titleKey: string;
  dateKey: string;
  amount: number;
  icon: any;
  iconClass: string;
}

@Component({
  selector: 'app-upcoming-payments',

  imports: [TranslatePipe, LucideAngularModule],

  templateUrl: './upcoming-payments.html',
  styleUrl: './upcoming-payments.scss',
})
export class UpcomingPayments {
  readonly ChevronRight = ChevronRight;

  readonly payments: UpcomingPayment[] = [
    {
      id: 1,
      titleKey: 'dashboard.upcomingPayments.rent',
      dateKey: 'dashboard.upcomingPayments.tomorrow',
      amount: 8_500_000,
      icon: House,
      iconClass: 'rent',
    },
    {
      id: 2,
      titleKey: 'dashboard.upcomingPayments.internet',
      dateKey: 'dashboard.upcomingPayments.inThreeDays',
      amount: 450_000,
      icon: Wifi,
      iconClass: 'internet',
    },
    {
      id: 3,
      titleKey: 'dashboard.upcomingPayments.mobile',
      dateKey: 'dashboard.upcomingPayments.inFiveDays',
      amount: 280_000,
      icon: Smartphone,
      iconClass: 'mobile',
    },
    {
      id: 4,
      titleKey: 'dashboard.upcomingPayments.creditCard',
      dateKey: 'dashboard.upcomingPayments.nextWeek',
      amount: 2_300_000,
      icon: CreditCard,
      iconClass: 'credit',
    },
  ];
}
