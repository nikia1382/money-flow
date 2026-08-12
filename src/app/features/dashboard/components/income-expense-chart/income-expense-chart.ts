import {
  Component,
  DestroyRef,
  inject
} from '@angular/core';

import { BaseChartDirective } from 'ng2-charts';
import {
  TranslatePipe,
  TranslateService
} from '@ngx-translate/core';

import {
  ChartConfiguration,
  TooltipItem
} from 'chart.js';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-income-expense-chart',

  imports: [
    BaseChartDirective,
    TranslatePipe
  ],

  templateUrl: './income-expense-chart.html',
  styleUrl: './income-expense-chart.scss'
})
export class IncomeExpenseChart {

  private readonly translate = inject(TranslateService);

  private readonly destroyRef = inject(DestroyRef);

selectedPeriod: '3m' | '6m' | '1y' = '6m';
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],

    datasets: []
  };


  readonly lineChartOptions: ChartConfiguration<'line'>['options'] = {

    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      intersect: false,
      mode: 'index'
    },

    plugins: {

      legend: {
        position: 'top',

        labels: {
          usePointStyle: true,
          boxWidth: 8
        }
      },

      tooltip: {

        callbacks: {

          label: (context: TooltipItem<'line'>) => {

            const value = context.parsed.y ?? 0;

            const currency =
              this.translate.instant(
                'dashboard.chart.currency'
              );

            return `${context.dataset.label}: ${value.toLocaleString()} ${currency}`;
          }

        }

      }

    },


    scales: {

      x: {
        grid: {
          display: false
        }
      },

      y: {

        beginAtZero: true,

        ticks: {

          callback: (value) => {

            const numberValue = Number(value);

            return `${numberValue / 1_000_000}M`;

          }

        }

      }

    }

  };


  constructor() {

    this.updateChartTranslations();


    this.translate.onLangChange
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {

        this.updateChartTranslations();

      });

  }


private updateChartTranslations(): void {

  const isPersian =
    this.translate.currentLang() === 'fa';

  const allLabelsEn = [
    'Sep', 'Oct', 'Nov', 'Dec',
    'Jan', 'Feb', 'Mar', 'Apr',
    'May', 'Jun', 'Jul', 'Aug'
  ];

  const allLabelsFa = [
    'شهریور', 'مهر', 'آبان', 'آذر',
    'دی', 'بهمن', 'اسفند', 'فروردین',
    'اردیبهشت', 'خرداد', 'تیر', 'مرداد'
  ];

  const incomeData = [
    25_000_000,
    27_000_000,
    26_000_000,
    29_000_000,
    30_000_000,
    31_000_000,
    28_000_000,
    32_000_000,
    30_000_000,
    34_000_000,
    33_000_000,
    35_000_000
  ];

  const expenseData = [
    16_000_000,
    17_000_000,
    18_000_000,
    20_000_000,
    19_000_000,
    20_500_000,
    18_000_000,
    21_000_000,
    19_000_000,
    24_000_000,
    22_000_000,
    21_300_000
  ];

  let count = 6;

  if (this.selectedPeriod === '3m') {
    count = 3;
  }

  if (this.selectedPeriod === '1y') {
    count = 12;
  }

  const labels =
    (isPersian ? allLabelsFa : allLabelsEn)
      .slice(-count);

  const incomes =
    incomeData.slice(-count);

  const expenses =
    expenseData.slice(-count);

  this.lineChartData = {
    labels,

    datasets: [
      {
        label:
          this.translate.instant(
            'dashboard.chart.income'
          ),

        data: incomes,

        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6
      },

      {
        label:
          this.translate.instant(
            'dashboard.chart.expenses'
          ),

        data: expenses,

        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6
      }
    ]
  };
}
changePeriod(period: '3m' | '6m' | '1y'): void {
  this.selectedPeriod = period;
  this.updateChartTranslations();
}
}