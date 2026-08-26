import {
  Component
} from '@angular/core';

import {
  LucideAngularModule,
  Plus,
  CalendarClock,
  CircleDollarSign,
  Clock3,
  TriangleAlert
} from 'lucide-angular';

import {
  TranslatePipe
} from '@ngx-translate/core';
import { RecurringPaymentCard } from '../../components/recurring-payment-card/recurring-payment-card';
import { RecurringPayment } from '../../models/recurring-payment.model';
import { DataTable } from '../../../../shared/components/data-table/data-table';
import { DataTableColumn } from '../../../../shared/components/data-table/data-table.model';


@Component({
  selector: 'app-recurring-payments',

  standalone: true,

  imports: [
    LucideAngularModule,
    TranslatePipe,
    RecurringPaymentCard,
    DataTable
  ],

  templateUrl: './recurring-payments.html',
  styleUrl: './recurring-payments.scss'
})
export class RecurringPayments {

  readonly Plus = Plus;

  readonly CalendarClock =
    CalendarClock;

  readonly CircleDollarSign =
    CircleDollarSign;

  readonly Clock3 =
    Clock3;

  readonly TriangleAlert =
    TriangleAlert;


  readonly monthlyTotal =
    4_850_000;

  readonly activeCount =
    4;

  readonly dueSoonCount =
    2;

  readonly overdueCount =
    1;
    readonly payments:
  RecurringPayment[] = [

    {
      id: 1,
      title: 'Home Rent',
      category: 'Housing',
      amount: 3_000_000,
      account: 'Main Bank Account',
      frequency: 'monthly',
      nextPaymentDate: 'Sep 1, 2026',
      status: 'dueSoon'
    },

    {
      id: 2,
      title: 'Internet',
      category: 'Bills',
      amount: 450_000,
      account: 'Main Bank Account',
      frequency: 'monthly',
      nextPaymentDate: 'Sep 5, 2026',
      status: 'active'
    },

    {
      id: 3,
      title: 'Gym Membership',
      category: 'Health',
      amount: 900_000,
      account: 'Main Bank Account',
      frequency: 'monthly',
      nextPaymentDate: 'Aug 24, 2026',
      status: 'overdue'
    }

  ];
  readonly paymentColumns:
  DataTableColumn<RecurringPayment>[] = [

    {
      key: 'title',
      labelKey:
        'recurringPayments.table.payment',
      type: 'text',
      width: '2fr'
    },

    {
      key: 'amount',
      labelKey:
        'recurringPayments.table.amount',
      type: 'currency',
      width: '1fr'
    },

    {
      key: 'account',
      labelKey:
        'recurringPayments.table.account',
      type: 'text',
      width: '1.2fr'
    },

{
  key: 'frequency',

  labelKey:
    'recurringPayments.table.frequency',

  type: 'badge',

  width: '1fr',

  valueKeyPrefix:
    'recurringPayments.frequency'
},

    {
      key: 'nextPaymentDate',
      labelKey:
        'recurringPayments.table.nextPayment',
      type: 'date',
      width: '1.2fr'
    },

{
  key: 'status',

  labelKey:
    'recurringPayments.table.status',

  type: 'badge',

  width: '0.9fr',

  valueKeyPrefix:
    'recurringPayments.status'
}

  ];
}