// src/models/user-model.js

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js'; // Assuming you have a configured sequelize instance

class User extends Model { }

// Define the User model
User.init({
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensuring unique phone numbers
        validate: {
            is: /^[0-9]{10}$/, // Validate 10-digit phone number format
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensuring unique email addresses
        validate: {
            isEmail: true, // Validate email format
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profileImage: {
        type: DataTypes.STRING,
        allowNull: true, // Profile image is optional
      },
    city: {
        type: DataTypes.STRING,
        allowNull: true, // This field comes after phone verification
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pincode: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            is: /^[0-9]{6}$/, // Validate 6-digit pincode
        },
    },
}, {
    sequelize,
    modelName: 'User',
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

export default User;
