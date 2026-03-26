/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string; // ISO string
  attachmentUrl?: string;
}

export type GoalStatus = 'ACTIVE' | 'ACHIEVED' | 'PAUSED';

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO string
  icon: string;
  color: string;
  status: GoalStatus;
}

export type Recurrence = 'MONTHLY' | 'WEEKLY' | 'YEARLY';

export interface Bill {
  id: string;
  userId: string;
  name: string;
  amount: number;
  dueDate: string; // ISO string
  recurrence: Recurrence;
  category: string;
  reminderDays: number;
  isPaid: boolean;
  paidAt?: string; // ISO string
}

export type BudgetPeriod = 'MONTHLY' | 'WEEKLY';

export interface Budget {
  id: string;
  userId: string;
  category: string;
  limitAmount: number;
  period: BudgetPeriod;
  alertThreshold: number; // e.g., 0.8 for 80%
}

export interface MonthlyRecap {
  id: string;
  userId: string;
  month: number; // 1-12
  year: number;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  topCategory: string;
  topSpend: number;
  aiSummary?: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  currency: string; // default "IDR"
  createdAt: string;
  updatedAt: string;
}
