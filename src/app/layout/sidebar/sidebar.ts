import {
  Component,
  computed,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  Output,
} from '@angular/core';

import {
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

import {
  TranslatePipe,
} from '@ngx-translate/core';

import {
  LucideAngularModule,
  LayoutDashboard,
  WalletCards,
  ArrowLeftRight,
  ChartPie,
  Settings,
  Target,
  HandCoins,
  CalendarClock,
  Bell,
  CircleHelp,
  Crown,
  LogOut,
} from 'lucide-angular';

import {
  NotificationsService,
} from '../../features/notifications/services/notifications';

import {
  AuthService,
} from '../../features/auth/services/auth.service';

@Component({
  selector: 'app-sidebar',

  imports: [
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    LucideAngularModule,
  ],

  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  /* =========================
     Inputs & Outputs
  ========================= */

  @Input()
  isOpen = false;

  @Output()
  closeSidebar =
    new EventEmitter<void>();

  @Output()
  logoutRequested =
    new EventEmitter<void>();

  /* =========================
     Services
  ========================= */

  private readonly notificationsService =
    inject(NotificationsService);

  private readonly authService =
    inject(AuthService);

  /* =========================
     State
  ========================= */

  readonly unreadNotifications =
    this.notificationsService.unreadCount;

  readonly user =
    this.authService.user;

  readonly userInitial =
    computed(() => {
      const name =
        this.user()?.name.trim();

      return name
        ? name.charAt(0).toUpperCase()
        : 'U';
    });

  /* =========================
     Host
  ========================= */

  @HostBinding(
    'class.sidebar-host--open',
  )
  get opened(): boolean {
    return this.isOpen;
  }

  /* =========================
     Icons
  ========================= */

  readonly LayoutDashboard =
    LayoutDashboard;

  readonly WalletCards =
    WalletCards;

  readonly ArrowLeftRight =
    ArrowLeftRight;

  readonly ChartPie =
    ChartPie;

  readonly Settings =
    Settings;

  readonly Target =
    Target;

  readonly HandCoins =
    HandCoins;

  readonly CalendarClock =
    CalendarClock;

  readonly Bell =
    Bell;

  readonly CircleHelp =
    CircleHelp;

  readonly Crown =
    Crown;

  readonly LogOut =
    LogOut;

  /* =========================
     Actions
  ========================= */

  close(): void {
    this.closeSidebar.emit();
  }

  requestLogout(): void {
    this.logoutRequested.emit();
    this.close();
  }
}