export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: number;
  title: string;
  category: string;
  account: string;
  date: string;
  amount: number;
  type: TransactionType;
  description?: string;
}
