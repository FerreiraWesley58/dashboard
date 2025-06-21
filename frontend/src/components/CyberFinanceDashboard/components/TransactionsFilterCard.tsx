import React, { useState } from 'react';
import { Transaction } from '../types';

interface TransactionsFilterCardProps {
  transactions?: Transaction[];
}

const filterOptions = [
  { label: 'Todos', value: 'todos' },
  { label: 'Entradas', value: 'income' },
  { label: 'Saídas', value: 'expense' },
];

const TransactionsFilterCard: React.FC<TransactionsFilterCardProps> = ({ transactions = [] }) => {
  const [filter, setFilter] = useState('todos');
  const filtered = filter === 'todos' ? transactions : transactions.filter(t => t.type === filter);

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-black">Transações Recentes</h2>
        <div className="flex gap-2">
          {filterOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-4 py-1 rounded-lg font-semibold transition-all duration-200 text-black border border-gray-200 hover:bg-green-100 ${filter === opt.value ? 'bg-green-500 text-white' : 'bg-white'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <ul className="divide-y divide-gray-200">
        {filtered.length === 0 && <li className="text-gray-400 text-center py-4">Nenhuma transação encontrada</li>}
        {filtered.map(t => (
          <li key={t.id} className="py-3 flex items-center justify-between">
            <div>
              <div className="font-medium text-black">{t.description || t.name}</div>
              <div className="text-xs text-gray-500">{t.date}</div>
            </div>
            <div className={`font-bold text-lg ${t.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>{t.amount > 0 ? '+' : ''}R$ {Math.abs(t.amount).toFixed(2)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsFilterCard; 