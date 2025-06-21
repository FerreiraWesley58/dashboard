import React, { useState } from 'react';
import { Recurrence } from '../types';

const API_URL = 'http://localhost:5000/api';

interface RecurrencesContentProps {
  recurrences: Recurrence[];
  onChange: () => void;
}

const defaultForm: Partial<Recurrence> = {
  name: '',
  amount: 0,
  type: 'expense',
  category: '',
  startDate: '',
  endDate: '',
  frequency: 'monthly',
  active: true,
};

// Templates pré-definidos para assinaturas populares
const subscriptionTemplates = [
  {
    name: 'Netflix',
    amount: 39.90,
    category: 'Entretenimento',
    icon: '🎬',
    description: 'Streaming de filmes e séries'
  },
  {
    name: 'Disney+',
    amount: 27.90,
    category: 'Entretenimento',
    icon: '🏰',
    description: 'Conteúdo Disney, Marvel e Star Wars'
  },
  {
    name: 'Amazon Prime',
    amount: 14.90,
    category: 'Entretenimento',
    icon: '📦',
    description: 'Streaming e benefícios Prime'
  },
  {
    name: 'HBO Max',
    amount: 34.90,
    category: 'Entretenimento',
    icon: '📺',
    description: 'Séries e filmes premium'
  },
  {
    name: 'Crunchyroll',
    amount: 19.90,
    category: 'Entretenimento',
    icon: '🍜',
    description: 'Animes e mangás'
  },
  {
    name: 'Paramount+',
    amount: 24.90,
    category: 'Entretenimento',
    icon: '⭐',
    description: 'Conteúdo Paramount e CBS'
  },
  {
    name: 'Apple TV+',
    amount: 19.90,
    category: 'Entretenimento',
    icon: '🍎',
    description: 'Conteúdo original Apple'
  },
  {
    name: 'Globoplay',
    amount: 29.90,
    category: 'Entretenimento',
    icon: '🌍',
    description: 'Conteúdo Globo e esportes'
  },
  {
    name: 'Academia',
    amount: 89.90,
    category: 'Saúde',
    icon: '💪',
    description: 'Plano de academia mensal'
  }
];

const RecurrencesContent: React.FC<RecurrencesContentProps> = ({ recurrences, onChange }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<Recurrence>>(defaultForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const openModal = (recurrence?: Recurrence) => {
    if (recurrence) {
      setForm(recurrence);
      setEditingId(recurrence.id);
    } else {
      setForm(defaultForm);
      setEditingId(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(defaultForm);
    setEditingId(null);
  };

  const openTemplateModal = () => {
    setTemplateModalOpen(true);
  };

  const closeTemplateModal = () => {
    setTemplateModalOpen(false);
  };

  const selectTemplate = (template: typeof subscriptionTemplates[0]) => {
    setForm({
      ...defaultForm,
      name: template.name,
      amount: template.amount,
      category: template.category,
      startDate: new Date().toISOString().slice(0, 10),
    });
    setTemplateModalOpen(false);
    setModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let val: any = value;
    if (type === 'checkbox') {
      val = (e.target as HTMLInputElement).checked;
    }
    setForm(f => ({ ...f, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/recurrences/${editingId}` : `${API_URL}/recurrences`;
    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    setLoading(false);
    closeModal();
    onChange();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Deseja realmente excluir esta recorrência?')) return;
    setLoading(true);
    await fetch(`${API_URL}/recurrences/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setLoading(false);
    onChange();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Assinaturas e Despesas/Receitas Recorrentes</h2>
        <div className="flex gap-2">
          <button onClick={openTemplateModal} className="bg-purple-500 text-white px-4 py-2 rounded shadow hover:bg-purple-600">
            📺 Assinaturas Populares
          </button>
          <button onClick={() => openModal()} className="bg-cyan-500 text-white px-4 py-2 rounded shadow hover:bg-cyan-600">
            Nova Recorrência
          </button>
        </div>
      </div>
      
      <ul className="divide-y divide-gray-200 bg-white rounded-xl shadow">
        {recurrences.length === 0 && <li className="p-4 text-gray-500">Nenhuma recorrência cadastrada.</li>}
        {recurrences.map(r => (
          <li key={r.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <span className="font-semibold text-gray-800">{r.name}</span>
              <span className="ml-2 text-sm text-gray-500">{r.type === 'income' ? '+' : '-'}R$ {r.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | {r.frequency} | {r.category}</span>
              <span className="ml-2 text-xs text-gray-400">Início: {new Date(r.startDate).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openModal(r)} className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">Editar</button>
              <button onClick={() => handleDelete(r.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Excluir</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal de Templates */}
      {templateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Selecionar Assinatura Popular</h3>
              <button onClick={closeTemplateModal} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subscriptionTemplates.map((template, index) => (
                <div
                  key={index}
                  onClick={() => selectTemplate(template)}
                  className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{template.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-800">{template.name}</h4>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-purple-600">
                      R$ {template.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {template.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Formulário */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md space-y-4 relative">
            <button type="button" onClick={closeModal} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">×</button>
            <h3 className="text-lg font-bold mb-2">{editingId ? 'Editar' : 'Nova'} Recorrência</h3>
            <input name="name" value={form.name || ''} onChange={handleChange} required placeholder="Nome" className="w-full border p-2 rounded" />
            <input name="amount" type="number" value={form.amount || ''} onChange={handleChange} required placeholder="Valor" className="w-full border p-2 rounded" step="0.01" min="0" />
            <select name="type" value={form.type || 'expense'} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
            </select>
            <input name="category" value={form.category || ''} onChange={handleChange} required placeholder="Categoria" className="w-full border p-2 rounded" />
            <input name="startDate" type="date" value={form.startDate ? form.startDate.slice(0,10) : ''} onChange={handleChange} required className="w-full border p-2 rounded" />
            <input name="endDate" type="date" value={form.endDate ? form.endDate.slice(0,10) : ''} onChange={handleChange} className="w-full border p-2 rounded" />
            <select name="frequency" value={form.frequency || 'monthly'} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="monthly">Mensal</option>
              <option value="weekly">Semanal</option>
              <option value="yearly">Anual</option>
              <option value="custom">Personalizada</option>
            </select>
            <label className="flex items-center gap-2">
              <input name="active" type="checkbox" checked={form.active ?? true} onChange={handleChange} /> Ativa
            </label>
            <button type="submit" disabled={loading} className="w-full bg-cyan-500 text-white py-2 rounded hover:bg-cyan-600 mt-2">{loading ? 'Salvando...' : 'Salvar'}</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RecurrencesContent; 