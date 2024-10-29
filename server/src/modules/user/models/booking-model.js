import { Model, DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import Rentable from "../../admin/models/rentable-vehicle-model.js"; // Import Rentable model

class Booking extends Model {}

Booking.init(
  {
    rentableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Rentables", // Referencing Rentables table
        key: "id",
      },
      onDelete: "CASCADE",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pickupDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    dropoffDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    razorpayOrderId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    releaseDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Booking",
  }
);

// Set up association with Rentable using rentableId
Booking.belongsTo(Rentable, { foreignKey: "rentableId", as: "rentable" });

export default Booking;
