// models/vehicles-model.js
import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import Manufacturer from './manufacturer-model.js';

class Vehicle extends Model {}

// Define the Vehicle model with associations
Vehicle.init({
  manufacturerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Manufacturers',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  primaryImageUrl: {
    type: DataTypes.STRING(1000), // Increase the length to 1000 characters
    allowNull: true,
  },
  
  otherImageUrls: {
    type: DataTypes.ARRAY(DataTypes.STRING(1000)), // Increase each string's length within the array
    allowNull: true,
  },
  
  quantity: {
    type: DataTypes.STRING,
    allowNull: false, // Set it as required
  },
  year: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Vehicle',
});

// Define associations
Vehicle.belongsTo(Manufacturer, {
  foreignKey: 'manufacturerId',
  targetKey: 'id',
});

export default Vehicle;
