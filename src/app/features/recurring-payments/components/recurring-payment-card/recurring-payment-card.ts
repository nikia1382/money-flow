import { Component, Input } from '@angular/core';

import { LucideAngularModule, MoreHorizontal, CalendarDays, Repeat2 } from 'lucide-angular';

import { TranslatePipe } from '@ngx-translate/core';

import { RecurringPayment } from '../../models/recurring-payment.model';

@Component({
  selector: 'app-recurring-payment-card',

  standalone: true,

  imports: [LucideAngularModule, TranslatePipe],

  templateUrl: './recurring-payment-card.html',

  styleUrl: './recurring-payment-card.scss',
})
export class RecurringPaymentCard {
  @Input({
    required: true,
  })
  payment!: RecurringPayment;

  readonly MoreHorizontal = MoreHorizontal;

  readonly CalendarDays = CalendarDays;

  readonly Repeat2 = Repeat2;
}
