import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { User } from './models/User';
import { Transaction } from './models/Transaction';
import { Category } from './models/Category';
import { Goal } from './models/Goal';
import { Budget } from './models/Budget';
import { Recurrence } from './models/Recurrence';
import authRoutes from './routes/auth';
import transactionRoutes from './routes/transactions';
import categoryRoutes from './routes/categories';
import goalRoutes from './routes/goals';
import budgetRoutes from './routes/budgets';
import recurrenceRoutes from './routes/recurrences';
import userRoutes from './routes/users';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use('/public', express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/recurrences', recurrenceRoutes);
app.use('/api/users', userRoutes);

// Função para iniciar o servidor após sincronizar o banco
const startServer = async () => {
  await connectDB();
  await User.sync({ alter: true });
  await Transaction.sync({ alter: true });
  await Category.sync({ alter: true });
  await Goal.sync({ alter: true });
  await Budget.sync({ alter: true });
  await Recurrence.sync({ alter: true });
  console.log('Modelos sincronizados.');

  app.get('/', (req, res) => {
    res.send('API CyberFinance rodando com SQLite!');
  });

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
};

startServer(); 