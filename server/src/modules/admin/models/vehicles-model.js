// models/vehicles-model.js
import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';

class Vehicle extends Model {}

// Define the Vehicle model with associations
Vehicle.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.STRING, // Year is now a string
    allowNull: false,
  },
  manufacturerId: {
    type: DataTypes.INTEGER,
    allowNull: false, // Ensure this field cannot be null
    references: {
      model: 'Manufacturers', // Reference the Manufacturers table
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Vehicle',
});


export default Vehicle;