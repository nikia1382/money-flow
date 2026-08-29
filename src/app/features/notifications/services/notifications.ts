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
      title: 'Upcoming payment',
      description: 'Your home rent payment is due soon.',
      date: '2026-09-01',
      type: 'payment',
      isRead: false,
    },
    {
      id: 2,
      title: 'Budget warning',
      description: 'You have used more than 80% of your Food budget.',
      date: '2026-08-29',
      type: 'budget',
      isRead: false,
    },
    {
      id: 3,
      title: 'Account updated',
      description: 'Your Main Bank Account balance was updated.',
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
