import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';

import { TranslatePipe } from '@ngx-translate/core';

import {
  LucideAngularModule,
  LayoutDashboard,
  WalletCards,
  ArrowLeftRight,
  ChartPie,
  ChartNoAxesCombined,
  Settings,
  Target,
  HandCoins,
  CalendarClock,
  Bell,
  CircleHelp,
  Crown,
  ChevronRight,
} from 'lucide-angular';

@Component({
  selector: 'app-sidebar',

  imports: [RouterLink, RouterLinkActive, TranslatePipe, LucideAngularModule],

  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  @Input()
  isOpen = false;

  @Output()
  closeSidebar = new EventEmitter<void>();

  @HostBinding('class.sidebar-host--open')
  get opened(): boolean {
    return this.isOpen;
  }

  readonly LayoutDashboard = LayoutDashboard;
  readonly WalletCards = WalletCards;
  readonly ArrowLeftRight = ArrowLeftRight;
  readonly ChartPie = ChartPie;
  readonly ChartNoAxesCombined = ChartNoAxesCombined;
  readonly Settings = Settings;
  readonly Target = Target;
  readonly HandCoins = HandCoins;
  readonly CalendarClock = CalendarClock;
  readonly Bell = Bell;
  readonly CircleHelp = CircleHelp;
  readonly Crown = Crown;
  readonly ChevronRight = ChevronRight;

  close(): void {
    this.closeSidebar.emit();
  }
}
