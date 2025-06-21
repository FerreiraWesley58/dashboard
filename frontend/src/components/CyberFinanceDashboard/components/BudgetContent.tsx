import React from 'react';
import { CategoryCard } from './CategoryCard';
import { Category } from '../types';

interface BudgetContentProps {
  categories: Category[];
}

export const BudgetContent: React.FC<BudgetContentProps> = ({ categories }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Budget Overview</h1>
        <div className="text-gray-600">June 2025</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <CategoryCard key={index} category={category} />
        ))}
      </div>
    </div>
  );
}; 