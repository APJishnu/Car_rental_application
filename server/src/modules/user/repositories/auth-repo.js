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
}

export default new AuthRepository();
