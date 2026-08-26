export type AccountType =
  | 'bank'
  | 'cash'
  | 'savings';

export interface Account {
  id: number;
  name: string;
  type: AccountType;
  balance: number;
  number?: string;
}