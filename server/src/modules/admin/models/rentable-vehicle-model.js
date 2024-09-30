// src/models/rentable-vehicle-model.js

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import Vehicle from './vehicles-model.js'; // Ensure the Vehicle model is imported

class Rentable extends Model {}

Rentable.init({
  vehicleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Vehicles', // This assumes there is a Vehicles table
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  pricePerDay: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  availableQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Rentable',
});

// Define associations
Rentable.belongsTo(Vehicle, {
  foreignKey: 'vehicleId',
  as: 'vehicle', // Define the alias for easier access
});

export default Rentable;
