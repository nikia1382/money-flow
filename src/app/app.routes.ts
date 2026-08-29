import { Routes } from '@angular/router';
export const routes: Routes = [
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
          import('./features/transactions/pages/transactions/transactions').then((m) => m.Transactions),
      },
          {
        path: 'budgets',
        loadComponent: () =>
          import('./features/budgets/pages/budgets/budgets').then((m) => m.Budgets),
      },

{
  path: 'recurring-payments',

  loadComponent: () =>
    import(
      './features/recurring-payments/pages/recurring-payments/recurring-payments'
    ).then(
      m => m.RecurringPayments
    )
},
{
  path: 'help',

  loadComponent: () =>
    import(
      './features/help/pages/help/help'
    ).then(
      m => m.Help
    )
},
{
  path: 'goals',
  loadComponent: () =>
    import('./features/goals/pages/goals/goals')
      .then(m => m.Goals)
},
    ],
  },
];
