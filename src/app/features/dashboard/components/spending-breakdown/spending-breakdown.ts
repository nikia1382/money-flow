import {
  Component,
  DestroyRef,
  effect,
  inject,
} from '@angular/core';

import {
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';

import {
  BaseChartDirective,
} from 'ng2-charts';

import {
  ChartConfiguration,
  TooltipItem,
} from 'chart.js';

import {
  takeUntilDestroyed,
} from '@angular/core/rxjs-interop';

import {
  LocaleNumberPipe,
} from '../../../../shared/pipes/locale-number-pipe';

import {
  DashboardSpendingService,
} from '../../services/dashboard-spending.service';

@Component({
  selector: 'app-spending-breakdown',

  imports: [
    BaseChartDirective,
    TranslatePipe,
    LocaleNumberPipe,
  ],

  templateUrl:
    './spending-breakdown.html',

  styleUrl:
    './spending-breakdown.scss',
})
export class SpendingBreakdown {
  /* =========================
     Services
  ========================= */

  private readonly translate =
    inject(TranslateService);

  private readonly destroyRef =
    inject(DestroyRef);

  private readonly spendingService =
    inject(DashboardSpendingService);

  /* =========================
     Data
  ========================= */

  readonly totalSpending =
    this.spendingService.totalSpending;

  chartData:
    ChartConfiguration<'doughnut'>['data'] =
    {
      labels: [],
      datasets: [],
    };

  /* =========================
     Chart Options
  ========================= */

  readonly chartOptions:
    ChartConfiguration<'doughnut'>['options'] =
    {
      responsive: true,

      maintainAspectRatio: false,

      cutout: '68%',

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          callbacks: {
            label: (
              context:
                TooltipItem<'doughnut'>,
            ) => {
              const value =
                Number(
                  context.raw ?? 0,
                );

              const formattedValue =
                this.formatNumber(
                  value,
                );

              const currency =
                this.translate.instant(
                  'common.currency',
                );

              return `${
                context.label ?? ''
              }: ${formattedValue} ${currency}`;
            },
          },
        },
      },
    };

  /* =========================
     Constructor
  ========================= */

  constructor() {
    /*
      وقتی تراکنش‌های واقعی تغییر کنند،
      نمودار دوباره ساخته می‌شود.
    */

    effect(() => {
      this.spendingService
        .categoryTotals();

      this.updateChartData();
    });

    /*
      وقتی زبان تغییر کند،
      labelهای نمودار ترجمه می‌شوند.
    */

    this.translate.onLangChange
      .pipe(
        takeUntilDestroyed(
          this.destroyRef,
        ),
      )
      .subscribe(() => {
        this.updateChartData();
      });
  }

  /* =========================
     Chart Data
  ========================= */

  private updateChartData(): void {
    const categories =
      this.spendingService
        .categoryTotals();

    this.chartData = {
      labels: categories.map(
        (item) =>
          this.getCategoryLabel(
            item.category,
          ),
      ),

      datasets: [
        {
          data: categories.map(
            (item) => item.amount,
          ),

          borderWidth: 0,

          hoverOffset: 5,
        },
      ],
    };
  }

  /* =========================
     Category Translation
  ========================= */

  private getCategoryLabel(
    category: string,
  ): string {
    const key =
      `transactions.categories.${category}`;

    const translated =
      this.translate.instant(key);

    return translated === key
      ? category
      : translated;
  }

  /* =========================
     Number Formatter
  ========================= */

  private formatNumber(
    value: number,
  ): string {
    const locale =
      this.translate.currentLang() ===
      'fa'
        ? 'fa-IR-u-nu-arabext'
        : 'en-US';

    return new Intl.NumberFormat(
      locale,
    ).format(value);
  }
}