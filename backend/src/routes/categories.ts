import express from 'express';
import { authenticate } from '../middleware/auth';
import { Category } from '../models/Category';

const router = express.Router();

// Listar categorias do usuário
router.get('/', authenticate, async (req, res) => {
  const userId = (req as any).user.id;
  const categories = await Category.findAll({ where: { userId } });
  res.json(categories);
});

// Criar categoria
router.post('/', authenticate, async (req, res) => {
  const userId = (req as any).user.id;
  const { name, color } = req.body;
  const category = await Category.create({ userId, name, color });
  res.status(201).json(category);
});

// Editar categoria
router.put('/:id', authenticate, async (req, res) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const { name, color } = req.body;
  const category = await Category.findOne({ where: { id, userId } });
  if (!category) return res.status(404).json({ message: 'Categoria não encontrada.' });
  category.name = name;
  category.color = color;
  await category.save();
  res.json(category);
});

// Deletar categoria
router.delete('/:id', authenticate, async (req, res) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const category = await Category.findOne({ where: { id, userId } });
  if (!category) return res.status(404).json({ message: 'Categoria não encontrada.' });
  await category.destroy();
  res.json({ message: 'Categoria removida.' });
});

export default router; 