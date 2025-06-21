import express from 'express';
import { authenticate } from '../middleware/auth';
import { Goal } from '../models/Goal';

const router = express.Router();

// Listar metas do usuário
router.get('/', authenticate, async (req, res) => {
  const userId = (req as any).user.id;
  const goals = await Goal.findAll({ where: { userId } });
  res.json(goals);
});

// Criar meta
router.post('/', authenticate, async (req, res) => {
  const userId = (req as any).user.id;
  const { name, current, target, category } = req.body;
  const goal = await Goal.create({ userId, name, current, target, category });
  res.status(201).json(goal);
});

// Editar meta
router.put('/:id', authenticate, async (req, res) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const { name, current, target, category } = req.body;
  const goal = await Goal.findOne({ where: { id, userId } });
  if (!goal) return res.status(404).json({ message: 'Meta não encontrada.' });
  goal.name = name;
  goal.current = current;
  goal.target = target;
  goal.category = category;
  await goal.save();
  res.json(goal);
});

// Deletar meta
router.delete('/:id', authenticate, async (req, res) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const goal = await Goal.findOne({ where: { id, userId } });
  if (!goal) return res.status(404).json({ message: 'Meta não encontrada.' });
  await goal.destroy();
  res.json({ message: 'Meta removida.' });
});

export default router; 