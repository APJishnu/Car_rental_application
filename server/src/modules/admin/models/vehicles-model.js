// src/models/vehicles-model.js

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';
import Manufacturer from './manufacturer-model.js'; // Import the Manufacturer model

class Vehicle extends Model {}

// Define the Vehicle model
Vehicle.init({
  manufacturerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Manufacturers', // This assumes you have a Manufacturers table
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
  transmission:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  fuelType:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  numberOfSeats:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  primaryImageUrl: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  otherImageUrls: {
    type: DataTypes.ARRAY(DataTypes.STRING(1000)),
    allowNull: true,
  },
  quantity: {
    type: DataTypes.STRING,
    allowNull: false,
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
  as: 'manufacturer', // Define the alias for easier access
});

export default Vehicle;
