import {
  Component,
  Input
} from '@angular/core';

import {
  TranslatePipe
} from '@ngx-translate/core';

import {
  DataTableColumn
} from './data-table.model';


@Component({
  selector: 'app-data-table',

  imports: [
    TranslatePipe
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

    return row[column.key];

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

}