import {
  Component,
  DestroyRef,
  effect,
  inject,
} from '@angular/core';

import {
  BaseChartDirective,
} from 'ng2-charts';

import {
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';

import {
  ChartConfiguration,
  TooltipItem,
} from 'chart.js';

import {
  takeUntilDestroyed,
} from '@angular/core/rxjs-interop';

import {
  DashboardChartService,
} from '../../services/dashboard-chart.service';

@Component({
  selector: 'app-income-expense-chart',

  standalone: true,

  imports: [
    BaseChartDirective,
    TranslatePipe,
  ],

  templateUrl:
    './income-expense-chart.html',

  styleUrl:
    './income-expense-chart.scss',
})
export class IncomeExpenseChart {

  private readonly dashboardChartService =
    inject(DashboardChartService);

  private readonly translate =
    inject(TranslateService);

  private readonly destroyRef =
    inject(DestroyRef);

  selectedPeriod:
    '3m' | '6m' | '1y' = '6m';

  lineChartData:
    ChartConfiguration<'line'>['data'] = {
      labels: [],
      datasets: [],
    };

  readonly lineChartOptions:
    ChartConfiguration<'line'>['options'] = {
      responsive: true,

      maintainAspectRatio: false,

      interaction: {
        intersect: false,
        mode: 'index',
      },

      plugins: {
        legend: {
          position: 'top',

          labels: {
            usePointStyle: true,
            boxWidth: 8,
            padding: 18,
          },
        },

        tooltip: {
          callbacks: {
            label: (
              context:
                TooltipItem<'line'>,
            ) => {
              const value =
                context.parsed.y ?? 0;

              const formattedValue =
                this.formatNumber(
                  value,
                );

              const currency =
                this.translate.instant(
                  'dashboard.chart.currency',
                );

              return `${
                context.dataset.label ?? ''
              }: ${formattedValue} ${currency}`;
            },
          },
        },
      },

      scales: {
        x: {
          ticks: {
            color: '#94a3b8',
          },

          grid: {
            display: false,
          },

          border: {
            display: false,
          },
        },

        y: {
          beginAtZero: true,

          ticks: {
            color: '#94a3b8',

            callback: (value) =>
              this.formatNumber(
                Number(value),
              ),
          },

          grid: {
            color:
              'rgba(148, 163, 184, 0.15)',
          },

          border: {
            display: false,
          },
        },
      },
    };

  constructor() {
    effect(() => {
      /*
       * با هر تغییر داده API،
       * نمودار دوباره ساخته می‌شود.
       */
      this.dashboardChartService
        .monthlyCashFlow();

      this.updateChartData();
    });

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

  changePeriod(
    period: '3m' | '6m' | '1y',
  ): void {
    this.selectedPeriod =
      period;

    this.updateChartData();
  }

  getSubtitleKey(): string {
    switch (this.selectedPeriod) {
      case '3m':
        return 'dashboard.chart.subtitle3m';

      case '1y':
        return 'dashboard.chart.subtitle1y';

      case '6m':
      default:
        return 'dashboard.chart.subtitle6m';
    }
  }

  private getMonthCount():
    number {
    switch (this.selectedPeriod) {
      case '3m':
        return 3;

      case '1y':
        return 12;

      case '6m':
      default:
        return 6;
    }
  }

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

  private updateChartData():
    void {
    const apiData =
      this.dashboardChartService
        .monthlyCashFlow();

    const monthCount =
      this.getMonthCount();

    /*
     * تمام ماه‌های بازه را تولید می‌کنیم؛
     * حتی اگر تراکنشی نداشته باشند.
     */
    const months =
      Array.from(
        {
          length: monthCount,
        },

        (_, index) => {
          const monthsAgo =
            monthCount - 1 - index;

          const date =
            new Date();

          date.setDate(1);

          date.setMonth(
            date.getMonth() -
              monthsAgo,
          );

          return {
            year:
              date.getFullYear(),

            /*
             * ماه Java و API از 1 شروع می‌شود.
             */
            month:
              date.getMonth() + 1,

            date,
          };
        },
      );

    const locale =
      this.translate.currentLang() ===
      'fa'
        ? 'fa-IR-u-ca-persian'
        : 'en-US';

    const labels =
      months.map((item) =>
        new Intl.DateTimeFormat(
          locale,
          {
            month: 'short',
            year:
              this.selectedPeriod ===
              '1y'
                ? '2-digit'
                : undefined,
          },
        ).format(item.date),
      );

    const incomeData =
      months.map((month) => {
        const item =
          apiData.find(
            (cashFlow) =>
              cashFlow.year ===
                month.year &&
              cashFlow.month ===
                month.month,
          );

        return item?.income ?? 0;
      });

    const expenseData =
      months.map((month) => {
        const item =
          apiData.find(
            (cashFlow) =>
              cashFlow.year ===
                month.year &&
              cashFlow.month ===
                month.month,
          );

        return item?.expenses ?? 0;
      });

    this.lineChartData = {
      labels,

      datasets: [
        {
          label:
            this.translate.instant(
              'dashboard.chart.income',
            ),

          data: incomeData,

          borderColor: '#38a7e8',

          backgroundColor:
            'rgba(56, 167, 232, 0.16)',

          pointBackgroundColor:
            '#38a7e8',

          pointBorderColor:
            '#ffffff',

          pointBorderWidth: 2,

          tension: 0.38,

          borderWidth: 3,

          pointRadius: 4,

          pointHoverRadius: 7,

          fill: false,
        },

        {
          label:
            this.translate.instant(
              'dashboard.chart.expenses',
            ),

          data: expenseData,

          borderColor: '#ff6f91',

          backgroundColor:
            'rgba(255, 111, 145, 0.16)',

          pointBackgroundColor:
            '#ff6f91',

          pointBorderColor:
            '#ffffff',

          pointBorderWidth: 2,

          tension: 0.38,

          borderWidth: 3,

          pointRadius: 4,

          pointHoverRadius: 7,

          fill: false,
        },
      ],
    };
  }
}