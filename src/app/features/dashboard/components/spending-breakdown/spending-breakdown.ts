import { Component, DestroyRef, inject } from '@angular/core';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { BaseChartDirective } from 'ng2-charts';

import { ChartConfiguration, TooltipItem } from 'chart.js';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-spending-breakdown',

  imports: [BaseChartDirective, TranslatePipe, DecimalPipe],

  templateUrl: './spending-breakdown.html',
  styleUrl: './spending-breakdown.scss',
})
export class SpendingBreakdown {
  private readonly translate = inject(TranslateService);

  private readonly destroyRef = inject(DestroyRef);

  chartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [],
  };

  readonly chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,

    maintainAspectRatio: false,

    cutout: '68%',

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'doughnut'>) => {
            const value = Number(context.raw ?? 0);

            const currency = this.translate.instant('dashboard.chart.currency');

            return `${context.label}: ${value.toLocaleString()} ${currency}`;
          },
        },
      },
    },
  };

  constructor() {
    this.updateTranslations();

    this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.updateTranslations();
    });
  }

  private updateTranslations(): void {
    this.chartData = {
      labels: [
        this.translate.instant('dashboard.spending.food'),

        this.translate.instant('dashboard.spending.housing'),

        this.translate.instant('dashboard.spending.transport'),

        this.translate.instant('dashboard.spending.shopping'),

        this.translate.instant('dashboard.spending.other'),
      ],

      datasets: [
        {
          data: [6_000_000, 5_000_000, 3_000_000, 2_000_000, 4_000_000],

          borderWidth: 0,

          hoverOffset: 5,
        },
      ],
    };
  }
}
