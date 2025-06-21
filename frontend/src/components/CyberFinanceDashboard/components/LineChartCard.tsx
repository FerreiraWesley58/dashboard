import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DataPoint {
  period: string;
  income: number;
  expense: number;
}

interface LineChartCardProps {
  data: DataPoint[];
  periods: string[];
  onPeriodChange: (period: string) => void;
  selectedPeriod: string;
  small?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded border border-gray-300">
        <p className="text-black font-bold">{label}</p>
        <p className="text-green-600">Receita: R$ {payload[0].value.toFixed(2)}</p>
        <p className="text-red-500">Despesa: R$ {payload[1].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const LineChartCard: React.FC<LineChartCardProps> = ({ data, periods, onPeriodChange, selectedPeriod, small = false }) => {
  return (
    <div className={`bg-white bg-opacity-80 shadow-lg rounded-xl ${small ? 'p-4' : 'p-8'}`}>
      <div className="flex items-center mb-4 justify-between">
        <h2 className={`font-bold text-black ${small ? 'text-lg' : 'text-xl'}`}>Comparativo de Receita x Despesa</h2>
        <select
          className="px-3 py-2 border rounded bg-white"
          value={selectedPeriod}
          onChange={e => onPeriodChange(e.target.value)}
        >
          {periods.map(period => (
            <option key={period} value={period}>{period}</option>
          ))}
        </select>
      </div>
      <div className={small ? 'h-[160px]' : 'h-[300px]'}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="period" stroke="#111" tick={{ fill: '#111', fontWeight: 500 }} />
            <YAxis stroke="#111" tick={{ fill: '#111', fontWeight: 500 }} tickFormatter={value => `R$ ${value}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#4ECDC4" strokeWidth={3} name="Receita" />
            <Line type="monotone" dataKey="expense" stroke="#FF6B6B" strokeWidth={3} name="Despesa" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartCard; 