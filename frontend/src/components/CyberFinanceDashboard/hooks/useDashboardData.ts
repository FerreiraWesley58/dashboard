import { useEffect, useState } from 'react';
import { CreditCard, TrendingUp, Target, Zap, Settings, DollarSign, Home, ShoppingBag, Coffee, Gamepad2, Heart, Smartphone, Book, Plane, Shield, Car } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { Transaction, Recurrence, Goal } from '../types';

interface Category {
  name: string;
  amount: number;
  budget: number;
  icon: LucideIcon;
  color: string;
}

interface MenuItem {
  id: string;
  name: string;
  icon: LucideIcon;
}

const API_URL = 'http://localhost:5000/api';

export const useDashboardData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [recurrences, setRecurrences] = useState<Recurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Novos estados para períodos e dados de comparação
  const [comparisonPeriod, setComparisonPeriod] = useState('2024');
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [availablePeriods, setAvailablePeriods] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Usuário não autenticado');
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/transactions`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_URL}/categories`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_URL}/goals`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_URL}/recurrences`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ])
      .then(([transactionsData, categoriesData, goalsData, recurrencesData]) => {
        setTransactions(transactionsData);
        setCategories(categoriesData);
        setGoals(goalsData);
        setRecurrences(recurrencesData);
        // Gerar períodos disponíveis (anos)
        const years = Array.from(new Set(transactionsData.map((t: any) => new Date(t.date).getFullYear().toString()))) as string[];
        setAvailablePeriods(years);
        setComparisonPeriod(years[0] || '');
      })
      .catch(() => {
        setError('Erro ao buscar dados do backend');
        setLoading(false);
      });
  }, []);

  // Gerar dados de comparação mês a mês para o período selecionado
  useEffect(() => {
    if (!transactions.length || !comparisonPeriod) return;
    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    const data = months.map((month, idx) => {
      const monthNum = idx + 1;
      const filtered = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getFullYear().toString() === comparisonPeriod && d.getMonth() + 1 === monthNum;
      });
      const income = filtered.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      const expense = filtered.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
      return { period: month, income, expense };
    });
    setComparisonData(data);
  }, [transactions, comparisonPeriod]);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
    { id: 'transactions', name: 'Transações', icon: CreditCard },
    { id: 'budget', name: 'Orçamento', icon: Target },
    { id: 'goals', name: 'Metas', icon: Zap },
    { id: 'settings', name: 'Configurações', icon: Settings },
  ];

  return {
    transactions,
    categories,
    goals,
    recurrences,
    menuItems,
    loading,
    error,
    comparisonData,
    availablePeriods,
    comparisonPeriod,
    setComparisonPeriod,
  };
}; 