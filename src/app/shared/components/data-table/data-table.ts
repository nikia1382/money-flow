import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

import {
  LucideAngularModule,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-angular';

import {
  TranslatePipe,
} from '@ngx-translate/core';

import {
  DataTableColumn,
} from './data-table.model';

import {
  LocaleNumberPipe,
} from '../../pipes/locale-number-pipe';

import {
  LocaleDatePipe,
} from '../../pipes/locale-date-pipe';

@Component({
  selector: 'app-data-table',

  imports: [
    TranslatePipe,
    LucideAngularModule,
    LocaleNumberPipe,
    LocaleDatePipe,
  ],

  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTable<T extends object> {
  @Input({ required: true })
  columns: DataTableColumn<T>[] = [];

  @Input({ required: true })
  rows: T[] = [];

  @Input()
  emptyTitleKey =
    'common.table.emptyTitle';

  @Input()
  emptySubtitleKey =
    'common.table.emptySubtitle';

  @Output()
  editRow =
    new EventEmitter<T>();

  @Output()
  deleteRow =
    new EventEmitter<T>();

  readonly MoreHorizontal =
    MoreHorizontal;

  readonly Pencil =
    Pencil;

  readonly Trash2 =
    Trash2;

  openedMenuIndex:
    number | null = null;

  @HostListener('document:click')
  closeMenu(): void {
    this.openedMenuIndex = null;
  }

  get gridTemplateColumns(): string {
    return this.columns
      .map(
        (column) =>
          column.width ?? '1fr',
      )
      .join(' ');
  }

  getCellValue(
    row: T,
    column: DataTableColumn<T>,
  ): unknown {
    if (
      column.key === 'actions'
    ) {
      return null;
    }

    return row[column.key];
  }

  getDisplayValueKey(
    column: DataTableColumn<T>,
    value: unknown,
  ): string {
    if (
      typeof value !== 'string'
    ) {
      return '';
    }

    /*
      اگر value خودش full translation key باشد:
      recurringPayments.items.homeRent.title
    */
    if (value.includes('.')) {
      return value;
    }

    /*
      اگر value کوتاه باشد:
      active
      monthly
      Food
    */
    if (
      column.valueKeyPrefix
    ) {
      return `${column.valueKeyPrefix}.${value}`;
    }

    return '';
  }

  isNumber(
    value: unknown,
  ): value is number {
    return typeof value === 'number';
  }

  isString(
    value: unknown,
  ): value is string {
    return typeof value === 'string';
  }

  toggleActions(
    index: number,
    event: Event,
  ): void {
    event.stopPropagation();

    this.openedMenuIndex =
      this.openedMenuIndex === index
        ? null
        : index;
  }

  edit(
    row: T,
  ): void {
    this.editRow.emit(row);

    this.openedMenuIndex = null;
  }

  delete(
    row: T,
  ): void {
    this.deleteRow.emit(row);

    this.openedMenuIndex = null;
  }
}