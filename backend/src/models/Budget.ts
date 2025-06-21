import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface BudgetAttributes {
  id: number;
  userId: number;
  total: number;
  month: number;
  year: number;
}

interface BudgetCreationAttributes extends Optional<BudgetAttributes, 'id'> {}

class Budget extends Model<BudgetAttributes, BudgetCreationAttributes> implements BudgetAttributes {
  public id!: number;
  public userId!: number;
  public total!: number;
  public month!: number;
  public year!: number;
}

Budget.init(
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
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'budgets',
  }
);

export { Budget }; 