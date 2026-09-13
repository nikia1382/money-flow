import {
  inject,
  Injectable,
  signal,
} from '@angular/core';

import {
  HttpClient,
} from '@angular/common/http';

/* =========================
   API Models
========================= */

export interface FinancialGoal {
  id: number;
  title: string;
  currentAmount: number;
  targetAmount: number;
  category: string;
  deadline: string | null;
}

export interface FinancialGoalRequest {
  title: string;
  currentAmount: number;
  targetAmount: number;
  category: string;
  deadline: string;
}

/* =========================
   UI Form Model
========================= */

export interface FinancialGoalForm {
  title: string;
  category: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
}

@Injectable({
  providedIn: 'root',
})
export class FinancialGoalsService {
  /* =========================
     API
  ========================= */

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8080/api/financial-goals';

  /* =========================
     State
  ========================= */

  readonly goals =
    signal<FinancialGoal[]>([]);

  /* =========================
     Constructor
  ========================= */

  constructor() {
    this.loadGoals();
  }

  /* =========================
     GET
  ========================= */

  private loadGoals(): void {
    this.http
      .get<FinancialGoal[]>(
        this.apiUrl,
      )
      .subscribe({
        next: (goals) => {
          this.goals.set(
            goals,
          );
        },

        error: (error) => {
          console.error(
            'Failed to load financial goals',
            error,
          );
        },
      });
  }

  /* =========================
     POST
  ========================= */

  addGoal(
    form: FinancialGoalForm,
  ): void {
    const payload =
      this.toRequest(form);

    this.http
      .post<FinancialGoal>(
        this.apiUrl,
        payload,
      )
      .subscribe({
        next: (createdGoal) => {
          this.goals.update(
            (goals) => [
              ...goals,
              createdGoal,
            ],
          );
        },

        error: (error) => {
          console.error(
            'Failed to add financial goal',
            error,
          );
        },
      });
  }

  /* =========================
     PUT
  ========================= */

  updateGoal(
    id: number,
    form: FinancialGoalForm,
  ): void {
    const payload =
      this.toRequest(form);

    this.http
      .put<FinancialGoal>(
        `${this.apiUrl}/${id}`,
        payload,
      )
      .subscribe({
        next: (updatedGoal) => {
          this.goals.update(
            (goals) =>
              goals.map(
                (goal) =>
                  goal.id ===
                  updatedGoal.id
                    ? updatedGoal
                    : goal,
              ),
          );
        },

        error: (error) => {
          console.error(
            'Failed to update financial goal',
            error,
          );
        },
      });
  }

  /* =========================
     DELETE
  ========================= */

  deleteGoal(
    id: number,
  ): void {
    this.http
      .delete<void>(
        `${this.apiUrl}/${id}`,
      )
      .subscribe({
        next: () => {
          this.goals.update(
            (goals) =>
              goals.filter(
                (goal) =>
                  goal.id !== id,
              ),
          );
        },

        error: (error) => {
          console.error(
            'Failed to delete financial goal',
            error,
          );
        },
      });
  }

  /* =========================
     Mapping
  ========================= */

  private toRequest(
    form: FinancialGoalForm,
  ): FinancialGoalRequest {
    return {
      title:
        form.title,

      category:
        form.category,

      targetAmount:
        form.targetAmount,

      currentAmount:
        form.savedAmount,

      deadline:
        form.deadline,
    };
  }

  /* =========================
     Refresh
  ========================= */

  refreshGoals(): void {
    this.loadGoals();
  }
  /* =========================
   CONTRIBUTION
========================= */

contributeToGoal(
  id: number,
  amount: number,
): void {
  this.http
    .patch<FinancialGoal>(
      `${this.apiUrl}/${id}/contribute`,
      {
        amount,
      },
    )
    .subscribe({
      next: (updatedGoal) => {
        this.goals.update(
          (goals) =>
            goals.map(
              (goal) =>
                goal.id === updatedGoal.id
                  ? updatedGoal
                  : goal,
            ),
        );
      },

      error: (error) => {
        console.error(
          'Failed to contribute to financial goal',
          error,
        );
      },
    });
}
}