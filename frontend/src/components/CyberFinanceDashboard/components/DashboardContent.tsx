import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Target, Zap } from 'lucide-react';
import { StatCard } from './StatCard';
import { TransactionItem } from './TransactionItem';
import { Transaction, Category, Recurrence, Goal } from '../types';
import { BarChartCard } from './BarChartCard';
import LineChartCard from './LineChartCard';
import { GoalsProgressCard } from './GoalsProgressCard';
import { PieChartCard } from './PieChartCard';
import CalendarCard from './CalendarCard';

interface DashboardContentProps {
  transactions: Transaction[];
  categories: Category[];
  goals: Goal[];
  dailyIncomes: { day: string; amount: number; }[];
  comparisonData: any[];
  availablePeriods: string[];
  comparisonPeriod: string;
  setComparisonPeriod: (period: string) => void;
  recurrences: Recurrence[];
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ 
  transactions, 
  categories,
  goals,
  dailyIncomes,
  comparisonData,
  availablePeriods,
  comparisonPeriod,
  setComparisonPeriod,
  recurrences
}) => {
  // Cálculos dinâmicos
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const receitaMensal = transactions
    .filter(t => t.type === 'income' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
    .reduce((acc, t) => acc + t.amount, 0);
  const despesasMensais = transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
    .reduce((acc, t) => acc + t.amount, 0);
  const saldoTotal = transactions.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0);
  const economias = receitaMensal - despesasMensais;

  return (
    <div className="space-y-12">
      {/* Grid de Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Saldo Total" 
          value={`R$ ${saldoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          change={0} 
          icon={DollarSign}
          color="from-cyan-500 to-blue-500"
          small
        />
        <StatCard 
          title="Receita Mensal" 
          value={`R$ ${receitaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          change={0} 
          icon={TrendingUp}
          color="from-green-500 to-emerald-500"
          small
        />
        <StatCard 
          title="Despesas Mensais" 
          value={`R$ ${despesasMensais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          change={0} 
          icon={TrendingDown}
          color="from-red-500 to-pink-500"
          small
        />
        <StatCard 
          title="Economias" 
          value={`R$ ${economias.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          change={0} 
          icon={Target}
          color="from-purple-500 to-violet-500"
          small
        />
      </div>

      {/* Cards de Metas e Recorrências lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GoalsProgressCard goals={goals} />
        
        {/* Card de Recorrências */}
        <div className="bg-white bg-opacity-80 shadow-lg rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-cyan-400" />
            Assinaturas e Despesas/Receitas Recorrentes
          </h2>
          <ul className="divide-y divide-gray-200">
            {recurrences.length === 0 && <li className="text-gray-500">Nenhuma recorrência cadastrada.</li>}
            {recurrences.slice(0, 3).map(r => (
              <li key={r.id} className="py-2 flex flex-col">
                <span className="font-semibold text-gray-800">{r.name}</span>
                <span className="text-sm text-gray-500">{r.type === 'income' ? '+' : '-'}R$ {r.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | {r.frequency} | {r.category}</span>
                <span className="text-xs text-gray-400">Início: {new Date(r.startDate).toLocaleDateString('pt-BR')}</span>
              </li>
            ))}
            {recurrences.length > 3 && (
              <li className="py-2 text-sm text-cyan-600 font-medium">
                +{recurrences.length - 3} mais recorrências...
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Gráficos e Calendário organizados */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="space-y-4 lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BarChartCard dailyIncomes={dailyIncomes} small />
            <LineChartCard
              data={comparisonData}
              periods={availablePeriods}
              selectedPeriod={comparisonPeriod}
              onPeriodChange={setComparisonPeriod}
              small
            />
          </div>
          <div className="bg-white bg-opacity-80 shadow-lg rounded-xl p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-cyan-400" />
              Transações Recentes
            </h2>
            <div className="space-y-2">
              {transactions.slice(0, 5).map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
          </div>
        </div>
        
        {/* Coluna lateral com gráfico de pizza e calendário */}
        <div className="lg:col-span-1 space-y-4">
          <PieChartCard transactions={transactions} />
          <CalendarCard transactions={transactions} />
        </div>
      </div>
    </div>
  );
}; 