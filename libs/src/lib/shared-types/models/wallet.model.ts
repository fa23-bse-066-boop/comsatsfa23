export type TransactionType = 'Credit' | 'Debit';

export interface WalletTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  balanceAfter: number;
  referenceId?: string;
  createdAt: string;
}
