import { Model, DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";
import Rentable from "../../admin/models/rentable-vehicle-model.js"; // Import Rentable model

class Booking extends Model {}

Booking.init(
  {
    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Vehicles", // This assumes there is a Vehicles table
        key: "id",
      },
      onDelete: "CASCADE",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Reference to the user who is booking
    },
    pickupDate: {
      type: DataTypes.DATEONLY, // Store only date, not time
      allowNull: false,
    },
    dropoffDate: {
      type: DataTypes.DATEONLY, // Store only date, not time
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING, // Status of the booking (e.g., 'pending', 'booked', 'released', 'cancelled')
      allowNull: false,
      defaultValue: "pending", // Default status is 'pending'
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false, // Total price for the booking
    },
    razorpayOrderId: {
      type: DataTypes.STRING, // Store Razorpay order ID
      allowNull: true, // Will be null until payment is initiated
    },
    paymentMethod: {
      type: DataTypes.STRING, // Store Razorpay order ID
      allowNull: true,
    },
    releaseDate: {
      type: DataTypes.DATEONLY, // Date when the vehicle was released
      allowNull: true, // This will be null until the vehicle is released
    },
  },
  {
    sequelize,
    modelName: "Booking",
  }
);

Booking.belongsTo(Rentable, { foreignKey: "vehicleId", as: "rentable" });

export default Booking;
