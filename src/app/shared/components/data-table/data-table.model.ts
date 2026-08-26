export type DataTableColumnType =
  | 'text'
  | 'currency'
  | 'date'
  | 'badge'
  | 'actions';


export interface DataTableColumn<T> {
  key: keyof T | 'actions';

  labelKey: string;

  type?: DataTableColumnType;

  width?: string;

  align?:
    | 'start'
    | 'center'
    | 'end';

  valueKeyPrefix?: string;
}