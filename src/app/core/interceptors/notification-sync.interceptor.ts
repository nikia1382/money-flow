import {
  inject,
  Injector,
} from '@angular/core';

import {
  HttpEvent,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';

import {
  tap,
} from 'rxjs';

import {
  NotificationsService,
} from '../../features/notifications/services/notifications';

const notificationSourceUrls = [
  '/api/accounts',
  '/api/transactions',
  '/api/budgets',
  '/api/recurring-payments',
];

const mutationMethods = [
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
];

export const notificationSyncInterceptor:
  HttpInterceptorFn = (
    request,
    next,
  ) => {
    const injector =
      inject(Injector);

    const isMutation =
      mutationMethods.includes(
        request.method,
      );

    const canCreateNotification =
      notificationSourceUrls.some(
        (url) =>
          request.url.includes(url),
      );

    const shouldRefreshNotifications =
      isMutation &&
      canCreateNotification;

    return next(request).pipe(
      tap(
        (event: HttpEvent<unknown>) => {
          if (
            shouldRefreshNotifications &&
            event instanceof HttpResponse
          ) {
            /*
             * دریافت Service بعد از پایان
             * درخواست انجام می‌شود تا
             * Circular Dependency ایجاد نشود.
             */
            injector
              .get(NotificationsService)
              .loadNotifications();
          }
        },
      ),
    );
  };