import { Component, signal } from '@angular/core';

import {
  LucideAngularModule,
  Plus,
  CalendarClock,
  CircleDollarSign,
  Clock3,
  TriangleAlert,
  SearchX,
} from 'lucide-angular';

import { TranslatePipe } from '@ngx-translate/core';

import { RecurringPayment } from '../../models/recurring-payment.model';

import { DataTable } from '../../../../shared/components/data-table/data-table';

import { DataTableColumn } from '../../../../shared/components/data-table/data-table.model';

import { DataToolbar } from '../../../../shared/components/data-toolbar/data-toolbar';

import { ToolbarFilter } from '../../../../shared/components/data-toolbar/data-toolbar.model';
import {
  AddRecurringPaymentModal,
  RecurringPaymentForm,
} from '../../../../shared/components/add-recurring-payment-modal/add-recurring-payment-modal';
import { StateView } from '../../../../shared/components/state-view/state-view';

@Component({
  selector: 'app-recurring-payments',

  standalone: true,

  imports: [
    LucideAngularModule,
    TranslatePipe,
    DataTable,
    DataToolbar,
    AddRecurringPaymentModal,
    StateView,
  ],

  templateUrl: './recurring-payments.html',
  styleUrl: './recurring-payments.scss',
})
export class RecurringPayments {
  /* =========================
     Icons
  ========================= */

  readonly Plus = Plus;

  readonly CalendarClock = CalendarClock;

  readonly CircleDollarSign = CircleDollarSign;

  readonly Clock3 = Clock3;

  readonly TriangleAlert = TriangleAlert;
  readonly SearchX = SearchX;

  /* =========================
     Summary
  ========================= */

  /*   readonly monthlyTotal =
    4_850_000;

  readonly activeCount =
    4;

  readonly dueSoonCount =
    2;

  readonly overdueCount =
    1;
 */
  /* =========================
   Summary
========================= */
  readonly editingPayment = signal<RecurringPayment | null>(null);
  get monthlyTotal(): number {
    return this.payments
      .filter((payment) => payment.frequency === 'monthly')
      .reduce((total, payment) => total + payment.amount, 0);
  }

  get activeCount(): number {
    return this.payments.filter((payment) => payment.status === 'active').length;
  }

  get dueSoonCount(): number {
    return this.payments.filter((payment) => payment.status === 'dueSoon').length;
  }

  get overdueCount(): number {
    return this.payments.filter((payment) => payment.status === 'overdue').length;
  }
  /* =========================
     Toolbar State
  ========================= */

  searchTerm = '';

  selectedStatus = 'all';

  selectedFrequency = 'all';

  readonly isAddPaymentOpen = signal(false);

  openAddPayment(): void {
    this.isAddPaymentOpen.set(true);
  }

  closeAddPayment(): void {
    this.isAddPaymentOpen.set(false);
  }
  /* =========================
     Payments
  ========================= */

  payments: RecurringPayment[] = [
    {
      id: 1,
      title: 'Home Rent',
      category: 'Housing',
      amount: 3_000_000,
      account: 'Main Bank Account',
      frequency: 'monthly',
      nextPaymentDate: '2026-09-01',
      status: 'active',
    },
    {
      id: 2,
      title: 'Internet',
      category: 'Bills',
      amount: 450_000,
      account: 'Main Bank Account',
      frequency: 'monthly',
      nextPaymentDate: '2026-08-28',
      status: 'dueSoon',
    },
    {
      id: 3,
      title: 'Gym Membership',
      category: 'Health',
      amount: 900_000,
      account: 'Main Bank Account',
      frequency: 'monthly',
      nextPaymentDate: '2026-08-24',
      status: 'overdue',
    },
  ];

  /* =========================
     Data Table Config
  ========================= */

  readonly paymentColumns: DataTableColumn<RecurringPayment>[] = [
    {
      key: 'title',
      labelKey: 'recurringPayments.table.payment',
      type: 'text',
      width: '2fr',
    },

    {
      key: 'amount',
      labelKey: 'recurringPayments.table.amount',
      type: 'currency',
      width: '1fr',
    },

    {
      key: 'account',
      labelKey: 'recurringPayments.table.account',
      type: 'text',
      width: '1.2fr',
    },

    {
      key: 'frequency',
      labelKey: 'recurringPayments.table.frequency',
      type: 'badge',
      width: '1fr',
      valueKeyPrefix: 'recurringPayments.frequency',
    },

    {
      key: 'nextPaymentDate',
      labelKey: 'recurringPayments.table.nextPayment',
      type: 'date',
      width: '1.2fr',
    },

    {
      key: 'status',
      labelKey: 'recurringPayments.table.status',
      type: 'badge',
      width: '0.9fr',
      valueKeyPrefix: 'recurringPayments.status',
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
     Toolbar Config
  ========================= */

  readonly toolbarFilters: ToolbarFilter[] = [
    {
      key: 'status',

      labelKey: 'recurringPayments.filters.status',

      options: [
        {
          value: 'all',
          labelKey: 'recurringPayments.filters.all',
        },
        {
          value: 'active',
          labelKey: 'recurringPayments.status.active',
        },
        {
          value: 'dueSoon',
          labelKey: 'recurringPayments.status.dueSoon',
        },
        {
          value: 'overdue',
          labelKey: 'recurringPayments.status.overdue',
        },
      ],
    },

    {
      key: 'frequency',

      labelKey: 'recurringPayments.filters.frequency',

      options: [
        {
          value: 'all',
          labelKey: 'recurringPayments.filters.all',
        },
        {
          value: 'weekly',
          labelKey: 'recurringPayments.frequency.weekly',
        },
        {
          value: 'monthly',
          labelKey: 'recurringPayments.frequency.monthly',
        },
        {
          value: 'yearly',
          labelKey: 'recurringPayments.frequency.yearly',
        },
      ],
    },
  ];

  /* =========================
     Toolbar Values
  ========================= */

  get toolbarFilterValues(): Record<string, string> {
    return {
      status: this.selectedStatus,

      frequency: this.selectedFrequency,
    };
  }

  /* =========================
     Filtered Payments
  ========================= */

  get filteredPayments(): RecurringPayment[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.payments.filter((payment) => {
      const matchesSearch =
        !search ||
        payment.title.toLowerCase().includes(search) ||
        payment.category.toLowerCase().includes(search) ||
        payment.account.toLowerCase().includes(search);

      const matchesStatus = this.selectedStatus === 'all' || payment.status === this.selectedStatus;

      const matchesFrequency =
        this.selectedFrequency === 'all' || payment.frequency === this.selectedFrequency;

      return matchesSearch && matchesStatus && matchesFrequency;
    });
  }

  /* =========================
     Toolbar Actions
  ========================= */

  onToolbarFilterChange(event: { key: string; value: string }): void {
    switch (event.key) {
      case 'status':
        this.selectedStatus = event.value;

        break;

      case 'frequency':
        this.selectedFrequency = event.value;

        break;
    }
  }

  /* =========================
     Row Actions
  ========================= */

  editPayment(payment: RecurringPayment): void {
    this.editingPayment.set(payment);
  }

  deletePayment(payment: RecurringPayment): void {
    console.log('DELETE:', payment);
  }
  addPayment(form: RecurringPaymentForm): void {
    if (form.amount === null) {
      return;
    }

    const newPayment: RecurringPayment = {
      id: Date.now(),

      title: form.title,

      category: form.category,

      amount: form.amount,

      account: form.account,

      frequency: form.frequency,

      nextPaymentDate: form.nextPaymentDate,

      status: this.getPaymentStatus(form.nextPaymentDate),
    };

    this.payments = [...this.payments, newPayment];

    this.closeAddPayment();
  }
  private getPaymentStatus(nextPaymentDate: string): RecurringPayment['status'] {
    const today = new Date();

    const paymentDate = new Date(`${nextPaymentDate}T00:00:00`);

    today.setHours(0, 0, 0, 0);

    const difference = paymentDate.getTime() - today.getTime();

    const daysRemaining = Math.ceil(difference / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0) {
      return 'overdue';
    }

    if (daysRemaining <= 3) {
      return 'dueSoon';
    }

    return 'active';
  }
  closeEditPayment(): void {
    this.editingPayment.set(null);
  }
  updatePayment(form: RecurringPaymentForm): void {
    const payment = this.editingPayment();

    if (!payment || form.amount === null) {
      return;
    }

    const updatedPayment: RecurringPayment = {
      ...payment,

      title: form.title,

      category: form.category,

      amount: form.amount,

      account: form.account,

      frequency: form.frequency,

      nextPaymentDate: form.nextPaymentDate,

      status: this.getPaymentStatus(form.nextPaymentDate),
    };

    this.payments = this.payments.map((item) =>
      item.id === updatedPayment.id ? updatedPayment : item,
    );

    this.closeEditPayment();
  }
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'all';
    this.selectedFrequency = 'all';
  }
}
