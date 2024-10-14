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
  imageUrl: {  // Allow longer URLs
    type: DataTypes.STRING(1000), // Increase length to 1000 or use DataTypes.TEXT
    allowNull: true,
  },
 
}, {
  sequelize,
  modelName: 'Manufacturer',
});

export default Manufacturer;
