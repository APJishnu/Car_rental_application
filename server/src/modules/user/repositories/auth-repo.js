// src/repositories/auth-repo.js
import { verifyPassword, hashPassword } from "../../../utils/auth.js";
import User from "../models/auth-model.js";

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
      throw new Error("User not found");
    }

    return user.update({ profileImage });
  }

  async updateUserInfo(userId, updateData) {
    try {
      const [rowsUpdated, [updatedUser]] = await User.update(updateData, {
        where: { id: userId },
        returning: true, // Ensures Sequelize returns the updated user object
      });

      if (rowsUpdated === 0) {
        throw new Error("User not found");
      }

      return updatedUser; // Raw user object to be formatted in helper
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async validatePassword(userId, password) {
    // Retrieve the user from the database
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return false; // User not found
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await verifyPassword(password, user.password);
    return isMatch;
  }

  async updatePassword(userId, newPassword) {
    // Hash the new password before storing it
    const hashedPassword = await hashPassword(newPassword);

    // Update the user's password in the database
    const result = await User.update(
      { password: hashedPassword },
      { where: { id: userId } }
    );

    return result[0] > 0; // Returns true if the password was updated
  }
}

export default new AuthRepository();
