import React from 'react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const Icon = category.icon;
  const percentage = (category.amount / category.budget) * 100;

  return (
    <div className="bg-white shadow-xl rounded-2xl p-7 hover:shadow-2xl transition-all duration-300 flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} shadow-md`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">{category.name}</span>
        </div>
        <span className="text-green-500 font-bold text-lg">R$ {category.amount}</span>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>R$ {category.amount} / R$ {category.budget}</span>
        <span className="text-green-500 font-bold">{percentage.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`h-3 rounded-full bg-gradient-to-r ${category.color} transition-all duration-1000`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}; 