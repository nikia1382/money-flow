import { Injectable, computed, signal } from '@angular/core';

export interface NotificationItem {
  id: number;
  title: string;
  description: string;
  date: string;
  type: 'payment' | 'budget' | 'account';
  isRead: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  readonly notifications = signal<NotificationItem[]>([
    {
      id: 1,
      title: 'notifications.items.upcomingPayment.title',
      description: 'notifications.items.upcomingPayment.description',
      date: '2026-09-01',
      type: 'payment',
      isRead: false,
    },
    {
      id: 2,
      title: 'notifications.items.budgetWarning.title',
      description: 'notifications.items.budgetWarning.description',
      date: '2026-08-29',
      type: 'budget',
      isRead: false,
    },
    {
      id: 3,
      title: 'notifications.items.accountUpdated.title',
      description: 'notifications.items.accountUpdated.description',
      date: '2026-08-28',
      type: 'account',
      isRead: true,
    },
  ]);

  readonly unreadCount = computed(
    () => this.notifications().filter((notification) => !notification.isRead).length,
  );

  markAsRead(id: number): void {
    this.notifications.update((items) =>
      items.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    );
  }

  markAllAsRead(): void {
    this.notifications.update((items) =>
      items.map((item) => ({
        ...item,
        isRead: true,
      })),
    );
  }
}
