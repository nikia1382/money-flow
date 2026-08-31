import { Component, computed, inject, signal } from '@angular/core';

import {
  LucideAngularModule,
  Plus,
  HandCoins,
  ArrowUpRight,
  ArrowDownLeft,
  TriangleAlert,
  SearchX,
} from 'lucide-angular';

import { TranslatePipe } from '@ngx-translate/core';

import { DebtsService } from '../../services/debts';
import { DebtCard } from '../../components/debt-card/debt-card';
import { AddDebtModal, NewDebt } from '../../components/add-debt-modal/add-debt-modal';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { Debt } from '../../model/debt.model';
import { RecordPaymentModal } from '../../components/record-payment-modal/record-payment-modal';

@Component({
  selector: 'app-debts',

  standalone: true,

  imports: [
    LucideAngularModule,
    TranslatePipe,
    DebtCard,
    AddDebtModal,
    ConfirmDialog,
    RecordPaymentModal,
  ],

  templateUrl: './debts.html',
  styleUrl: './debts.scss',
})
export class Debts {
  private readonly debtsService = inject(DebtsService);
  readonly paymentDebt = signal<Debt | null>(null);

  readonly Plus = Plus;
  readonly HandCoins = HandCoins;
  readonly ArrowUpRight = ArrowUpRight;
  readonly ArrowDownLeft = ArrowDownLeft;
  readonly TriangleAlert = TriangleAlert;
  readonly editingDebt = signal<Debt | null>(null);
  readonly SearchX = SearchX;
  readonly debtPendingDelete = signal<Debt | null>(null);
  readonly isAddDebtOpen = signal(false);
  readonly debts = this.debtsService.debts;

  readonly totalIOwe = this.debtsService.totalIOwe;

  readonly totalOwedToMe = this.debtsService.totalOwedToMe;

  readonly activeCount = this.debtsService.activeCount;

  readonly overdueCount = this.debtsService.overdueCount;
  readonly searchTerm = signal('');

  readonly selectedType = signal('all');

  readonly selectedStatus = signal('all');

  openAddDebt(): void {
    this.isAddDebtOpen.set(true);
  }
  closeAddDebt(): void {
    this.isAddDebtOpen.set(false);
  }
  addDebt(form: NewDebt): void {
    if (form.totalAmount === null) {
      return;
    }

    this.debtsService.addDebt({
      id: Date.now(),

      personName: form.personName,

      type: form.type,

      totalAmount: form.totalAmount,

      paidAmount: form.paidAmount,

      dueDate: form.dueDate,

      status: form.paidAmount >= form.totalAmount ? 'paid' : 'active',

      note: form.note || undefined,
    });

    this.closeAddDebt();
  }
  openEditDebt(debt: Debt): void {
    this.editingDebt.set(debt);
  }

  closeEditDebt(): void {
    this.editingDebt.set(null);
  }

  updateDebt(form: NewDebt): void {
    const debt = this.editingDebt();

    if (!debt || form.totalAmount === null) {
      return;
    }

    this.debtsService.updateDebt({
      ...debt,

      personName: form.personName,

      type: form.type,

      totalAmount: form.totalAmount,

      paidAmount: form.paidAmount,

      dueDate: form.dueDate,

      status:
        form.paidAmount >= form.totalAmount
          ? 'paid'
          : debt.status === 'overdue'
            ? 'overdue'
            : 'active',

      note: form.note || undefined,
    });

    this.closeEditDebt();
  }
  openDeleteDebt(debt: Debt): void {
    this.debtPendingDelete.set(debt);
  }

  cancelDeleteDebt(): void {
    this.debtPendingDelete.set(null);
  }

  confirmDeleteDebt(): void {
    const debt = this.debtPendingDelete();

    if (!debt) {
      return;
    }

    this.debtsService.deleteDebt(debt.id);

    this.debtPendingDelete.set(null);
  }
  openRecordPayment(debt: Debt): void {
    this.paymentDebt.set(debt);
  }
  closeRecordPayment(): void {
    this.paymentDebt.set(null);
  }
  recordPayment(amount: number): void {
    const debt = this.paymentDebt();

    if (!debt) {
      return;
    }

    const paidAmount = Math.min(debt.totalAmount, debt.paidAmount + amount);

    this.debtsService.updateDebt({
      ...debt,

      paidAmount,

      status: paidAmount >= debt.totalAmount ? 'paid' : debt.status,
    });

    this.closeRecordPayment();
  }
  readonly filteredDebts = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();

    const type = this.selectedType();

    const statusFilter = this.selectedStatus();

    return this.debts().filter((debt) => {
      const matchesSearch =
        !search ||
        debt.personName.toLowerCase().includes(search) ||
        (debt.note ?? '').toLowerCase().includes(search);

      const matchesType = type === 'all' || debt.type === type;

      const status = this.getDebtStatus(debt);

      const matchesStatus = statusFilter === 'all' || status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  });
  getDebtStatus(debt: Debt): 'active' | 'paid' | 'overdue' {
    if (debt.paidAmount >= debt.totalAmount) {
      return 'paid';
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(`${debt.dueDate}T00:00:00`);

    if (dueDate < today) {
      return 'overdue';
    }

    return 'active';
  }
}
