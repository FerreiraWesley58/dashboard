import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  color: string;
  glitchEffect?: boolean;
  small?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color,
  glitchEffect = false,
  small = false
}) => (
  <div className={`relative bg-white shadow-xl rounded-2xl ${small ? 'p-4' : 'p-7'} flex flex-col justify-between transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl border-b-4 ${glitchEffect ? 'animate-pulse' : ''}`}
    style={{ borderColor: color.includes('from-') ? undefined : color }}>
    <div className="flex items-center justify-between mb-2">
      <div>
        <p className={`text-gray-500 text-xs font-semibold tracking-wide mb-1 uppercase ${small ? 'text-[10px]' : ''}`}>{title}</p>
        <p className={`font-extrabold text-gray-900 leading-tight ${small ? 'text-xl md:text-2xl' : 'text-3xl md:text-4xl'}`}>{value}</p>
      </div>
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg flex items-center justify-center ${small ? 'p-2' : ''}`}>
        <Icon className={`${small ? 'h-5 w-5' : 'h-7 w-7'} text-white`} />
      </div>
    </div>
    <div className="flex items-center mt-2">
      <span className={`text-base font-bold ${change > 0 ? 'text-green-500' : 'text-red-500'} ${small ? 'text-xs' : ''}`}>{change > 0 ? '+' : ''}{change}%</span>
      <span className={`text-gray-400 ml-2 ${small ? 'text-xs' : 'text-sm'}`}>from last month</span>
    </div>
  </div>
); 