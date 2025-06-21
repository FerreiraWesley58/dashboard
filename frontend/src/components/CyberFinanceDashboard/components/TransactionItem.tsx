import React from 'react';
import { Transaction } from '../types';
import { DollarSign, ShoppingBag, Coffee, Home, Car, Plane, Gift } from 'lucide-react';

interface TransactionItemProps {
  transaction: Transaction;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'salário':
      return DollarSign;
    case 'compras':
      return ShoppingBag;
    case 'alimentação':
      return Coffee;
    case 'moradia':
      return Home;
    case 'transporte':
      return Car;
    case 'viagem':
      return Plane;
    default:
      return Gift;
  }
};

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const Icon = getCategoryIcon(transaction.category);
  
  return (
    <div className="flex items-center justify-between p-4 bg-white bg-opacity-80 shadow rounded-xl hover:shadow-md transition-all duration-300">
      <div className="flex items-center space-x-4">
        <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500">
          <Icon className="h-5 w-5 text-black" />
        </div>
        <div>
          <p className="text-black font-medium">{transaction.description}</p>
          <p className="text-gray-600 text-sm">{transaction.date}</p>
        </div>
      </div>
      <div className={`text-lg font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
        {transaction.type === 'income' ? '+' : '-'}R$ {Math.abs(transaction.amount).toFixed(2)}
      </div>
    </div>
  );
}; 