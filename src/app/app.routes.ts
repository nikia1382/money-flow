import { Routes } from '@angular/router';

export const routes: Routes = [
  /* =========================
     Main Application
  ========================= */

  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout').then((m) => m.MainLayout),

    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard').then((m) => m.Dashboard),
      },

      {
        path: 'accounts',
        loadComponent: () =>
          import('./features/accounts/pages/accounts/accounts').then((m) => m.Accounts),
      },

      {
        path: 'transactions',
        loadComponent: () =>
          import('./features/transactions/pages/transactions/transactions').then(
            (m) => m.Transactions,
          ),
      },

      {
        path: 'budgets',
        loadComponent: () =>
          import('./features/budgets/pages/budgets/budgets').then((m) => m.Budgets),
      },

      {
        path: 'recurring-payments',
        loadComponent: () =>
          import('./features/recurring-payments/pages/recurring-payments/recurring-payments').then(
            (m) => m.RecurringPayments,
          ),
      },

      {
        path: 'debts',
        loadComponent: () => import('./features/debts/pages/debts/debts').then((m) => m.Debts),
      },

      {
        path: 'goals',
        loadComponent: () => import('./features/goals/pages/goals/goals').then((m) => m.Goals),
      },

      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/notifications/pages/notifications/notifications').then(
            (m) => m.Notifications,
          ),
      },

      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/pages/settings/settings').then((m) => m.Settings),
      },

      {
        path: 'help',
        loadComponent: () => import('./features/help/pages/help/help').then((m) => m.Help),
      },

      {
        path: 'premium',
        loadComponent: () =>
          import('./features/premium/pages/premium/premium').then((m) => m.Premium),
      },
    ],
  },

  /* =========================
     404 - OUTSIDE MainLayout
  ========================= */

  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/pages/not-found/not-found').then((m) => m.NotFound),
  },
];
