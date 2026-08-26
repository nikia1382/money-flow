import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import {
  LucideAngularModule,
  MoreHorizontal,
  Pencil,
  Trash2
} from 'lucide-angular';

import {
  TranslatePipe
} from '@ngx-translate/core';

import {
  DataTableColumn
} from './data-table.model';


@Component({
  selector: 'app-data-table',

  imports: [
    TranslatePipe,
    LucideAngularModule
  ],

  templateUrl: './data-table.html',
  styleUrl: './data-table.scss'
})
export class DataTable<T extends object> {

  @Input({
    required: true
  })
  columns: DataTableColumn<T>[] = [];


  @Input({
    required: true
  })
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


  get gridTemplateColumns(): string {

    return this.columns
      .map(
        column =>
          column.width ?? '1fr'
      )
      .join(' ');

  }


  getCellValue(
    row: T,
    column: DataTableColumn<T>
  ): unknown {

    if (
      column.key === 'actions'
    ) {
      return null;
    }

    return row[column.key];

  }


  getTranslatedValueKey(
    column: DataTableColumn<T>,
    value: unknown
  ): string {

    if (
      !column.valueKeyPrefix ||
      typeof value !== 'string'
    ) {
      return '';
    }

    return (
      column.valueKeyPrefix +
      '.' +
      value
    );

  }


  isNumber(
    value: unknown
  ): value is number {

    return typeof value === 'number';

  }


  isString(
    value: unknown
  ): value is string {

    return typeof value === 'string';

  }




toggleActions(
  index: number
): void {

  console.log(
    'MENU CLICKED:',
    index
  );

  this.openedMenuIndex =
    this.openedMenuIndex === index
      ? null
      : index;

  console.log(
    'OPENED MENU INDEX:',
    this.openedMenuIndex
  );

}

  edit(
    row: T
  ): void {

    this.editRow.emit(row);

    this.openedMenuIndex =
      null;

  }


  delete(
    row: T
  ): void {

    this.deleteRow.emit(row);

    this.openedMenuIndex =
      null;

  }

}