import { Injectable, computed, signal } from '@angular/core';
import { Debt } from '../model/debt.model';

@Injectable({
  providedIn: 'root',
})
export class DebtsService {
  readonly debts = signal<Debt[]>([
    {
      id: 1,
      personName: 'Ali',
      type: 'i-owe',
      totalAmount: 20_000_000,
      paidAmount: 5_000_000,
      dueDate: '2026-09-15',
      status: 'active',
      note: 'Personal loan',
    },
    {
      id: 2,
      personName: 'Sara',
      type: 'owed-to-me',
      totalAmount: 12_000_000,
      paidAmount: 0,
      dueDate: '2026-09-05',
      status: 'active',
      note: 'Shared travel expenses',
    },
    {
      id: 3,
      personName: 'Reza',
      type: 'owed-to-me',
      totalAmount: 8_000_000,
      paidAmount: 8_000_000,
      dueDate: '2026-08-20',
      status: 'paid',
    },
  ]);

  readonly totalIOwe = computed(() =>
    this.debts()
      .filter((debt) => debt.type === 'i-owe' && debt.status !== 'paid')
      .reduce((total, debt) => total + this.getRemainingAmount(debt), 0),
  );

  readonly totalOwedToMe = computed(() =>
    this.debts()
      .filter((debt) => debt.type === 'owed-to-me' && debt.status !== 'paid')
      .reduce((total, debt) => total + this.getRemainingAmount(debt), 0),
  );

  readonly activeCount = computed(
    () => this.debts().filter((debt) => debt.status === 'active').length,
  );

  readonly overdueCount = computed(
    () => this.debts().filter((debt) => this.isOverdue(debt)).length,
  );

  getRemainingAmount(debt: Debt): number {
    return Math.max(0, debt.totalAmount - debt.paidAmount);
  }

  addDebt(debt: Debt): void {
    this.debts.update((debts) => [...debts, debt]);
  }

  updateDebt(updatedDebt: Debt): void {
    this.debts.update((debts) =>
      debts.map((debt) => (debt.id === updatedDebt.id ? updatedDebt : debt)),
    );
  }

  deleteDebt(id: number): void {
    this.debts.update((debts) => debts.filter((debt) => debt.id !== id));
  }
  isOverdue(debt: Debt): boolean {
    if (debt.status === 'paid') {
      return false;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(`${debt.dueDate}T00:00:00`);

    return dueDate < today;
  }
}
