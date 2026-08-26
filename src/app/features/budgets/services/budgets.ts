import {
  Injectable,
  signal
} from '@angular/core';

import {
  Budget
} from '../models/budget.model';


@Injectable({
  providedIn: 'root'
})
export class BudgetsService {

  private readonly storageKey =
    'moneyflow_budgets';

readonly editingBudget =
  signal<Budget | null>(null);
  readonly budgets =
    signal<Budget[]>(
      this.loadBudgets()
    );


  private loadBudgets(): Budget[] {

    const saved =
      localStorage.getItem(
        this.storageKey
      );

    if (saved) {
      return JSON.parse(saved);
    }


    return [
      {
        id: 1,
        category: 'Food',
        limit: 8_000_000,
        spent: 5_400_000,
        month: 'August 2026'
      },
      {
        id: 2,
        category: 'Transportation',
        limit: 4_000_000,
        spent: 2_900_000,
        month: 'August 2026'
      },
      {
        id: 3,
        category: 'Shopping',
        limit: 6_000_000,
        spent: 6_800_000,
        month: 'August 2026'
      }
    ];

  }


  private saveBudgets(): void {

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(
        this.budgets()
      )
    );

  }


  addBudget(
    budget: Omit<Budget, 'id'>
  ): void {

    const newBudget: Budget = {
      id: Date.now(),
      ...budget
    };


    this.budgets.update(
      budgets => [
        ...budgets,
        newBudget
      ]
    );


    this.saveBudgets();

  }


  updateBudget(
    updatedBudget: Budget
  ): void {

    this.budgets.update(
      budgets =>
        budgets.map(
          budget =>
            budget.id ===
            updatedBudget.id
              ? updatedBudget
              : budget
        )
    );


    this.saveBudgets();

  }


  deleteBudget(
    budgetId: number
  ): void {

    this.budgets.update(
      budgets =>
        budgets.filter(
          budget =>
            budget.id !==
            budgetId
        )
    );


    this.saveBudgets();

  }
  

}