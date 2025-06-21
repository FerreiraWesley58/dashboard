import express from 'express';
import { authenticate } from '../middleware/auth';
import { Recurrence } from '../models/Recurrence';

const router = express.Router();

// Listar recorrências do usuário
router.get('/', authenticate, async (req, res) => {
  const userId = (req as any).user.id;
  const recurrences = await Recurrence.findAll({ where: { userId } });
  res.json(recurrences);
});

// Criar recorrência
router.post('/', authenticate, async (req, res) => {
  const userId = (req as any).user.id;
  const { name, amount, type, category, startDate, endDate, frequency, active } = req.body;
  const recurrence = await Recurrence.create({ userId, name, amount, type, category, startDate, endDate, frequency, active });
  res.status(201).json(recurrence);
});

// Editar recorrência
router.put('/:id', authenticate, async (req, res) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const { name, amount, type, category, startDate, endDate, frequency, active } = req.body;
  const recurrence = await Recurrence.findOne({ where: { id, userId } });
  if (!recurrence) return res.status(404).json({ message: 'Recorrência não encontrada.' });
  recurrence.name = name;
  recurrence.amount = amount;
  recurrence.type = type;
  recurrence.category = category;
  recurrence.startDate = startDate;
  recurrence.endDate = endDate;
  recurrence.frequency = frequency;
  recurrence.active = active;
  await recurrence.save();
  res.json(recurrence);
});

// Deletar recorrência
router.delete('/:id', authenticate, async (req, res) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const recurrence = await Recurrence.findOne({ where: { id, userId } });
  if (!recurrence) return res.status(404).json({ message: 'Recorrência não encontrada.' });
  await recurrence.destroy();
  res.json({ message: 'Recorrência removida.' });
});

// Projeção de saldo futuro (próximos 12 meses)
router.get('/projected-balance', authenticate, async (req, res) => {
  const userId = (req as any).user.id;
  const { months = 12 } = req.query;
  // Buscar saldo atual (soma das transações)
  const { Transaction } = require('../models/Transaction');
  const transactions = await Transaction.findAll({ where: { userId } });
  let saldoAtual = 0;
  transactions.forEach((t: any) => {
    saldoAtual += t.type === 'income' ? t.amount : -t.amount;
  });
  // Buscar recorrências ativas
  const recurrences = await Recurrence.findAll({ where: { userId, active: true } });
  // Projeção mês a mês
  const result: { month: string, balance: number }[] = [];
  let saldo = saldoAtual;
  const now = new Date();
  for (let i = 0; i < Number(months); i++) {
    // Adicionar recorrências deste mês
    recurrences.forEach((r: any) => {
      // Verifica se recorrência está ativa neste mês
      const start = new Date(r.startDate);
      const end = r.endDate ? new Date(r.endDate) : null;
      const current = new Date(now.getFullYear(), now.getMonth() + i, 1);
      if (current >= start && (!end || current <= end)) {
        let add = false;
        if (r.frequency === 'monthly') add = true;
        if (r.frequency === 'yearly' && current.getMonth() === start.getMonth()) add = true;
        if (r.frequency === 'weekly') {
          // Aproximação: 4 semanas por mês
          saldo += r.type === 'income' ? r.amount * 4 : -r.amount * 4;
          return;
        }
        if (add) saldo += r.type === 'income' ? r.amount : -r.amount;
      }
    });
    // Salva saldo do mês
    const label = `${now.getMonth() + 1 + i > 12 ? (now.getMonth() + 1 + i) % 12 : now.getMonth() + 1 + i}/${now.getFullYear() + Math.floor((now.getMonth() + i) / 12)}`;
    result.push({ month: label, balance: saldo });
  }
  res.json(result);
});

export default router; 