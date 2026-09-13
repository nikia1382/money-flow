import {
  Component,
  inject,
  signal,
} from '@angular/core';

import {
  CalendarClock,
  CircleDollarSign,
  Clock3,
  LucideAngularModule,
  Plus,
  SearchX,
  TriangleAlert,
} from 'lucide-angular';

import {
  TranslatePipe,
} from '@ngx-translate/core';

import {
  RecurringPayment,
} from '../../models/recurring-payment.model';

import {
  DataTable,
} from '../../../../shared/components/data-table/data-table';

import {
  DataTableColumn,
} from '../../../../shared/components/data-table/data-table.model';

import {
  DataToolbar,
} from '../../../../shared/components/data-toolbar/data-toolbar';

import {
  ToolbarFilter,
} from '../../../../shared/components/data-toolbar/data-toolbar.model';

import {
  AddRecurringPaymentModal,
  RecurringPaymentForm,
} from '../../../../shared/components/add-recurring-payment-modal/add-recurring-payment-modal';

import {
  StateView,
} from '../../../../shared/components/state-view/state-view';

import {
  ConfirmDialog,
} from '../../../../shared/components/confirm-dialog/confirm-dialog';

import {
  LocaleNumberPipe,
} from '../../../../shared/pipes/locale-number-pipe';
import { RecurringPaymentsService } from '../../services/recurring-payments';


@Component({
  selector:
    'app-recurring-payments',

  standalone: true,

  imports: [
    LucideAngularModule,
    TranslatePipe,
    DataTable,
    DataToolbar,
    AddRecurringPaymentModal,
    StateView,
    ConfirmDialog,
    LocaleNumberPipe,
  ],

  templateUrl:
    './recurring-payments.html',

  styleUrl:
    './recurring-payments.scss',
})
export class RecurringPayments {
  /* =========================
     Service
  ========================= */

  private readonly service =
    inject(
      RecurringPaymentsService,
    );

  /* =========================
     Data
  ========================= */

  readonly payments =
    this.service.payments;

  readonly monthlyTotal =
    this.service.monthlyTotal;

  readonly activeCount =
    this.service.activeCount;

  readonly dueSoonCount =
    this.service.dueSoonCount;

  readonly overdueCount =
    this.service.overdueCount;

  /* =========================
     UI State
  ========================= */

  readonly isAddPaymentOpen =
    signal(false);

  readonly editingPayment =
    signal<
      RecurringPayment | null
    >(null);

  readonly paymentPendingDelete =
    signal<
      RecurringPayment | null
    >(null);

  searchTerm = '';

  selectedStatus = 'all';

  selectedFrequency = 'all';

  /* =========================
     Icons
  ========================= */

  readonly Plus = Plus;

  readonly CalendarClock =
    CalendarClock;

  readonly CircleDollarSign =
    CircleDollarSign;

  readonly Clock3 = Clock3;

  readonly TriangleAlert =
    TriangleAlert;

  readonly SearchX = SearchX;

  /* =========================
     Data Table
  ========================= */

  readonly paymentColumns:
    DataTableColumn<RecurringPayment>[] =
    [
      {
        key: 'title',
        labelKey:
          'recurringPayments.table.payment',
        type: 'text',
        width: '2fr',
      },

      {
        key: 'amount',
        labelKey:
          'recurringPayments.table.amount',
        type: 'currency',
        width: '1fr',
      },

      {
        key: 'account',
        labelKey:
          'recurringPayments.table.account',
        type: 'text',
        width: '1.2fr',
      },

      {
        key: 'frequency',
        labelKey:
          'recurringPayments.table.frequency',
        type: 'badge',
        width: '1fr',
        valueKeyPrefix:
          'recurringPayments.frequency',
      },

      {
        key: 'nextPaymentDate',
        labelKey:
          'recurringPayments.table.nextPayment',
        type: 'date',
        width: '1.2fr',
      },

      {
        key: 'status',
        labelKey:
          'recurringPayments.table.status',
        type: 'badge',
        width: '0.9fr',
        valueKeyPrefix:
          'recurringPayments.status',
      },

      {
        key: 'actions',
        labelKey: '',
        type: 'actions',
        width: '50px',
        align: 'end',
      },
    ];

  /* =========================
     Toolbar
  ========================= */

  readonly toolbarFilters:
    ToolbarFilter[] = [
      {
        key: 'status',

        labelKey:
          'recurringPayments.filters.status',

        options: [
          {
            value: 'all',
            labelKey:
              'recurringPayments.filters.all',
          },

          {
            value: 'active',
            labelKey:
              'recurringPayments.status.active',
          },

          {
            value: 'dueSoon',
            labelKey:
              'recurringPayments.status.dueSoon',
          },

          {
            value: 'overdue',
            labelKey:
              'recurringPayments.status.overdue',
          },
        ],
      },

      {
        key: 'frequency',

        labelKey:
          'recurringPayments.filters.frequency',

        options: [
          {
            value: 'all',
            labelKey:
              'recurringPayments.filters.all',
          },

          {
            value: 'weekly',
            labelKey:
              'recurringPayments.frequency.weekly',
          },

          {
            value: 'monthly',
            labelKey:
              'recurringPayments.frequency.monthly',
          },

          {
            value: 'yearly',
            labelKey:
              'recurringPayments.frequency.yearly',
          },
        ],
      },
    ];

  get toolbarFilterValues():
    Record<string, string> {
    return {
      status:
        this.selectedStatus,

      frequency:
        this.selectedFrequency,
    };
  }

  /* =========================
     Filtering
  ========================= */

  get filteredPayments():
    RecurringPayment[] {
    const search =
      this.searchTerm
        .trim()
        .toLowerCase();

    return this.payments().filter(
      (payment) => {
        const searchableText = [
          payment.title,
          payment.category,
          payment.account,
          payment.frequency,
          payment.status,
        ]
          .join(' ')
          .toLowerCase();

        const matchesSearch =
          !search ||
          searchableText.includes(
            search,
          );

        const matchesStatus =
          this.selectedStatus ===
            'all' ||
          payment.status ===
            this.selectedStatus;

        const matchesFrequency =
          this.selectedFrequency ===
            'all' ||
          payment.frequency ===
            this.selectedFrequency;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesFrequency
        );
      },
    );
  }

  onToolbarFilterChange(
    event: {
      key: string;
      value: string;
    },
  ): void {
    if (
      event.key === 'status'
    ) {
      this.selectedStatus =
        event.value;
    }

    if (
      event.key ===
      'frequency'
    ) {
      this.selectedFrequency =
        event.value;
    }
  }

  clearFilters(): void {
    this.searchTerm = '';

    this.selectedStatus =
      'all';

    this.selectedFrequency =
      'all';
  }

  /* =========================
     Add
  ========================= */

  openAddPayment(): void {
    this.isAddPaymentOpen.set(
      true,
    );
  }

  closeAddPayment(): void {
    this.isAddPaymentOpen.set(
      false,
    );
  }

  addPayment(
    form: RecurringPaymentForm,
  ): void {
    if (form.amount === null) {
      return;
    }

    this.service.addPayment({
      title: form.title,

      category: form.category,

      amount: form.amount,

      account: form.account,

      frequency:
        form.frequency,

      nextPaymentDate:
        form.nextPaymentDate,
    });

    this.closeAddPayment();
  }

  /* =========================
     Edit
  ========================= */

  editPayment(
    payment: RecurringPayment,
  ): void {
    this.editingPayment.set(
      payment,
    );
  }

  closeEditPayment(): void {
    this.editingPayment.set(
      null,
    );
  }

  updatePayment(
    form: RecurringPaymentForm,
  ): void {
    const payment =
      this.editingPayment();

    if (
      !payment ||
      form.amount === null
    ) {
      return;
    }

    this.service.updatePayment({
      ...payment,

      title: form.title,

      category:
        form.category,

      amount: form.amount,

      account: form.account,

      frequency:
        form.frequency,

      nextPaymentDate:
        form.nextPaymentDate,
    });

    this.closeEditPayment();
  }

  /* =========================
     Delete
  ========================= */

  deletePayment(
    payment: RecurringPayment,
  ): void {
    this.paymentPendingDelete.set(
      payment,
    );
  }

  cancelDeletePayment(): void {
    this.paymentPendingDelete.set(
      null,
    );
  }

confirmDeletePayment(): void {
  const payment =
    this.paymentPendingDelete();



  if (!payment) {
    console.error(
      'No payment selected for delete',
    );

    return;
  }



  this.service.deletePayment(
    payment.id,
  );

  this.paymentPendingDelete.set(
    null,
  );
}
}