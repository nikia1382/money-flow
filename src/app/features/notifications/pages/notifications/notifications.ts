import {
  Component,
  inject,
} from '@angular/core';

import {
  DatePipe,
} from '@angular/common';

import {
  Bell,
  CheckCheck,
  CircleDollarSign,
  TriangleAlert,
  Wallet,
  LucideAngularModule,
} from 'lucide-angular';

import {
  TranslatePipe,
} from '@ngx-translate/core';

import {
  StateView,
} from '../../../../shared/components/state-view/state-view';

import {
  LocaleNumberPipe,
} from '../../../../shared/pipes/locale-number-pipe';

import {
  NotificationItem,
  NotificationsService,
} from '../../services/notifications';

@Component({
  selector: 'app-notifications',

  standalone: true,

  imports: [
    DatePipe,
    LucideAngularModule,
    TranslatePipe,
    StateView,
    LocaleNumberPipe,
  ],

  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications {

  private readonly notificationsService =
    inject(NotificationsService);

  readonly notifications =
    this.notificationsService.notifications;

  readonly unreadCount =
    this.notificationsService.unreadCount;

  readonly Bell = Bell;
  readonly CheckCheck = CheckCheck;
  readonly CircleDollarSign =
    CircleDollarSign;
  readonly TriangleAlert =
    TriangleAlert;
  readonly Wallet = Wallet;
constructor() {
  this.notificationsService
    .loadNotifications();
}
  markAsRead(
    id: number,
  ): void {
    this.notificationsService
      .markAsRead(id);
  }

  markAllAsRead(): void {
    this.notificationsService
      .markAllAsRead();
  }

  getIcon(
    type:
      NotificationItem['type'],
  ) {
    switch (type) {
      case 'payment':
        return this.CircleDollarSign;

      case 'budget':
        return this.TriangleAlert;

      case 'account':
      default:
        return this.Wallet;
    }
  }
}