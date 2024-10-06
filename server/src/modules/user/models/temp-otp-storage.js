// src/models/TemporaryOTP.js
import { DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';

const TemporaryOTP = sequelize.define('TemporaryOTP', {
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure each phone number is unique for OTPs
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  // Optional: Add timestamps if you want to keep track of when the OTP was created/updated
  timestamps: true,
});

export default TemporaryOTP;
