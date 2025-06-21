import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Transaction } from '../types';

interface PieChartCardProps {
  transactions: Transaction[];
}

const COLORS = [
  '#FF6B6B', // Vermelho
  '#4ECDC4', // Turquesa
  '#45B7D1', // Azul
  '#96CEB4', // Verde
  '#FFEEAD', // Amarelo
  '#D4A5A5', // Rosa
  '#9B59B6', // Roxo
  '#3498DB', // Azul Royal
  '#E74C3C', // Vermelho escuro
  '#2ECC71', // Verde esmeralda
  '#F39C12', // Laranja
  '#8E44AD', // Roxo escuro
];

export const PieChartCard: React.FC<PieChartCardProps> = ({ transactions }) => {
  // Calcular gastos por categoria apenas para despesas
  const expensesByCategory = React.useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const current = categoryMap.get(transaction.category) || 0;
        categoryMap.set(transaction.category, current + transaction.amount);
      });
    
    return Array.from(categoryMap.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount); // Ordenar por valor decrescente
  }, [transactions]);

  const data = expensesByCategory.map((item, index) => ({
    name: item.category,
    value: item.amount,
    color: COLORS[index % COLORS.length]
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const total = expensesByCategory.reduce((sum, item) => sum + item.amount, 0);
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-white border border-gray-200 shadow-lg p-3 rounded-lg">
          <p className="font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-gray-600">R$ {payload[0].value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p className="text-sm text-gray-500">{percentage}% do total</p>
        </div>
      );
    }
    return null;
  };

  const totalExpenses = expensesByCategory.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-white bg-opacity-80 shadow-lg rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Gastos por Categoria</h2>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total de gastos</p>
          <p className="text-lg font-bold text-red-600">
            R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
      
      {expensesByCategory.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-gray-500 font-medium">Nenhum gasto registrado</p>
          <p className="text-sm text-gray-400">Adicione transações para ver o gráfico</p>
        </div>
      ) : (
        <>
          <div className="h-[250px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legenda customizada */}
          <div className="space-y-2">
            {data.map((item, index) => {
              const percentage = ((item.value / totalExpenses) * 100).toFixed(1);
              return (
                <div key={item.name} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-500">{percentage}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}; 