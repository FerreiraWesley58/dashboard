import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface TransactionAttributes {
  id: number;
  userId: number;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  category: string;
  isFuture: boolean;
}

interface TransactionCreationAttributes extends Optional<TransactionAttributes, 'id'> {}

class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
  public id!: number;
  public userId!: number;
  public description!: string;
  public amount!: number;
  public date!: string;
  public type!: 'income' | 'expense';
  public category!: string;
  public isFuture!: boolean;
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('income', 'expense'),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isFuture: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'transactions',
  }
);

export { Transaction }; 