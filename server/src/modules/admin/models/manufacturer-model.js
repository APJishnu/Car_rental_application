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
  imageUrl: {  // New field for storing the image URL
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Manufacturer',
});

export default Manufacturer;
