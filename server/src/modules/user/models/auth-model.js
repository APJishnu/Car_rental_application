// src/models/user-model.js

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/database.js';

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
        unique: true, 
        validate: {
            is: /^[0-9]{10}$/, 
        },
    },
    isPhoneVerified:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    phoneVerifiedAt:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profileImage: {
        type: DataTypes.STRING(1000),
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true, 
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
            is: /^[0-9]{6}$/, 
        },
    },
}, {
    sequelize,
    modelName: 'User',
    timestamps: true,
});

export default User;
