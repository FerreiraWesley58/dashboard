import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Transaction } from '../types';

interface CalendarCardProps {
  transactions: Transaction[];
}

const CalendarCard: React.FC<CalendarCardProps> = ({ transactions }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Filtrar apenas transações futuras do mês atual
  const futureTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return (
      transaction.isFuture &&
      isSameMonth(transactionDate, currentDate) &&
      transactionDate >= new Date() // Apenas transações futuras
    );
  });

  const transactionsOnDay = (date: Date) =>
    futureTransactions.filter(transaction => 
      isSameDay(new Date(transaction.date), date)
    );

  const totalExpenses = futureTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);
  
  const totalIncome = futureTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const getDayBackgroundColor = (date: Date) => {
    const dayTransactions = transactionsOnDay(date);
    if (dayTransactions.length === 0) return '';
    
    const hasExpense = dayTransactions.some(t => t.type === 'expense');
    const hasIncome = dayTransactions.some(t => t.type === 'income');
    
    if (hasExpense && hasIncome) return 'bg-gradient-to-br from-red-50 to-green-50';
    if (hasExpense) return 'bg-red-50';
    if (hasIncome) return 'bg-green-50';
    return 'bg-gray-50';
  };

  const getDayBorderColor = (date: Date) => {
    const dayTransactions = transactionsOnDay(date);
    if (dayTransactions.length === 0) return '';
    
    const hasExpense = dayTransactions.some(t => t.type === 'expense');
    const hasIncome = dayTransactions.some(t => t.type === 'income');
    
    if (hasExpense && hasIncome) return 'ring-2 ring-orange-400';
    if (hasExpense) return 'ring-2 ring-red-400';
    if (hasIncome) return 'ring-2 ring-green-400';
    return '';
  };

  return (
    <div className="bg-white bg-opacity-80 shadow-lg rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            →
          </button>
        </div>
      </div>

      {/* Resumo do mês */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex items-center gap-4">
          <span className="text-sm text-red-600 font-semibold">
            A pagar: R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-sm text-green-600 font-semibold">
            A receber: R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {futureTransactions.length} transação{futureTransactions.length !== 1 ? 'ões' : ''} futura{futureTransactions.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Cabeçalho dos dias da semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="text-center text-gray-600 font-semibold text-sm p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Grid do calendário */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const dayTransactions = transactionsOnDay(day);
          const isCurrentDay = isToday(day);
          
          return (
            <div
              key={day.toString()}
              className={`
                p-2 text-center rounded-lg relative cursor-pointer transition-all min-h-[60px] flex flex-col justify-center
                ${isSameMonth(day, currentDate) ? 'text-gray-900' : 'text-gray-400'}
                ${isCurrentDay ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                ${getDayBackgroundColor(day)}
                ${getDayBorderColor(day)}
                hover:bg-gray-100
              `}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              <span className={`text-sm font-medium ${isCurrentDay ? 'text-blue-600' : ''}`}>
                {format(day, 'd')}
              </span>
              
              {/* Indicadores de transações */}
              {dayTransactions.length > 0 && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                  {dayTransactions.map((transaction, idx) => (
                    <span
                      key={idx}
                      className={`w-2 h-2 rounded-full ${
                        transaction.type === 'expense' ? 'bg-red-500' : 'bg-green-500'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Tooltip */}
              {hoveredDay && isSameDay(day, hoveredDay) && dayTransactions.length > 0 && (
                <div className="absolute z-20 left-1/2 -translate-x-1/2 top-full mt-1 bg-white shadow-lg border border-gray-200 rounded-lg p-3 min-w-[200px] text-left">
                  <div className="font-semibold mb-2 text-gray-900">
                    {format(day, 'dd/MM/yyyy')}
                  </div>
                  {dayTransactions.map((transaction, idx) => (
                    <div key={idx} className="flex justify-between items-center mb-1">
                      <span className={`text-xs ${
                        transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {transaction.description}
                      </span>
                      <span className="text-xs text-gray-900">
                        R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                  <div className="text-xs text-gray-500 mt-1">
                    {dayTransactions[0]?.type === 'expense' ? 'Despesa' : 'Receita'}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lista de transações futuras do mês */}
      {futureTransactions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Transações Futuras do Mês</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {futureTransactions
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map(transaction => (
                <div 
                  key={transaction.id} 
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    transaction.type === 'expense' ? 'bg-red-50' : 'bg-green-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      transaction.type === 'expense' ? 'bg-red-500' : 'bg-green-500'
                    }`} />
                    <span className="text-sm text-gray-900">
                      {format(new Date(transaction.date), 'dd/MM')} - {transaction.description}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className={`text-xs ml-2 ${
                      transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.type === 'expense' ? 'Despesa' : 'Receita'}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {futureTransactions.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-xl">📅</span>
          </div>
          <p className="text-gray-500 font-medium">Nenhuma transação futura</p>
          <p className="text-sm text-gray-400">Adicione transações futuras para vê-las no calendário</p>
        </div>
      )}
    </div>
  );
};

export default CalendarCard; 