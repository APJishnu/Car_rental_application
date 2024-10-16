    import { Model, DataTypes } from 'sequelize';
    import sequelize from '../../../config/database.js';
    import Booking from './booking-model.js'; // Import Booking model
    import User from './auth-model.js';
import Vehicle from '../../admin/models/vehicles-model.js';

    class Review extends Model {}

    Review.init({
        bookingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Bookings', // Assuming there is a 'Bookings' table
            key: 'id',
        },
        onDelete: 'CASCADE',
        },
        vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        },
        userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Assuming there is a 'Users' table
            key: 'id',
        },
        onDelete: 'CASCADE', // Cascade delete if user is deleted
        },
        comment: {
        type: DataTypes.STRING,
        allowNull: false,
        },
        rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 1,
            max: 5, // Ensure rating is between 1 and 5
        },
        },
    }, {
        sequelize,
        modelName: 'Review',
    });
    
    // Establish relationships
    Review.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });
    Review.belongsTo(User, { foreignKey: 'userId', as: 'user' }); // Connect Review to User
    
    export default Review;