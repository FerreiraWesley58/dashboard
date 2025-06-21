import express from 'express';
import { authenticate } from '../middleware/auth';
import { Budget } from '../models/Budget';

const router = express.Router();

// Listar orçamentos do usuário
router.get('/', authenticate, async (req, res) => {
  const userId = (req as any).user.id;
  const budgets = await Budget.findAll({ where: { userId } });
  res.json(budgets);
});

// Criar orçamento
router.post('/', authenticate, async (req, res) => {
  const userId = (req as any).user.id;
  const { total, month, year } = req.body;
  const budget = await Budget.create({ userId, total, month, year });
  res.status(201).json(budget);
});

// Editar orçamento
router.put('/:id', authenticate, async (req, res) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const { total, month, year } = req.body;
  const budget = await Budget.findOne({ where: { id, userId } });
  if (!budget) return res.status(404).json({ message: 'Orçamento não encontrado.' });
  budget.total = total;
  budget.month = month;
  budget.year = year;
  await budget.save();
  res.json(budget);
});

// Deletar orçamento
router.delete('/:id', authenticate, async (req, res) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const budget = await Budget.findOne({ where: { id, userId } });
  if (!budget) return res.status(404).json({ message: 'Orçamento não encontrado.' });
  await budget.destroy();
  res.json({ message: 'Orçamento removido.' });
});

export default router; 