import React from 'react';
import { Goal } from '../types';

interface GoalCardProps {
  goal: Goal;
}

// Mapeamento de categorias para ícones e cores
const categoryConfig = {
  'Viagem': { icon: '✈️', color: 'from-blue-400 to-cyan-500' },
  'Carro': { icon: '🚗', color: 'from-red-400 to-pink-500' },
  'Empreendimento': { icon: '💼', color: 'from-green-400 to-emerald-500' },
  'Moto': { icon: '🏍️', color: 'from-orange-400 to-red-500' },
  'Casa': { icon: '🏠', color: 'from-purple-400 to-violet-500' },
  'Poupança': { icon: '💰', color: 'from-yellow-400 to-orange-500' },
  'Educação': { icon: '🎓', color: 'from-indigo-400 to-blue-500' },
  'Casamento': { icon: '💒', color: 'from-pink-400 to-rose-500' },
  'Tecnologia': { icon: '💻', color: 'from-gray-400 to-slate-500' },
  'Saúde': { icon: '🏥', color: 'from-teal-400 to-cyan-500' },
  'Investimentos': { icon: '📈', color: 'from-emerald-400 to-green-500' },
  'Outros': { icon: '🎯', color: 'from-slate-400 to-gray-500' }
};

export const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  const percentage = (goal.current / goal.target) * 100;
  const config = categoryConfig[goal.category as keyof typeof categoryConfig] || categoryConfig['Outros'];

  return (
    <div className="bg-white shadow-xl rounded-2xl p-7 hover:shadow-2xl transition-all duration-300 flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${config.color} shadow-md`}>
          <span className="text-2xl">{config.icon}</span>
        </div>
        <div className="flex-1">
          <span className="text-lg font-semibold text-gray-900">{goal.name}</span>
          <div className="text-sm text-gray-500">{goal.category}</div>
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>R$ {goal.current.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        <span>R$ {goal.target.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`h-3 rounded-full bg-gradient-to-r ${config.color} transition-all duration-1000`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      <div className="text-center">
        <span className="text-purple-500 font-bold text-sm">{percentage.toFixed(1)}% Complete</span>
      </div>
    </div>
  );
}; 