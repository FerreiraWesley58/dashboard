import React, { useEffect, useState } from 'react';
import { Category } from '../types';
import Modal from './Modal';
import { CategoryCard } from './CategoryCard';

const API_URL = 'http://localhost:5000/api';

const initialForm = {
  id: null,
  name: '',
  color: 'from-green-400 to-cyan-500',
};

const CategoriesContent: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<any>(initialForm);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        setError('Erro ao buscar categorias');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setForm(initialForm);
    setIsEdit(false);
    setIsModalOpen(true);
  };
  const handleOpenEdit = (category: Category) => {
    setForm(category);
    setIsEdit(true);
    setIsModalOpen(true);
  };
  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erro ao remover categoria');
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      setError('Erro ao remover categoria');
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
        const res = await fetch(`${API_URL}/categories/${form.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Erro ao editar categoria');
        const updated = await res.json();
        setCategories(categories.map(c => c.id === form.id ? updated : c));
      } else {
        const res = await fetch(`${API_URL}/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Erro ao adicionar categoria');
        const created = await res.json();
        setCategories([...categories, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError('Erro ao salvar categoria');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Categorias</h1>
        <button
          className="px-4 py-2 bg-gradient-to-r from-green-400 to-cyan-500 rounded-lg text-black hover:from-green-500 hover:to-cyan-600 transition-all duration-300"
          onClick={handleOpenAdd}
        >
          Adicionar Categoria
        </button>
      </div>
      {error && <div className="text-red-500 text-center">{error}</div>}
      {loading && <div className="text-gray-500 text-center">Carregando...</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="relative group">
            <CategoryCard category={category} />
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button
                className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                onClick={() => handleOpenEdit(category)}
              >
                Editar
              </button>
              <button
                className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                onClick={() => handleDelete(category.id)}
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEdit ? 'Editar Categoria' : 'Adicionar Categoria'}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cor (Tailwind gradient)</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded"
              value={form.color}
              onChange={e => setForm({ ...form, color: e.target.value })}
              required
            />
            <div className="text-xs text-gray-400 mt-1">Ex: from-green-400 to-cyan-500</div>
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

export default CategoriesContent; 