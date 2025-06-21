import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign } from 'lucide-react';

interface DailyIncome {
  day: string;
  amount: number;
}

interface BarChartCardProps {
  dailyIncomes: DailyIncome[];
  small?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded border border-gray-300">
        <p className="text-black">{`${label}: R$ ${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

export const BarChartCard: React.FC<BarChartCardProps> = ({ dailyIncomes, small = false }) => {
  return (
    <div className={`bg-white bg-opacity-80 shadow-lg rounded-xl ${small ? 'p-4' : 'p-8'}`}>
      <div className="flex items-center mb-4">
        <DollarSign className="h-6 w-6 mr-2 text-cyan-400" />
        <h2 className="text-lg font-bold text-black">Ganhos Diários</h2>
      </div>
      <div className={small ? 'h-[160px]' : 'h-[300px]'}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dailyIncomes}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="day" 
              stroke="#111"
              tick={{ fill: '#111', fontWeight: 500 }}
            />
            <YAxis 
              stroke="#111"
              tick={{ fill: '#111', fontWeight: 500 }}
              tickFormatter={(value) => `R$ ${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="amount" 
              fill="#4ECDC4"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 