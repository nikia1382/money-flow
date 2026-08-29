import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { LucideAngularModule, CalendarDays } from 'lucide-angular';

import { TranslatePipe } from '@ngx-translate/core';
import { MonthOption } from './month-option.model';

@Component({
  selector: 'app-month-selector',

  imports: [FormsModule, LucideAngularModule, TranslatePipe],

  templateUrl: './month-selector.html',
  styleUrl: './month-selector.scss',
})
export class MonthSelector {
  @Input({
    required: true,
  })
  value!: string;

  @Input()
  months: MonthOption[] = [];

  @Output()
  valueChange = new EventEmitter<string>();

  readonly CalendarDays = CalendarDays;

  onMonthChange(month: string): void {
    this.valueChange.emit(month);
  }
}
