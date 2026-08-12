import { Component } from '@angular/core';
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
  CalendarClock
} from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    LucideAngularModule,
    TranslatePipe
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  readonly LayoutDashboard = LayoutDashboard;
  readonly WalletCards = WalletCards;
  readonly ArrowLeftRight = ArrowLeftRight;
  readonly ChartPie = ChartPie;
  readonly CalendarClock = CalendarClock;
  readonly HandCoins = HandCoins;
  readonly Target = Target;
  readonly ChartNoAxesCombined = ChartNoAxesCombined;
  readonly Settings = Settings;
}