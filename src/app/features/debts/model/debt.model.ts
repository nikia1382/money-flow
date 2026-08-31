export type DebtType = 'i-owe' | 'owed-to-me';

export type DebtStatus = 'active' | 'paid' | 'overdue';

export interface Debt {
  id: number;

  personName: string;

  type: DebtType;

  totalAmount: number;

  paidAmount: number;

  dueDate: string;

  status: DebtStatus;

  note?: string;
}
