import React, { useState, useEffect } from 'react';
import { CreditCard, TrendingUp, TrendingDown, DollarSign, Zap, Shield, Target, Gamepad2, Car, Home, ShoppingBag, Coffee, Heart, Smartphone, Book, Plane, Gift, Bell, User, Menu, X, Search, ArrowUpRight } from 'lucide-react';
import { StatCard } from './components/StatCard';
import { TransactionItem } from './components/TransactionItem';
import { CategoryCard } from './components/CategoryCard';
import { GoalCard } from './components/GoalCard';
import { Navigation } from './components/Navigation';
import { useDashboardData } from './hooks/useDashboardData';
import { useGlitchEffect } from './hooks/useGlitchEffect';
import { useCurrentTime } from './hooks/useCurrentTime';
import { DashboardContent } from './components/DashboardContent';
import { BudgetContent } from './components/BudgetContent';
import GoalsContent from './components/GoalsContent';
import { TransactionsContent } from './components/TransactionsContent';
import { Transaction, Category } from './types';
import TransactionsFilterCard from './components/TransactionsFilterCard';
import { GoalsProgressCard } from './components/GoalsProgressCard';
import UserWelcomeCard from './components/UserWelcomeCard';
import RecurrencesContent from './components/RecurrencesContent';

const CyberFinanceDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const { glitchEffect } = useGlitchEffect();
  const { currentTime } = useCurrentTime();
  const {
    transactions, categories, goals, menuItems, loading, error,
    comparisonData, availablePeriods, comparisonPeriod, setComparisonPeriod,
    recurrences
  } = useDashboardData();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Função para calcular dailyIncomes reais a partir das transações
  const dailyIncomes = React.useMemo(() => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const result = Array(7).fill(0).map((_, i) => ({ day: days[i], amount: 0 }));
    transactions.forEach((t) => {
      if (t.type === 'income') {
        const date = new Date(t.date);
        const dayIdx = date.getDay();
        result[dayIdx].amount += t.amount;
      }
    });
    return result;
  }, [transactions]);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardContent
          transactions={transactions}
          categories={categories}
          goals={goals}
          dailyIncomes={dailyIncomes}
          comparisonData={comparisonData}
          availablePeriods={availablePeriods}
          comparisonPeriod={comparisonPeriod}
          setComparisonPeriod={setComparisonPeriod}
          recurrences={recurrences}
        />;
      case 'budget':
        return <BudgetContent categories={categories} />;
      case 'goals':
        return <GoalsContent />;
      case 'transactions':
        return <TransactionsContent transactions={transactions} />;
      case 'recurrences':
        return <RecurrencesContent recurrences={recurrences} onChange={() => window.location.reload()} />;
      default:
        return (
          <div className="text-center text-black">
            <h1 className="text-3xl font-bold mb-4">Em Breve</h1>
            <p className="text-gray-400">Esta seção está em desenvolvimento</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Sidebar já fixa pela Navigation */}
      <div className="pl-24 pt-8 pr-6 pb-8 max-w-[1600px] mx-auto">
        <Navigation 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          menuItems={menuItems}
          currentTime={currentTime}
          glitchEffect={glitchEffect}
        />
        <main className="mt-8 space-y-10">
          {activeSection === 'dashboard' && (
            <>
              <UserWelcomeCard />
              <div className="mt-8">
                <DashboardContent
                  transactions={transactions}
                  categories={categories}
                  goals={goals}
                  dailyIncomes={dailyIncomes}
                  comparisonData={comparisonData}
                  availablePeriods={availablePeriods}
                  comparisonPeriod={comparisonPeriod}
                  setComparisonPeriod={setComparisonPeriod}
                  recurrences={recurrences}
                />
              </div>
            </>
          )}
          {activeSection !== 'dashboard' && renderContent()}
        </main>
      </div>
      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 z-50">
        <Gift className="h-6 w-6 text-black" />
      </button>
    </div>
  );
};

export default CyberFinanceDashboard; 