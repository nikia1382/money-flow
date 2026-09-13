import { Component, EventEmitter, HostListener, Output, inject, signal } from '@angular/core';
import { AddTransactionModal, TransactionForm } from '../../shared/components/add-transaction-modal/add-transaction-modal';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

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
} from 'lucide-angular';
import { DateRangeService, DashboardDateRange } from '../../core/services/date-range.service';
import { DashboardSearchService } from '../../core/services/dashboard-search.service';
import { TransactionsService } from '../../features/transactions/services/transactions';

@Component({
  selector: 'app-header',

  imports: [LucideAngularModule, TranslatePipe, AddTransactionModal],

  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly translate = inject(TranslateService);
  private readonly dashboardSearch = inject(DashboardSearchService);
  private readonly dateRangeService = inject(DateRangeService);
  private readonly transactionsService =
  inject(TransactionsService);
  @Output()
  menuClick = new EventEmitter<void>();

  @HostListener('document:click')
  closeMenusOnOutsideClick(): void {
    this.isNotificationOpen.set(false);
    this.isProfileOpen.set(false);
  }
  currentLang = 'en';

  readonly isDarkMode = signal(false);

  readonly searchTerm = signal('');

  readonly isDateMenuOpen = signal(false);

  readonly selectedDateRange = signal('This Month');

  readonly isNotificationOpen = signal(false);

  readonly isProfileOpen = signal(false);

  readonly Menu = Menu;
  readonly Search = Search;
  readonly Plus = Plus;
  readonly Bell = Bell;
  readonly Moon = Moon;
  readonly Sun = Sun;
  readonly ChevronDown = ChevronDown;
  readonly CalendarDays = CalendarDays;

  constructor() {
    const savedTheme = localStorage.getItem('theme');

    const shouldUseDark = savedTheme === 'dark';

    this.isDarkMode.set(shouldUseDark);

    document.documentElement.classList.toggle('dark', shouldUseDark);
  }

  openMenu(): void {
    this.menuClick.emit();
  }

  changeLanguage(): void {
    this.currentLang = this.currentLang === 'en' ? 'fa' : 'en';

    this.translate.use(this.currentLang);

    document.documentElement.lang = this.currentLang;

    document.documentElement.dir = this.currentLang === 'fa' ? 'rtl' : 'ltr';
  }

  toggleDarkMode(): void {
    const nextMode = !this.isDarkMode();

    this.isDarkMode.set(nextMode);

    document.documentElement.classList.toggle('dark', nextMode);

    localStorage.setItem('theme', nextMode ? 'dark' : 'light');
  }

  readonly isTransactionModalOpen = signal(false);

  openTransactionModal(): void {
    this.isTransactionModalOpen.set(true);
  }

  closeTransactionModal(): void {
    this.isTransactionModalOpen.set(false);
  }

onTransactionSaved(transaction: TransactionForm): void {
  if (transaction.amount === null) {
    return;
  }

  this.transactionsService.addTransaction({
    title: transaction.title,
    category: transaction.category,
    account: transaction.account,
    date: transaction.date,
    amount: transaction.amount,
    type: transaction.type,
  });

  this.closeTransactionModal();
}
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.searchTerm.set(input.value);

    this.dashboardSearch.setSearchTerm(input.value);
  }
  toggleDateMenu(): void {
    this.isDateMenuOpen.update((value) => !value);
  }

  /* selectDateRange(range: string): void {
  this.selectedDateRange.set(range);
  this.isDateMenuOpen.set(false);
} */
  selectDateRange(range: DashboardDateRange): void {
    this.dateRangeService.setRange(range);

    this.isDateMenuOpen.set(false);
  }
  getDateRangeLabel(): string {
    const range = this.dateRangeService.selectedRange();

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
  toggleNotifications(): void {
    this.isProfileOpen.set(false);

    this.isNotificationOpen.update((value) => !value);
  }

  toggleProfileMenu(): void {
    this.isNotificationOpen.set(false);

    this.isProfileOpen.update((value) => !value);
  }
}
