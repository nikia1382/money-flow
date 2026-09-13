import { Component, DestroyRef, effect, inject } from '@angular/core';

import { BaseChartDirective } from 'ng2-charts';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ChartConfiguration, TooltipItem } from 'chart.js';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardChartService } from '../../services/dashboard-chart.service';

@Component({
  selector: 'app-income-expense-chart',

  standalone: true,

  imports: [BaseChartDirective, TranslatePipe],

  templateUrl: './income-expense-chart.html',
  styleUrl: './income-expense-chart.scss',
})
export class IncomeExpenseChart {
  /* =========================
     Services
  ========================= */
private readonly DashboardChartService =
  inject(DashboardChartService);
  private readonly translate = inject(TranslateService);

  private readonly destroyRef = inject(DestroyRef);

  /* =========================
     Selected Period
  ========================= */

  selectedPeriod: '3m' | '6m' | '1y' = '6m';

  /* =========================
     Chart Data
  ========================= */

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],

    datasets: [],
  };

  /* =========================
     Chart Options
  ========================= */

  readonly lineChartOptions: ChartConfiguration<'line'>['options'] = {
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
        },
      },

      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'line'>) => {
            const value = context.parsed.y ?? 0;

            const formattedValue = this.formatNumber(value);

            const currency = this.translate.instant('dashboard.chart.currency');

            return `${context.dataset.label ?? ''}: ${formattedValue} ${currency}`;
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
        ticks: {
          color: '#94a3b8',

          callback: (value) => this.formatNumber(Number(value)),
        },

        grid: {
          color: 'rgba(148, 163, 184, 0.15)',
        },

        border: {
          display: false,
        },
      },
    },
  };

  /* =========================
     Constructor
  ========================= */
constructor() {
  effect(() => {
    this.DashboardChartService.monthlyCashFlow();

    this.updateChartData();
  });

  this.translate.onLangChange
    .pipe(
      takeUntilDestroyed(this.destroyRef),
    )
    .subscribe(() => {
      this.updateChartData();
    });
}


  /* =========================
     Change Period
  ========================= */

  changePeriod(period: '3m' | '6m' | '1y'): void {
    this.selectedPeriod = period;

    this.updateChartData();
  }

  /* =========================
     Number Formatter
  ========================= */

private formatNumber(
  value: number
): string {
  const locale =
    this.translate.currentLang() === 'fa'
      ? 'fa-IR-u-nu-arabext'
      : 'en-US';

  return new Intl.NumberFormat(
    locale
  ).format(value);
}

  /* =========================
     Update Chart
  ========================= */

private updateChartData(): void {
  const data =
    this.DashboardChartService
      .monthlyCashFlow();

  let count = 6;

  if (
    this.selectedPeriod === '3m'
  ) {
    count = 3;
  }

  if (
    this.selectedPeriod === '1y'
  ) {
    count = 12;
  }

  const visibleData =
    data.slice(-count);

  const locale =
    this.translate.currentLang() ===
    'fa'
      ? 'fa-IR-u-ca-persian'
      : 'en-US';

  const labels =
    visibleData.map((item) => {
      const date = new Date(
        item.year,
        item.month,
        1,
      );

      return new Intl.DateTimeFormat(
        locale,
        {
          month: 'short',
        },
      ).format(date);
    });

  this.lineChartData = {
    labels,

    datasets: [
      {
        label:
          this.translate.instant(
            'dashboard.chart.income',
          ),

        data:
          visibleData.map(
            (item) =>
              item.income,
          ),

        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
      },

      {
        label:
          this.translate.instant(
            'dashboard.chart.expenses',
          ),

        data:
          visibleData.map(
            (item) =>
              item.expenses,
          ),

        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };
}
}
