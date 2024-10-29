import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';

class Inventory extends Model {}

Inventory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "inventories", // Adjust according to your database table name
  }
);

export default Inventory ;
