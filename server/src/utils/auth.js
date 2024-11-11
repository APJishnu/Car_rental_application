import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (adminId) => {
  return jwt.sign({ id: adminId }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
};

