import {
  CommonModule,
} from '@angular/common';

import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  TranslatePipe,
} from '@ngx-translate/core';

import {
  LucideAngularModule,
  LucideIconData,

  Plus,
  Target,
  TrendingUp,
  CalendarDays,
  CircleDollarSign,
  MoreHorizontal,

  PiggyBank,
  House,
  CarFront,
  Plane,
  GraduationCap,
  HeartPulse,
  Laptop,
  Gift,
  Gem,
  CircleCheckBig,

  Coins,
  Pencil,
  Trash2,
} from 'lucide-angular';

import {
  AddGoalModal,
  GoalFormValue,
} from '../../../../shared/components/add-goal-modal/add-goal-modal';

import {
  ConfirmDialog,
} from '../../../../shared/components/confirm-dialog/confirm-dialog';

import {
  StateView,
} from '../../../../shared/components/state-view/state-view';

import {
  LocaleNumberPipe,
} from '../../../../shared/pipes/locale-number-pipe';

import {
  ContributeGoalModal,
} from '../../../../shared/components/contribute-goal-modal/contribute-goal-modal';

import {
  FinancialGoal,
  FinancialGoalsService,
} from '../../../dashboard/services/financial-goals.service';

/* =========================
   View Model
========================= */

interface FinancialGoalView {
  id: number;
  title: string;
  category: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
}

/* =========================
   Icon Theme
========================= */

type GoalIconTheme =
  | 'violet'
  | 'blue'
  | 'orange'
  | 'emerald'
  | 'rose'
  | 'cyan'
  | 'amber'
  | 'slate';

@Component({
  selector: 'app-goals',

  standalone: true,

  imports: [
    CommonModule,
    TranslatePipe,
    LucideAngularModule,
    AddGoalModal,
    ContributeGoalModal,
    ConfirmDialog,
    StateView,
    LocaleNumberPipe,
  ],

  templateUrl: './goals.html',
  styleUrl: './goals.scss',
})
export class Goals {

  /* =========================
     Service
  ========================= */

  private readonly financialGoalsService =
    inject(FinancialGoalsService);

  /* =========================
     Icons
  ========================= */

  readonly Plus = Plus;

  readonly Target = Target;

  readonly TrendingUp =
    TrendingUp;

  readonly CalendarDays =
    CalendarDays;

  readonly CircleDollarSign =
    CircleDollarSign;

  readonly MoreHorizontal =
    MoreHorizontal;

  readonly PiggyBank =
    PiggyBank;

  readonly CircleCheckBig =
    CircleCheckBig;

  readonly Coins = Coins;

  readonly Pencil = Pencil;

  readonly Trash2 = Trash2;

  /* =========================
     UI State
  ========================= */

  readonly contributionGoal =
    signal<FinancialGoalView | null>(
      null,
    );

  readonly isAddGoalOpen =
    signal(false);

  readonly isEditGoalOpen =
    signal(false);

  readonly goalToDelete =
    signal<FinancialGoalView | null>(
      null,
    );

  readonly selectedGoal =
    signal<FinancialGoalView | null>(
      null,
    );

  /* =========================
     Goals
  ========================= */

  readonly goals =
    computed<FinancialGoalView[]>(
      () =>
        this.financialGoalsService
          .goals()
          .map(
            (
              goal:
                FinancialGoal,
            ) => ({
              id:
                goal.id,

              title:
                goal.title,

              category:
                goal.category,

              targetAmount:
                goal.targetAmount,

              savedAmount:
                goal.currentAmount,

              deadline:
                goal.deadline ?? '',
            }),
          ),
    );

  /* =========================
     Summary
  ========================= */

  readonly totalTarget =
    computed(() =>
      this.goals().reduce(
        (
          total,
          goal,
        ) =>
          total +
          goal.targetAmount,
        0,
      ),
    );

  readonly totalSaved =
    computed(() =>
      this.goals().reduce(
        (
          total,
          goal,
        ) =>
          total +
          goal.savedAmount,
        0,
      ),
    );

  readonly overallProgress =
    computed(() => {
      const totalTarget =
        this.totalTarget();

      if (totalTarget <= 0) {
        return 0;
      }

      return Math.min(
        100,
        Math.round(
          (
            this.totalSaved() /
            totalTarget
          ) * 100,
        ),
      );
    });

  readonly completedGoals =
    computed(() =>
      this.goals().filter(
        (goal) =>
          goal.savedAmount >=
          goal.targetAmount,
      ).length,
    );

  /* =========================
     Progress
  ========================= */

  getProgress(
    goal: FinancialGoalView,
  ): number {
    if (
      goal.targetAmount <= 0
    ) {
      return 0;
    }

    return Math.min(
      100,
      Math.round(
        (
          goal.savedAmount /
          goal.targetAmount
        ) * 100,
      ),
    );
  }

  getRemaining(
    goal: FinancialGoalView,
  ): number {
    return Math.max(
      0,
      goal.targetAmount -
        goal.savedAmount,
    );
  }

  /* =========================
     Goal Icons
  ========================= */

  getGoalIcon(
    goal: FinancialGoalView,
  ): LucideIconData {
    if (
      goal.savedAmount >=
      goal.targetAmount
    ) {
      return CircleCheckBig;
    }

    const value =
      this.getGoalSearchValue(
        goal,
      );

    if (
      this.hasKeyword(
        value,
        [
          'home',
          'house',
          'apartment',
          'خانه',
          'مسکن',
          'آپارتمان',
        ],
      )
    ) {
      return House;
    }

    if (
      this.hasKeyword(
        value,
        [
          'car',
          'vehicle',
          'خودرو',
          'ماشین',
        ],
      )
    ) {
      return CarFront;
    }

    if (
      this.hasKeyword(
        value,
        [
          'travel',
          'trip',
          'vacation',
          'سفر',
          'مسافرت',
        ],
      )
    ) {
      return Plane;
    }

    if (
      this.hasKeyword(
        value,
        [
          'education',
          'course',
          'university',
          'study',
          'تحصیل',
          'آموزش',
          'دانشگاه',
          'دوره',
        ],
      )
    ) {
      return GraduationCap;
    }

    if (
      this.hasKeyword(
        value,
        [
          'health',
          'medical',
          'emergency',
          'درمان',
          'سلامت',
          'پزشکی',
          'اضطراری',
        ],
      )
    ) {
      return HeartPulse;
    }

    if (
      this.hasKeyword(
        value,
        [
          'technology',
          'laptop',
          'computer',
          'phone',
          'تکنولوژی',
          'لپ تاپ',
          'لپ‌تاپ',
          'کامپیوتر',
          'موبایل',
        ],
      )
    ) {
      return Laptop;
    }

    if (
      this.hasKeyword(
        value,
        [
          'gift',
          'wedding',
          'birthday',
          'هدیه',
          'تولد',
          'عروسی',
        ],
      )
    ) {
      return Gift;
    }

    if (
      this.hasKeyword(
        value,
        [
          'luxury',
          'jewelry',
          'gold',
          'طلا',
          'جواهر',
          'لوکس',
        ],
      )
    ) {
      return Gem;
    }

    if (
      this.hasKeyword(
        value,
        [
          'saving',
          'investment',
          'fund',
          'پس انداز',
          'پس‌انداز',
          'سرمایه',
          'صندوق',
        ],
      )
    ) {
      return PiggyBank;
    }

    return Target;
  }

  getGoalTheme(
    goal: FinancialGoalView,
  ): GoalIconTheme {
    if (
      goal.savedAmount >=
      goal.targetAmount
    ) {
      return 'emerald';
    }

    const value =
      this.getGoalSearchValue(
        goal,
      );

    if (
      this.hasKeyword(
        value,
        [
          'home',
          'house',
          'apartment',
          'خانه',
          'مسکن',
          'آپارتمان',
        ],
      )
    ) {
      return 'violet';
    }

    if (
      this.hasKeyword(
        value,
        [
          'car',
          'vehicle',
          'خودرو',
          'ماشین',
        ],
      )
    ) {
      return 'orange';
    }

    if (
      this.hasKeyword(
        value,
        [
          'travel',
          'trip',
          'vacation',
          'سفر',
          'مسافرت',
        ],
      )
    ) {
      return 'blue';
    }

    if (
      this.hasKeyword(
        value,
        [
          'education',
          'course',
          'university',
          'study',
          'تحصیل',
          'آموزش',
          'دانشگاه',
          'دوره',
        ],
      )
    ) {
      return 'cyan';
    }

    if (
      this.hasKeyword(
        value,
        [
          'health',
          'medical',
          'emergency',
          'درمان',
          'سلامت',
          'پزشکی',
          'اضطراری',
        ],
      )
    ) {
      return 'rose';
    }

    if (
      this.hasKeyword(
        value,
        [
          'technology',
          'laptop',
          'computer',
          'phone',
          'تکنولوژی',
          'لپ تاپ',
          'لپ‌تاپ',
          'کامپیوتر',
          'موبایل',
        ],
      )
    ) {
      return 'slate';
    }

    if (
      this.hasKeyword(
        value,
        [
          'gift',
          'wedding',
          'birthday',
          'gold',
          'jewelry',
          'هدیه',
          'تولد',
          'عروسی',
          'طلا',
          'جواهر',
        ],
      )
    ) {
      return 'amber';
    }

    if (
      this.hasKeyword(
        value,
        [
          'saving',
          'investment',
          'fund',
          'پس انداز',
          'پس‌انداز',
          'سرمایه',
          'صندوق',
        ],
      )
    ) {
      return 'emerald';
    }

    return 'violet';
  }
getGoalColor(
  goal: FinancialGoalView,
): string {
  const theme =
    this.getGoalTheme(goal);

  switch (theme) {
    case 'blue':
      return '#2783d9';

    case 'orange':
      return '#e97832';

    case 'emerald':
      return '#149777';

    case 'rose':
      return '#e04f71';

    case 'cyan':
      return '#138ca2';

    case 'amber':
      return '#c88913';

    case 'slate':
      return '#52647d';

    case 'violet':
    default:
      return '#7158e8';
  }
}
  private getGoalSearchValue(
    goal: FinancialGoalView,
  ): string {
    return [
      goal.title,
      goal.category,
    ]
      .join(' ')
      .trim()
      .toLowerCase();
  }

  private hasKeyword(
    value: string,
    keywords: string[],
  ): boolean {
    return keywords.some(
      (keyword) =>
        value.includes(
          keyword.toLowerCase(),
        ),
    );
  }

  /* =========================
     Add
  ========================= */

  addGoal(): void {
    this.isAddGoalOpen.set(
      true,
    );
  }

  closeAddGoal(): void {
    this.isAddGoalOpen.set(
      false,
    );
  }

  saveGoal(
    form: GoalFormValue,
  ): void {
    this.financialGoalsService
      .addGoal({
        title:
          form.title,

        category:
          form.category,

        targetAmount:
          form.targetAmount,

        savedAmount:
          form.savedAmount,

        deadline:
          form.deadline,
      });

    this.closeAddGoal();
  }

  /* =========================
     Menu
  ========================= */

  openGoalMenu(
    goal: FinancialGoalView,
  ): void {
    const currentGoal =
      this.selectedGoal();

    this.selectedGoal.set(
      currentGoal?.id === goal.id
        ? null
        : goal,
    );
  }

  closeGoalMenu(): void {
    this.selectedGoal.set(
      null,
    );
  }

  /* =========================
     Edit
  ========================= */

  editGoal(
    goal: FinancialGoalView,
  ): void {
    this.selectedGoal.set(
      goal,
    );

    this.isEditGoalOpen.set(
      true,
    );
  }

  closeEditGoal(): void {
    this.isEditGoalOpen.set(
      false,
    );

    this.selectedGoal.set(
      null,
    );
  }

  updateGoal(
    form: GoalFormValue,
  ): void {
    const goal =
      this.selectedGoal();

    if (!goal) {
      return;
    }

    this.financialGoalsService
      .updateGoal(
        goal.id,
        {
          title:
            form.title,

          category:
            form.category,

          targetAmount:
            form.targetAmount,

          savedAmount:
            form.savedAmount,

          deadline:
            form.deadline,
        },
      );

    this.closeEditGoal();
  }

  /* =========================
     Delete
  ========================= */

  requestDelete(
    goal: FinancialGoalView,
  ): void {
    this.goalToDelete.set(
      goal,
    );

    this.selectedGoal.set(
      null,
    );
  }

  cancelDelete(): void {
    this.goalToDelete.set(
      null,
    );
  }

  confirmDelete(): void {
    const goal =
      this.goalToDelete();

    if (!goal) {
      return;
    }

    this.financialGoalsService
      .deleteGoal(
        goal.id,
      );

    this.goalToDelete.set(
      null,
    );

    this.selectedGoal.set(
      null,
    );
  }

  /* =========================
     Contribution
  ========================= */

  openContribution(
    goal: FinancialGoalView,
  ): void {
    this.contributionGoal.set(
      goal,
    );

    this.selectedGoal.set(
      null,
    );
  }

  closeContribution(): void {
    this.contributionGoal.set(
      null,
    );
  }

  contributeToGoal(
    amount: number,
  ): void {
    const goal =
      this.contributionGoal();

    if (!goal) {
      return;
    }

    if (amount <= 0) {
      return;
    }

    const remainingAmount =
      this.getRemaining(goal);

    if (
      amount >
      remainingAmount
    ) {
      return;
    }

    this.financialGoalsService
      .contributeToGoal(
        goal.id,
        amount,
      );

    this.closeContribution();
  }
}