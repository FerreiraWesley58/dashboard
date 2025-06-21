import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface RecurrenceAttributes {
  id: number;
  userId: number;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  startDate: string;
  endDate?: string;
  frequency: 'monthly' | 'weekly' | 'yearly' | 'custom';
  active: boolean;
}

interface RecurrenceCreationAttributes extends Optional<RecurrenceAttributes, 'id' | 'endDate'> {}

export class Recurrence extends Model<RecurrenceAttributes, RecurrenceCreationAttributes> implements RecurrenceAttributes {
  public id!: number;
  public userId!: number;
  public name!: string;
  public amount!: number;
  public type!: 'income' | 'expense';
  public category!: string;
  public startDate!: string;
  public endDate?: string;
  public frequency!: 'monthly' | 'weekly' | 'yearly' | 'custom';
  public active!: boolean;
}

Recurrence.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
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
    startDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    frequency: {
      type: DataTypes.ENUM('monthly', 'weekly', 'yearly', 'custom'),
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'recurrences',
  }
); 