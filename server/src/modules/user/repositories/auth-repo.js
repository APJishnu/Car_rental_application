// src/repositories/auth-repo.js
import User from '../models/auth-model.js';

class AuthRepository {
    // Find a user by phone number
    async findByPhoneNumber(phoneNumber) {
        return await User.findOne({ where: { phoneNumber } });
    }

    // Create a new user
    async createUser(data) {
        return await User.create(data);
    }

    // Update an existing user
    async updateUser(user) {
        return await user.save();
    }

    // Find a user by ID
    async findById(id) {
        return User.findByPk(id);
    }

    // Update user's profile image
    async updateProfileImage(userId, profileImage) {
        const user = await this.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        return user.update({ profileImage });
    }


    async updateUserInfo(userId, updateData) {
        try {
          const [rowsUpdated, [updatedUser]] = await User.update(updateData, {
            where: { id: userId },
            returning: true,  // Ensures Sequelize returns the updated user object
          });
      
          if (rowsUpdated === 0) {
            throw new Error('User not found');
          }
      
          return updatedUser; // Raw user object to be formatted in helper
        } catch (error) {
          throw new Error(`Database error: ${error.message}`);
        }
      }
}

export default new AuthRepository();
