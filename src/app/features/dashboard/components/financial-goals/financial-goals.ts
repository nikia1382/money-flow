import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { LucideAngularModule, Target, Plane, Car, ShieldCheck } from 'lucide-angular';

interface FinancialGoal {
  id: number;
  titleKey: string;
  current: number;
  target: number;
  icon: any;
  iconClass: string;
}

@Component({
  selector: 'app-financial-goals',
  imports: [TranslatePipe, LucideAngularModule],
  templateUrl: './financial-goals.html',
  styleUrl: './financial-goals.scss',
})
export class FinancialGoals {
  readonly goals: FinancialGoal[] = [
    {
      id: 1,
      titleKey: 'dashboard.goals.emergencyFund',
      current: 24_000_000,
      target: 40_000_000,
      icon: ShieldCheck,
      iconClass: 'emergency',
    },
    {
      id: 2,
      titleKey: 'dashboard.goals.travel',
      current: 18_000_000,
      target: 30_000_000,
      icon: Plane,
      iconClass: 'travel',
    },
    {
      id: 3,
      titleKey: 'dashboard.goals.car',
      current: 75_000_000,
      target: 200_000_000,
      icon: Car,
      iconClass: 'car',
    },
  ];

  getPercentage(current: number, target: number): number {
    if (target <= 0) {
      return 0;
    }

    return Math.min(Math.round((current / target) * 100), 100);
  }
}
