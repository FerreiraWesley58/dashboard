import { LucideIcon } from 'lucide-react';

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  category: string;
  isFuture?: boolean;
}

export interface Category {
  id: number;
  name: string;
  amount: number;
  color: string;
  icon?: LucideIcon;
}

export interface Goal {
  id: number;
  name: string;
  current: number;
  target: number;
  category: string;
  status?: 'active' | 'completed' | 'paused';
  priority?: number; // 1 = baixa, 2 = média, 3 = alta
}

export interface MenuItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface Recurrence {
  id: number;
  userId: number;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  startDate: string;
  endDate?: string;
  frequency: 'monthly' | 'weekly' | 'yearly' | 'custom';
  active: boolean;
}

export interface ProjectedBalance {
  month: string;
  balance: number;
} 