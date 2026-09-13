import {
  Component,
  computed,
  inject,
} from '@angular/core';

import {
  TranslatePipe,
} from '@ngx-translate/core';

import {
  LucideAngularModule,
  House,
  Wifi,
  Smartphone,
  CreditCard,
  ChevronRight,
  Wallet,
} from 'lucide-angular';

import {
  LocaleNumberPipe,
} from '../../../../shared/pipes/locale-number-pipe';

import {
  LocaleDatePipe,
} from '../../../../shared/pipes/locale-date-pipe';

import {
  UpcomingPaymentsService,
} from '../../services/upcoming-payments.service';
import { StateView } from '../../../../shared/components/state-view/state-view';

interface UpcomingPaymentView {
  id: number;
  title: string;
  amount: number;
  dueDate: string;
  icon: any;
  iconClass: string;
}

@Component({
  selector: 'app-upcoming-payments',

  imports: [
    TranslatePipe,
    LucideAngularModule,
    LocaleNumberPipe,
    LocaleDatePipe,
    StateView
  ],

  templateUrl: './upcoming-payments.html',
  styleUrl: './upcoming-payments.scss',
})
export class UpcomingPayments {
  private readonly upcomingPaymentsService =
    inject(UpcomingPaymentsService);

  readonly ChevronRight =
    ChevronRight;
readonly EmptyPaymentIcon = CreditCard;
  readonly payments =
    computed<UpcomingPaymentView[]>(() =>
      [
        ...this.upcomingPaymentsService
          .payments(),
      ]
        .sort(
          (a, b) =>
            new Date(
              `${a.dueDate}T00:00:00`,
            ).getTime() -
            new Date(
              `${b.dueDate}T00:00:00`,
            ).getTime(),
        )
        .slice(0, 4)
        .map((payment) => ({
          id: payment.id,
          title: payment.title,
          amount: payment.amount,
          dueDate: payment.dueDate,
          icon:
            this.getIcon(
              payment.category,
            ),
          iconClass:
            payment.category
              .toLowerCase(),
        })),
    );

  private getIcon(
    category: string,
  ) {
    switch (
      category.toLowerCase()
    ) {
      case 'rent':
      case 'housing':
        return House;

      case 'internet':
        return Wifi;

      case 'mobile':
      case 'phone':
        return Smartphone;

      case 'credit':
      case 'creditcard':
        return CreditCard;

      default:
        return Wallet;
    }
  }
}