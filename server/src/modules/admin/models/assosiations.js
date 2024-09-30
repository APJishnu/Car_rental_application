import Vehicle from './vehicles-model.js';
import Rentable from './rentable-vehicle-model.js';

// Define associations
Vehicle.hasOne(Rentable, {
  foreignKey: 'vehicleId',
  onDelete: 'CASCADE', // If a vehicle is deleted, delete the associated rentable record
});

Rentable.belongsTo(Vehicle, {
  foreignKey: 'vehicleId',
  targetKey: 'id',
  onDelete: 'CASCADE', // Ensures related rentables are deleted if a vehicle is removed
});
