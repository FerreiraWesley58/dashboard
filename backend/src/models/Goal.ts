import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface GoalAttributes {
  id: number;
  userId: number;
  name: string;
  current: number;
  target: number;
  category: string;
}

interface GoalCreationAttributes extends Optional<GoalAttributes, 'id'> {}

class Goal extends Model<GoalAttributes, GoalCreationAttributes> implements GoalAttributes {
  public id!: number;
  public userId!: number;
  public name!: string;
  public current!: number;
  public target!: number;
  public category!: string;
}

Goal.init(
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
    current: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    target: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Outros',
    },
  },
  {
    sequelize,
    tableName: 'goals',
  }
);

export { Goal }; 