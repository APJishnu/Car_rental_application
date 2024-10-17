// src/repositories/auth-repo.js
import User from '../models/auth-model.js';

class AuthRepository {
  async findByPhoneNumber(phoneNumber) {
    return await User.findOne({ where: { phoneNumber } });
  }

  async createUser(data) {
    return await User.create(data);
  }

  async updateUser(user) {
    return await user.save();
  }

  // authRepo.js
  async findById(id) {
    return User.findByPk(id);
  }

  async updateProfileImage(userId, profileImage) {
    const user = await this.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user.update({ profileImage });
  }
}

export default new AuthRepository();
