export type RecurringPaymentFrequency = 'weekly' | 'monthly' | 'yearly';

export type RecurringPaymentStatus = 'active' | 'dueSoon' | 'overdue';

export interface RecurringPayment {
  id: number;

  title: string;

  category: string;

  amount: number;

  account: string;

  frequency: RecurringPaymentFrequency;

  nextPaymentDate: string;

  status: RecurringPaymentStatus;
}
