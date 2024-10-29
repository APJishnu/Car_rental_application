// src/models/rentable-vehicle-model.js
import { Model, DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import Vehicle from "./vehicles-model.js";
import Inventory from "./inventory-models.js"; // Ensure correct import

class Rentable extends Model {}

Rentable.init(
  {
    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Vehicles', // This assumes there is a Vehicles table
        key: 'id',
      },
      onDelete: 'CASCADE', // Ensure that rentables are deleted if vehicle is deleted
    },
    pricePerDay: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    availableQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    inventoryId: {
      type: DataTypes.INTEGER, // Assuming inventory IDs are integers
      allowNull: false, // This field is required
      references: {
        model: 'inventories', // Reference the Inventory model directly
        key: "id",
      },
      onDelete: "SET NULL", // Adjust behavior based on your needs
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Rentable",
    paranoid: true, // Enable soft delete functionality
  }
);

// Define associations
Rentable.belongsTo(Vehicle, {
  foreignKey: "vehicleId",
  as: "vehicle", // Alias for easier access
});

Rentable.belongsTo(Inventory, {
  foreignKey: "inventoryId",
  as: "inventory", // Alias for easier access
});

export default Rentable;
