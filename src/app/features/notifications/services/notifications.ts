import {
  computed,
  inject,
  Injectable,
  signal,
} from '@angular/core';

import {
  HttpClient,
} from '@angular/common/http';

import {
  TranslateService,
} from '@ngx-translate/core';

import {
  ToastService,
} from '../../../shared/services/toast';
import { environment } from '../../../../environments/environment';

export type NotificationType =
  | 'payment'
  | 'budget'
  | 'account';

export interface NotificationItem {
  id: number;
  title: string;
  description: string;
  date: string;
  type: NotificationType;
  isRead: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {

  /* =========================
     Services
  ========================= */

  private readonly http =
    inject(HttpClient);

  private readonly toast =
    inject(ToastService);

  private readonly translate =
    inject(TranslateService);

  /* =========================
     API
  ========================= */

  private readonly apiUrl =
    `${environment.apiUrl}/notifications`;

  /* =========================
     State
  ========================= */

  readonly notifications =
    signal<NotificationItem[]>([]);

  readonly unreadCount =
    computed(
      () =>
        this.notifications()
          .filter(
            (notification) =>
              !notification.isRead,
          )
          .length,
    );

  /* =========================
     Constructor
  ========================= */

  constructor() {
    this.loadNotifications();
  }

  /* =========================
     GET
  ========================= */

  loadNotifications(): void {
    this.http
      .get<NotificationItem[]>(
        this.apiUrl,
      )
      .subscribe({
        next: (notifications) => {
          this.notifications.set(
            notifications,
          );
        },

        error: (error) => {
          console.error(
            'Failed to load notifications',
            error,
          );
        },
      });
  }

  /* =========================
     MARK AS READ
  ========================= */

  markAsRead(
    id: number,
  ): void {
    const notification =
      this.notifications()
        .find(
          (item) =>
            item.id === id,
        );

    if (
      !notification ||
      notification.isRead
    ) {
      return;
    }

    this.http
      .patch<NotificationItem>(
        `${this.apiUrl}/${id}/read`,
        {},
      )
      .subscribe({
        next: (updatedNotification) => {
          this.notifications.update(
            (items) =>
              items.map(
                (item) =>
                  item.id ===
                  updatedNotification.id
                    ? updatedNotification
                    : item,
              ),
          );
        },

        error: (error) => {
          console.error(
            'Failed to mark notification as read',
            error,
          );

          this.showRequestError();
        },
      });
  }

  /* =========================
     MARK ALL AS READ
  ========================= */

  markAllAsRead(): void {
    if (this.unreadCount() === 0) {
      return;
    }

    this.http
      .patch<void>(
        `${this.apiUrl}/read-all`,
        {},
      )
      .subscribe({
        next: () => {
          this.notifications.update(
            (items) =>
              items.map(
                (item) => ({
                  ...item,
                  isRead: true,
                }),
              ),
          );

          this.toast.success(
            this.translate.instant(
              'notifications.toast.allRead',
            ),
          );
        },

        error: (error) => {
          console.error(
            'Failed to mark all notifications as read',
            error,
          );

          this.showRequestError();
        },
      });
  }

  /* =========================
     DELETE ONE
  ========================= */

  deleteNotification(
    id: number,
  ): void {
    this.http
      .delete<void>(
        `${this.apiUrl}/${id}`,
      )
      .subscribe({
        next: () => {
          this.notifications.update(
            (items) =>
              items.filter(
                (item) =>
                  item.id !== id,
              ),
          );

          this.toast.success(
            this.translate.instant(
              'notifications.toast.deleted',
            ),
          );
        },

        error: (error) => {
          console.error(
            'Failed to delete notification',
            error,
          );

          this.showRequestError();
        },
      });
  }

  /* =========================
     DELETE ALL
  ========================= */

  deleteAllNotifications(): void {
    this.http
      .delete<void>(
        this.apiUrl,
      )
      .subscribe({
        next: () => {
          this.notifications.set([]);
        },

        error: (error) => {
          console.error(
            'Failed to delete all notifications',
            error,
          );

          this.showRequestError();
        },
      });
  }

  /* =========================
     Error
  ========================= */

  private showRequestError(): void {
    this.toast.error(
      this.translate.instant(
        'notifications.toast.requestFailed',
      ),
    );
  }
}
