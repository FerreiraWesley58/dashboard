import React from 'react';
import { Target, TrendingUp } from 'lucide-react';
import { Goal } from '../types';

interface GoalsProgressCardProps {
  goals: Goal[];
}

export const GoalsProgressCard: React.FC<GoalsProgressCardProps> = ({ goals }) => {
  // Filtrar apenas metas ativas e ordenar por prioridade
  const activeGoals = goals
    .filter(goal => !goal.status || goal.status === 'active')
    .sort((a, b) => (b.priority || 1) - (a.priority || 1))
    .slice(0, 5); // Mostrar apenas as 5 principais

  const calculateProgress = (goal: Goal) => {
    if (goal.target <= 0) return 0;
    const progress = (goal.current / goal.target) * 100;
    return Math.min(progress, 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    if (progress >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProgressTextColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-blue-600';
    if (progress >= 40) return 'text-yellow-600';
    if (progress >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white bg-opacity-80 shadow-lg rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Target className="h-6 w-6 mr-3 text-purple-500" />
          Principais Metas
        </h2>
        <div className="flex items-center text-sm text-gray-500">
          <TrendingUp className="h-4 w-4 mr-1" />
          {activeGoals.length} ativas
        </div>
      </div>

      {activeGoals.length === 0 ? (
        <div className="text-center py-8">
          <Target className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Nenhuma meta ativa</p>
          <p className="text-sm text-gray-400">Crie suas primeiras metas financeiras</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeGoals.map((goal) => {
            const progress = calculateProgress(goal);
            const remaining = goal.target - goal.current;
            
            return (
              <div key={goal.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {goal.name}
                  </h3>
                  <span className={`text-sm font-bold ${getProgressTextColor(progress)}`}>
                    {progress.toFixed(0)}%
                  </span>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>R$ {goal.current.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    <span>R$ {goal.target.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>
                    {remaining > 0 
                      ? `Faltam R$ ${remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      : 'Meta concluída! 🎉'
                    }
                  </span>
                  <span className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-1 ${getProgressColor(progress)}`} />
                    {goal.priority === 3 ? 'Alta' : goal.priority === 2 ? 'Média' : 'Baixa'} prioridade
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {goals.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full text-center text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors">
            Ver todas as metas ({goals.length})
          </button>
        </div>
      )}
    </div>
  );
}; 