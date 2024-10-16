import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AuthRepository from '../repositories/auth-repo.js'; // Import the auth repository
import { JWT_SECRET } from '../../../config/config.js'; // Secret key for JWT

class AdminHelper {
  constructor() {
    this.secretKey = JWT_SECRET;
  }

   // Method to find admin by email using the repository
   async findAdminByEmail(email) {
    try {
      return await AuthRepository.findAdminByEmail(email);
    } catch (error) {
      throw new Error('Error fetching admin');
    }
  }


  // Method to validate password
  async validatePassword(enteredPassword, storedPassword) {
    try {
      return await bcrypt.compare(enteredPassword, storedPassword);
    } catch (error) {
      throw new Error('Error validating password');
    }
  }

  // Method to generate JWT token
  generateToken(admin) {
    try {
      console.log(admin," in generate token admin")
      return jwt.sign(
        { id: admin.id, email: admin.email, role: admin.role },
        this.secretKey,
        { expiresIn: '1h' }
      );
    } catch (error) {
      throw new Error('Error generating token');
    }
  }
}

export default new AdminHelper();
