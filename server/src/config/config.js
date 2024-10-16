import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

export const DB_HOST = process.env.DB_HOST
export const DB_NAME = process.env.DB_NAME 
export const DB_USER = process.env.DB_USER 
export const DB_PASS = process.env.DB_PASS 
export const SECRET_KEY = process.env.SECRET_KEY 
export const JWT_SECRET = process.env.JWT_SECRET
