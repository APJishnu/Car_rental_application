import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AuthRepository from '../repositories/auth-repo.js';
import { JWT_SECRET } from '../../../config/config.js';

class AdminHelper {
  constructor() {
    this.secretKey = JWT_SECRET;
  }

  // Method to find admin by email
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
      return jwt.sign(
        { id: admin.id, email: admin.email, role: admin.role },
        this.secretKey,
        { expiresIn: '1h' }
      );
    } catch (error) {
      throw new Error('Error generating token');
    }
  }

  // The main login logic, including fetching admin, validating credentials, and generating token
  async login(email, password) {
    try {
      // Find the admin by email
      const admin = await this.findAdminByEmail(email);
      if (!admin) {
        return {
          status: false,
          statusCode: 401,
          message: 'Invalid credentials',
          data: null,
        };
      }

      // Validate the password
      const isPasswordValid = await this.validatePassword(password, admin.password);
      if (!isPasswordValid) {
        return {
          status: false,
          statusCode: 401,
          message: 'Invalid credentials',
          data: null,
        };
      }

      // Generate JWT token
      const token = this.generateToken(admin);

      // Return success response
      return {
        status: true,
        statusCode: 200,
        message: 'Login successful',
        token,
        data: {
          admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
          },
        },
      };

    } catch (error) {
      // Return error response in case of any internal issue
      return {
        status: false,
        statusCode: 500,
        message: 'Login failed: ' + error.message,
        data: null,
      };
    }
  }
}

export default new AdminHelper();
