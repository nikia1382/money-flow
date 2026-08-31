import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Bell, CheckCheck, CircleDollarSign, TriangleAlert, Wallet } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { TranslatePipe } from '@ngx-translate/core';

import { StateView } from '../../../../shared/components/state-view/state-view';
import { NotificationsService } from '../../services/notifications';
import { LocaleNumberPipe } from '../../../../shared/pipes/locale-number-pipe';

interface NotificationItem {
  id: number;
  title: string;
  description: string;
  date: string;
  type: 'payment' | 'budget' | 'account';
  isRead: boolean;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [DatePipe, LucideAngularModule, TranslatePipe, StateView, LocaleNumberPipe],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications {
  private readonly notificationsService = inject(NotificationsService);

  readonly notifications = this.notificationsService.notifications;

  readonly unreadCount = this.notificationsService.unreadCount;
  readonly Bell = Bell;
  readonly CheckCheck = CheckCheck;
  readonly CircleDollarSign = CircleDollarSign;
  readonly TriangleAlert = TriangleAlert;
  readonly Wallet = Wallet;

  markAsRead(id: number): void {
    this.notificationsService.markAsRead(id);
  }

  markAllAsRead(): void {
    this.notificationsService.markAllAsRead();
  }

  getIcon(type: NotificationItem['type']) {
    switch (type) {
      case 'payment':
        return this.CircleDollarSign;

      case 'budget':
        return this.TriangleAlert;

      default:
        return this.Wallet;
    }
  }
}
