import {
  inject,
  Injectable,
  signal,
} from '@angular/core';

import {
  HttpClient,
} from '@angular/common/http';

import {
  Budget,
} from '../models/budget.model';

/* =========================
   API Models
========================= */


export interface CategoryApiResponse {
  id: number;
  name: string;
  type: string;
  icon: string | null;
}
interface BudgetApiResponse {
  id: number;
  categoryId: number;
  categoryName: string;
  limitAmount: number;
  spent: number;
  month: string;
}
/* =========================
   Service
========================= */

@Injectable({
  providedIn: 'root',
})
export class BudgetsService {

  /* =========================
     API
  ========================= */

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8080/api/budgets';

  private readonly categoriesApiUrl =
    'http://localhost:8080/api/categories';

  /* =========================
     State
  ========================= */

  readonly editingBudget =
    signal<Budget | null>(null);

  readonly budgets =
    signal<Budget[]>([]);

readonly categories =
  signal<CategoryApiResponse[]>([]);
  /* =========================
     Constructor
  ========================= */

  constructor() {
    this.loadCategories();
    this.loadBudgets();
  }

  /* =========================
     Categories
  ========================= */

  private loadCategories(): void {
    this.http
      .get<CategoryApiResponse[]>(
        this.categoriesApiUrl,
      )
      .subscribe({
        next: (categories) => {
          this.categories.set(
            categories,
          );
        },

        error: (error) => {
          console.error(
            'Failed to load categories',
            error,
          );
        },
      });
  }

  private getCategoryId(
    categoryName: string,
  ): number | null {

    const normalizedName =
      categoryName
        .trim()
        .toLowerCase();

    const category =
      this.categories().find(
        (item) =>
          item.name
            .trim()
            .toLowerCase() ===
          normalizedName,
      );

    return category?.id ?? null;
  }

  /* =========================
     GET
  ========================= */

  private loadBudgets(): void {
    this.http
      .get<BudgetApiResponse[]>(
        this.apiUrl,
      )
      .subscribe({
        next: (budgets) => {
          this.budgets.set(
            budgets.map(
              (budget) =>
                this.mapBudget(
                  budget,
                ),
            ),
          );
        },

        error: (error) => {
          console.error(
            'Failed to load budgets',
            error,
          );
        },
      });
  }

  /* =========================
     POST
  ========================= */

  addBudget(
    budget: Omit<Budget, 'id'>,
  ): void {

    const categoryId =
      this.getCategoryId(
        budget.category,
      );

    if (categoryId === null) {
      console.error(
        'Category not found:',
        budget.category,
      );

      return;
    }

    const payload = {
      categoryId,

      limitAmount:
        budget.limit,

      month:
        budget.month,
    };

    this.http
      .post<BudgetApiResponse>(
        this.apiUrl,
        payload,
      )
      .subscribe({
        next: (createdBudget) => {
          this.budgets.update(
            (budgets) => [
              ...budgets,

              this.mapBudget(
                createdBudget,
              ),
            ],
          );
        },

        error: (error) => {
          console.error(
            'Failed to add budget',
            error,
          );
        },
      });
  }

  /* =========================
     PUT
  ========================= */

  updateBudget(
    updatedBudget: Budget,
  ): void {

    const categoryId =
      this.getCategoryId(
        updatedBudget.category,
      );

    if (categoryId === null) {
      console.error(
        'Category not found:',
        updatedBudget.category,
      );

      return;
    }

    const payload = {
      categoryId,

      limitAmount:
        updatedBudget.limit,

      month:
        updatedBudget.month,
    };

    this.http
      .put<BudgetApiResponse>(
        `${this.apiUrl}/${updatedBudget.id}`,
        payload,
      )
      .subscribe({
        next: (savedBudget) => {
          this.budgets.update(
            (budgets) =>
              budgets.map(
                (budget) =>
                  budget.id ===
                  savedBudget.id
                    ? this.mapBudget(
                        savedBudget,
                      )
                    : budget,
              ),
          );
        },

        error: (error) => {
          console.error(
            'Failed to update budget',
            error,
          );
        },
      });
  }

  /* =========================
     DELETE
  ========================= */

  deleteBudget(
    budgetId: number,
  ): void {

    this.http
      .delete<void>(
        `${this.apiUrl}/${budgetId}`,
      )
      .subscribe({
        next: () => {
          this.budgets.update(
            (budgets) =>
              budgets.filter(
                (budget) =>
                  budget.id !==
                  budgetId,
              ),
          );
        },

        error: (error) => {
          console.error(
            'Failed to delete budget',
            error,
          );
        },
      });
  }

  /* =========================
     Mapper
  ========================= */

private mapBudget(
  budget: BudgetApiResponse,
): Budget {
  return {
    id: budget.id,
    category: budget.categoryName,
    limit: budget.limitAmount,
    spent: budget.spent,
    month: budget.month,
  };
}
}