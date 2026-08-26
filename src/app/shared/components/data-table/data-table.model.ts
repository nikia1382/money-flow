export type DataTableColumnType =
  | 'text'
  | 'currency'
  | 'date'
  | 'badge';


export interface DataTableColumn<T> {
  key: keyof T;

  labelKey: string;

  type?: DataTableColumnType;

  width?: string;

  align?:
    | 'start'
    | 'center'
    | 'end';

  valueKeyPrefix?: string;
}