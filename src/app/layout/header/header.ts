import {
  Component,
  computed,
  EventEmitter,
  HostListener,
  inject,
  Output,
  signal,
} from '@angular/core';

import {
  DatePipe,
} from '@angular/common';

import {
  Router,
} from '@angular/router';

import {
  TranslatePipe,
} from '@ngx-translate/core';

import {
  LucideAngularModule,
  Menu,
  Search,
  Plus,
  Bell,
  Moon,
  Sun,
  ChevronDown,
  CalendarDays,
  LogOut,
  LogOutIcon,
} from 'lucide-angular';

import {
  AddTransactionModal,
  TransactionForm,
} from '../../shared/components/add-transaction-modal/add-transaction-modal';

import {
  DateRangeService,
  DashboardDateRange,
} from '../../core/services/date-range.service';

import {
  DashboardSearchService,
} from '../../core/services/dashboard-search.service';

import {
  TransactionsService,
} from '../../features/transactions/services/transactions';

import {
  NotificationsService,
} from '../../features/notifications/services/notifications';

import {
  SettingsService,
} from '../../features/settings/services/settings';

import {
  AuthService,
} from '../../features/auth/services/auth.service';
import { DashboardChartService } from '../../features/dashboard/services/dashboard-chart.service';

@Component({
  selector: 'app-header',

  imports: [
    DatePipe,
    LucideAngularModule,
    TranslatePipe,
    AddTransactionModal,
  ],

  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  /* =========================
     Services
  ========================= */

  private readonly router =
    inject(Router);

  private readonly dashboardSearch =
    inject(DashboardSearchService);

  private readonly dateRangeService =
    inject(DateRangeService);

  private readonly transactionsService =
    inject(TransactionsService);

  private readonly notificationsService =
    inject(NotificationsService);

  private readonly settingsService =
    inject(SettingsService);

  private readonly authService =
    inject(AuthService);
    private readonly dashboardChartService =
  inject(DashboardChartService);


  /* =========================
     Outputs
  ========================= */

  @Output()
  menuClick =
    new EventEmitter<void>();

  @Output()
  logoutRequested =
    new EventEmitter<void>();

  /* =========================
     Current User
  ========================= */

  readonly user =
    this.authService.user;
readonly dashboardSubtitle =
  computed(() => {
    const cashFlow =
      this.dashboardChartService
        .monthlyCashFlow();

    const now =
      new Date();

    const currentYear =
      now.getFullYear();

    /*
     * ماه API از 1 شروع می‌شود.
     */
    const currentMonth =
      now.getMonth() + 1;

    const previousDate =
      new Date(
        currentYear,
        now.getMonth() - 1,
        1,
      );

    const previousYear =
      previousDate.getFullYear();

    const previousMonth =
      previousDate.getMonth() + 1;

    const currentData =
      cashFlow.find(
        (item) =>
          item.year ===
            currentYear &&
          item.month ===
            currentMonth,
      );

    const previousData =
      cashFlow.find(
        (item) =>
          item.year ===
            previousYear &&
          item.month ===
            previousMonth,
      );

    const currentExpenses =
      currentData?.expenses ?? 0;

    const previousExpenses =
      previousData?.expenses ?? 0;

    /*
     * بدون داده ماه قبل، درصد قابل
     * محاسبه نیست.
     */
    if (previousExpenses <= 0) {
      return {
        key:
          currentExpenses > 0
            ? 'dashboard.header.currentSpending'
            : 'dashboard.header.noActivity',

        params: {
          amount:
            currentExpenses,
        },
      };
    }

    const difference =
      currentExpenses -
      previousExpenses;

    const percentage =
      Math.round(
        Math.abs(
          difference /
            previousExpenses,
        ) * 100,
      );

    if (difference < 0) {
      return {
        key:
          'dashboard.header.spendingLess',

        params: {
          percentage,
        },
      };
    }

    if (difference > 0) {
      return {
        key:
          'dashboard.header.spendingMore',

        params: {
          percentage,
        },
      };
    }

    return {
      key:
        'dashboard.header.spendingEqual',

      params: {},
    };
  });
  readonly userInitial =
    computed(() => {
      const name =
        this.user()?.name.trim();

      return name
        ? name
            .charAt(0)
            .toUpperCase()
        : 'U';
    });

  /* =========================
     Settings
  ========================= */

  readonly currentLang =
    this.settingsService.language;

  readonly appearance =
    this.settingsService.appearance;

  readonly isDarkMode =
    computed(
      () =>
        this.appearance() ===
        'dark',
    );

  /* =========================
     Notifications
  ========================= */

  readonly notifications =
    this.notificationsService.notifications;

  readonly unreadNotifications =
    this.notificationsService.unreadCount;

  readonly headerNotifications =
    computed(
      () =>
        this.notifications()
          .filter(
            (notification) =>
              !notification.isRead,
          )
          .slice(0, 3),
    );

  /* =========================
     UI State
  ========================= */

  readonly searchTerm =
    signal('');

  readonly isDateMenuOpen =
    signal(false);

  readonly isNotificationOpen =
    signal(false);

  readonly isProfileOpen =
    signal(false);

  readonly isTransactionModalOpen =
    signal(false);

  /* =========================
     Icons
  ========================= */

  readonly Menu = Menu;
  readonly Search = Search;
  readonly Plus = Plus;
  readonly Bell = Bell;
  readonly Moon = Moon;
  readonly Sun = Sun;
  readonly ChevronDown = ChevronDown;
  readonly CalendarDays = CalendarDays;
 readonly LogOutIcon =
  LogOutIcon;

  /* =========================
     Outside Click
  ========================= */

  @HostListener('document:click')
  closeMenusOnOutsideClick(): void {
    this.isNotificationOpen.set(
      false,
    );

    this.isProfileOpen.set(
      false,
    );

    this.isDateMenuOpen.set(
      false,
    );
  }

  /* =========================
     Mobile Menu
  ========================= */

  openMenu(): void {
    this.menuClick.emit();
  }

  /* =========================
     Language
  ========================= */

  changeLanguage(): void {
    const nextLanguage:
      'en' | 'fa' =
      this.currentLang() === 'en'
        ? 'fa'
        : 'en';

    this.settingsService.setLanguage(
      nextLanguage,
    );
  }

  /* =========================
     Theme
  ========================= */

  toggleDarkMode(): void {
    const nextAppearance:
      'light' | 'dark' =
      this.isDarkMode()
        ? 'light'
        : 'dark';

    this.settingsService.setAppearance(
      nextAppearance,
    );
  }

  /* =========================
     Transaction Modal
  ========================= */

  openTransactionModal(): void {
    this.isTransactionModalOpen.set(
      true,
    );
  }

  closeTransactionModal(): void {
    this.isTransactionModalOpen.set(
      false,
    );
  }

  onTransactionSaved(
    transaction: TransactionForm,
  ): void {
    if (
      transaction.amount === null
    ) {
      return;
    }

    this.transactionsService
      .addTransaction({
        title:
          transaction.title,

        category:
          transaction.category,

        account:
          transaction.account,

        date:
          transaction.date,

        amount:
          transaction.amount,

        type:
          transaction.type,
      });

    this.closeTransactionModal();
  }

  /* =========================
     Search
  ========================= */

  onSearch(
    event: Event,
  ): void {
    const input =
      event.target as
        HTMLInputElement;

    this.searchTerm.set(
      input.value,
    );

    this.dashboardSearch
      .setSearchTerm(
        input.value,
      );
  }

  /* =========================
     Date Range
  ========================= */

  toggleDateMenu(): void {
    this.isDateMenuOpen.update(
      (value) => !value,
    );
  }

  selectDateRange(
    range: DashboardDateRange,
  ): void {
    this.dateRangeService
      .setRange(range);

    this.isDateMenuOpen.set(
      false,
    );
  }

  getDateRangeLabel(): string {
    const range =
      this.dateRangeService
        .selectedRange();

    switch (range) {
      case 'thisMonth':
        return 'This Month';

      case 'lastMonth':
        return 'Last Month';

      case 'last3Months':
        return 'Last 3 Months';

      case 'thisYear':
        return 'This Year';

      default:
        return 'This Month';
    }
  }

  /* =========================
     Notifications
  ========================= */

  toggleNotifications(): void {
    this.isProfileOpen.set(
      false,
    );

    this.isNotificationOpen.update(
      (value) => !value,
    );
  }

  markNotificationAsRead(
    id: number,
  ): void {
    this.notificationsService
      .markAsRead(id);
  }

  markAllNotificationsAsRead(): void {
    this.notificationsService
      .markAllAsRead();
  }

  openNotificationsPage(): void {
    this.isNotificationOpen.set(
      false,
    );

    this.router.navigate([
      '/notifications',
    ]);
  }

  /* =========================
     Profile
  ========================= */

  toggleProfileMenu(): void {
    this.isNotificationOpen.set(
      false,
    );

    this.isProfileOpen.update(
      (value) => !value,
    );
  }

  openSettings(): void {
    this.isProfileOpen.set(
      false,
    );

    this.router.navigate([
      '/settings',
    ]);
  }

  openPremium(): void {
    this.isProfileOpen.set(
      false,
    );

    this.router.navigate([
      '/premium',
    ]);
  }

  requestLogout(): void {
    this.isProfileOpen.set(
      false,
    );

    this.logoutRequested.emit();
  }
  openProfile(): void {
  this.isProfileOpen.set(false);

  this.router.navigate([
    '/profile',
  ]);
}
}