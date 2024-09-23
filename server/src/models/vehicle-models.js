import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Manufacturer from './manufacturer-model.js'; // Adjust the path as needed

class Vehicle extends Model {}

Vehicle.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  primaryImage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  otherImages: {
    type: DataTypes.JSON, // Store image URLs as an array
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  manufacturerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Manufacturers', // Must match the table name exactly
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Vehicle',
});

// Define associations
Vehicle.belongsTo(Manufacturer, { foreignKey: 'manufacturerId' });
Manufacturer.hasMany(Vehicle, { foreignKey: 'manufacturerId' });

export default Vehicle;
