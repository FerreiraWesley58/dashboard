import express from 'express';
import { authenticate } from '../middleware/auth';
import { Transaction } from '../models/Transaction';

const router = express.Router();

// Listar transações do usuário
router.get('/', authenticate, async (req, res) => {
  const userId = (req as any).user.id;
  const transactions = await Transaction.findAll({ where: { userId } });
  res.json(transactions);
});

// Criar transação
router.post('/', authenticate, async (req, res) => {
  const userId = (req as any).user.id;
  const { description, amount, date, type, category, isFuture } = req.body;
  const transaction = await Transaction.create({ 
    userId, 
    description, 
    amount, 
    date, 
    type, 
    category, 
    isFuture: isFuture || false 
  });
  res.status(201).json(transaction);
});

// Editar transação
router.put('/:id', authenticate, async (req, res) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const { description, amount, date, type, category, isFuture } = req.body;
  const transaction = await Transaction.findOne({ where: { id, userId } });
  if (!transaction) return res.status(404).json({ message: 'Transação não encontrada.' });
  transaction.description = description;
  transaction.amount = amount;
  transaction.date = date;
  transaction.type = type;
  transaction.category = category;
  transaction.isFuture = isFuture || false;
  await transaction.save();
  res.json(transaction);
});

// Deletar transação
router.delete('/:id', authenticate, async (req, res) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const transaction = await Transaction.findOne({ where: { id, userId } });
  if (!transaction) return res.status(404).json({ message: 'Transação não encontrada.' });
  await transaction.destroy();
  res.json({ message: 'Transação removida.' });
});

export default router; 