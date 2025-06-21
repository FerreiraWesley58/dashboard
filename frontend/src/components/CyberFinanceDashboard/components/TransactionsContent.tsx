import React, { useEffect, useState } from 'react';
import { TransactionItem } from './TransactionItem';
import { Transaction, Category } from '../types';
import Modal from './Modal';
import { DollarSign, ShoppingCart, Utensils, Home, Car, Plane, MoreHorizontal } from 'lucide-react';

interface TransactionsContentProps {
  transactions: Transaction[];
}

const API_URL = 'http://localhost:5000/api';

const initialForm = {
  id: undefined,
  description: '',
  amount: 0,
  date: '',
  type: 'income',
  category: '',
  isFuture: false,
};

export const TransactionsContent: React.FC<TransactionsContentProps> = ({ transactions: initialTransactions }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<any>(initialForm);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros avançados
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch real transactions from backend on mount
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        setError('Erro ao buscar transações');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/categories', {
          headers: { Authorization: `Bearer ${token}` },
        });
        let data = await res.json();
        // Atribuir ícones padrão
        data = data.map((cat: any) => {
          let icon = MoreHorizontal;
          switch (cat.name.toLowerCase()) {
            case 'salário': icon = DollarSign; break;
            case 'compras': icon = ShoppingCart; break;
            case 'alimentação': icon = Utensils; break;
            case 'moradia': icon = Home; break;
            case 'transporte': icon = Car; break;
            case 'viagem': icon = Plane; break;
            // Adicione mais casos conforme necessário
          }
          return { ...cat, icon };
        });
        // Se não houver categorias cadastradas, usar padrão
        if (!data.length) {
          data = [
            { id: 1, name: 'Salário', color: 'from-green-400 to-cyan-500', icon: DollarSign },
            { id: 2, name: 'Compras', color: 'from-pink-400 to-red-400', icon: ShoppingCart },
            { id: 3, name: 'Alimentação', color: 'from-yellow-400 to-orange-400', icon: Utensils },
            { id: 4, name: 'Moradia', color: 'from-blue-400 to-indigo-500', icon: Home },
            { id: 5, name: 'Transporte', color: 'from-purple-400 to-fuchsia-500', icon: Car },
            { id: 6, name: 'Viagem', color: 'from-cyan-400 to-blue-400', icon: Plane },
            { id: 7, name: 'Outros', color: 'from-gray-400 to-gray-600', icon: MoreHorizontal },
          ];
        }
        setCategories(data);
      } catch (err) {
        // Silenciar erro aqui, pois já há erro global
      }
    };
    fetchCategories();
  }, []);

  // CRUD handlers
  const handleOpenAdd = () => {
    setForm(initialForm);
    setIsEdit(false);
    setIsModalOpen(true);
  };
  const handleOpenEdit = (transaction: Transaction) => {
    setForm(transaction);
    setIsEdit(true);
    setIsModalOpen(true);
  };
  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erro ao remover transação');
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (err) {
      setError('Erro ao remover transação');
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (isEdit) {
        const res = await fetch(`${API_URL}/transactions/${form.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Erro ao editar transação');
        const updated = await res.json();
        setTransactions(transactions.map(t => t.id === form.id ? updated : t));
      } else {
        const res = await fetch(`${API_URL}/transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Erro ao adicionar transação');
        const created = await res.json();
        setTransactions([...transactions, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError('Erro ao salvar transação');
    } finally {
      setLoading(false);
    }
  };

  // Filtragem avançada
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = search === '' || t.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'todos' || t.type === typeFilter;
    const matchesCategory = categoryFilter === '' || t.category === categoryFilter;
    const matchesMin = minValue === '' || t.amount >= Number(minValue);
    const matchesMax = maxValue === '' || t.amount <= Number(maxValue);
    const matchesStart = startDate === '' || new Date(t.date) >= new Date(startDate);
    const matchesEnd = endDate === '' || new Date(t.date) <= new Date(endDate);
    return matchesSearch && matchesType && matchesCategory && matchesMin && matchesMax && matchesStart && matchesEnd;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Todas as Transações</h1>
        <div className="flex space-x-3">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg text-black hover:bg-gray-300 transition-all duration-300"
            onClick={() => setIsModalOpen(true)}
          >
            Filtros Avançados
          </button>
          <button
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-black hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
            onClick={handleOpenAdd}
          >
            Adicionar Transação
          </button>
        </div>
      </div>
      {/* UI de filtros avançados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white bg-opacity-80 p-4 rounded-xl shadow">
        <input
          type="text"
          placeholder="Buscar por descrição..."
          className="px-3 py-2 border rounded"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="px-3 py-2 border rounded"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        >
          <option value="todos">Todos os Tipos</option>
          <option value="income">Entrada</option>
          <option value="expense">Saída</option>
        </select>
        <input
          type="text"
          placeholder="Categoria..."
          className="px-3 py-2 border rounded"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        />
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Valor mín."
            className="px-3 py-2 border rounded w-1/2"
            value={minValue}
            onChange={e => setMinValue(e.target.value)}
          />
          <input
            type="number"
            placeholder="Valor máx."
            className="px-3 py-2 border rounded w-1/2"
            value={maxValue}
            onChange={e => setMaxValue(e.target.value)}
          />
        </div>
        <input
          type="date"
          className="px-3 py-2 border rounded"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="px-3 py-2 border rounded"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
      </div>
      {error && <div className="text-red-500 text-center">{error}</div>}
      {loading && <div className="text-gray-500 text-center">Carregando...</div>}
      <div className="bg-white bg-opacity-80 shadow-lg rounded-xl p-8">
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between gap-2">
              <TransactionItem transaction={transaction} />
              <div className="flex gap-2">
                <button
                  className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                  onClick={() => handleOpenEdit(transaction)}
                >
                  Editar
                </button>
                <button
                  className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                  onClick={() => handleDelete(transaction.id)}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEdit ? 'Editar Transação' : 'Adicionar Transação'}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Valor</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data</label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select
              className="w-full px-4 py-2 border rounded"
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
            >
              <option value="income">Entrada</option>
              <option value="expense">Saída</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Categoria</label>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-4">
              {categories.map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 shadow-sm h-28 w-full focus:outline-none
                    ${form.category === cat.name ? 'bg-gradient-to-br ' + cat.color + ' text-white border-transparent shadow-lg scale-105' : 'bg-white border-gray-200 hover:bg-gray-100'}`}
                  onClick={() => setForm({ ...form, category: cat.name })}
                >
                  <span className={`font-semibold text-base mb-2 ${form.category === cat.name ? 'text-white' : 'text-gray-800'}`}>{cat.name}</span>
                  {cat.icon ? (
                    <cat.icon className={`h-8 w-8 ${form.category === cat.name ? 'text-white' : 'text-gray-700'}`} />
                  ) : null}
                </button>
              ))}
            </div>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              placeholder="Ou digite uma nova categoria..."
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isFuture"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              checked={form.isFuture}
              onChange={e => setForm({ ...form, isFuture: e.target.checked })}
            />
            <label htmlFor="isFuture" className="text-sm font-medium text-gray-700">
              Transação futura (aparecerá no calendário)
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded" disabled={loading}>
              {isEdit ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}; 