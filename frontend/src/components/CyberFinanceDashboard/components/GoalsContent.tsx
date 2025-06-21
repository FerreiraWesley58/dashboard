import React, { useEffect, useState } from 'react';
import { Goal } from '../types';
import Modal from './Modal';
import { GoalCard } from './GoalCard';

const API_URL = 'http://localhost:5000/api';

const initialForm = {
  id: null,
  name: '',
  current: 0,
  target: 0,
  category: '',
};

// Templates pré-definidos para categorias de metas
const goalCategories = [
  {
    name: 'Viagem',
    icon: '✈️',
    description: 'Férias e passeios',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    name: 'Carro',
    icon: '🚗',
    description: 'Compra de veículo',
    color: 'from-red-400 to-pink-500'
  },
  {
    name: 'Empreendimento',
    icon: '💼',
    description: 'Negócio próprio',
    color: 'from-green-400 to-emerald-500'
  },
  {
    name: 'Moto',
    icon: '🏍️',
    description: 'Compra de motocicleta',
    color: 'from-orange-400 to-red-500'
  },
  {
    name: 'Casa',
    icon: '🏠',
    description: 'Compra de imóvel',
    color: 'from-purple-400 to-violet-500'
  },
  {
    name: 'Poupança',
    icon: '💰',
    description: 'Reserva financeira',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    name: 'Educação',
    icon: '🎓',
    description: 'Cursos e estudos',
    color: 'from-indigo-400 to-blue-500'
  },
  {
    name: 'Casamento',
    icon: '💒',
    description: 'Cerimônia e festa',
    color: 'from-pink-400 to-rose-500'
  },
  {
    name: 'Tecnologia',
    icon: '💻',
    description: 'Eletrônicos e gadgets',
    color: 'from-gray-400 to-slate-500'
  },
  {
    name: 'Saúde',
    icon: '🏥',
    description: 'Tratamentos médicos',
    color: 'from-teal-400 to-cyan-500'
  },
  {
    name: 'Investimentos',
    icon: '📈',
    description: 'Aplicações financeiras',
    color: 'from-emerald-400 to-green-500'
  },
  {
    name: 'Outros',
    icon: '🎯',
    description: 'Outras metas',
    color: 'from-slate-400 to-gray-500'
  }
];

const GoalsContent: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [form, setForm] = useState<any>(initialForm);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoals = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/goals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setGoals(data);
      } catch (err) {
        setError('Erro ao buscar metas');
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  const handleOpenAdd = () => {
    setForm(initialForm);
    setIsEdit(false);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEdit = (goal: Goal) => {
    setForm(goal);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleCategorySelect = (category: typeof goalCategories[0]) => {
    setForm({ ...form, category: category.name });
    setIsCategoryModalOpen(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/goals/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erro ao remover meta');
      setGoals(goals.filter(g => g.id !== id));
    } catch (err) {
      setError('Erro ao remover meta');
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
        const res = await fetch(`${API_URL}/goals/${form.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Erro ao editar meta');
        const updated = await res.json();
        setGoals(goals.map(g => g.id === form.id ? updated : g));
      } else {
        const res = await fetch(`${API_URL}/goals`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Erro ao adicionar meta');
        const created = await res.json();
        setGoals([...goals, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError('Erro ao salvar meta');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = goalCategories.find(c => c.name === categoryName);
    return category ? category.icon : '🎯';
  };

  const getCategoryColor = (categoryName: string) => {
    const category = goalCategories.find(c => c.name === categoryName);
    return category ? category.color : 'from-slate-400 to-gray-500';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Metas Financeiras</h1>
        <button
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-black hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          onClick={handleOpenAdd}
        >
          Adicionar Meta
        </button>
      </div>
      {error && <div className="text-red-500 text-center">{error}</div>}
      {loading && <div className="text-gray-500 text-center">Carregando...</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <div key={goal.id} className="relative group">
            <GoalCard goal={goal} />
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button
                className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                onClick={() => handleOpenEdit(goal)}
              >
                Editar
              </button>
              <button
                className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                onClick={() => handleDelete(goal.id)}
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Seleção de Categoria */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Escolha uma Categoria para sua Meta</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goalCategories.map((category, index) => (
                <div
                  key={index}
                  onClick={() => handleCategorySelect(category)}
                  className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-800">{category.name}</h4>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  <div className={`w-full h-2 rounded-full bg-gradient-to-r ${category.color}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Formulário */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEdit ? 'Editar Meta' : 'Adicionar Meta'}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {form.category && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">{getCategoryIcon(form.category)}</span>
              <div>
                <p className="font-semibold text-gray-800">{form.category}</p>
                <p className="text-sm text-gray-600">Categoria selecionada</p>
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Nome da Meta</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: Viagem para Europa"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Valor Atual</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded"
              value={form.current}
              onChange={e => setForm({ ...form, current: parseFloat(e.target.value) || 0 })}
              min={0}
              step="0.01"
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Meta (Valor Alvo)</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded"
              value={form.target}
              onChange={e => setForm({ ...form, target: parseFloat(e.target.value) || 0 })}
              min={0}
              step="0.01"
              placeholder="0.00"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-purple-500 text-white rounded" disabled={loading}>
              {isEdit ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GoalsContent; 