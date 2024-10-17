// models/manufacturer-model.js
import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';

class Manufacturer extends Model {}

Manufacturer.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  // Use this field to mark the record as deleted
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Manufacturer',
  paranoid: true, // Enable soft delete functionality
});

export default Manufacturer;
