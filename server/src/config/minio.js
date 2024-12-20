import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

import { Client } from "minio";

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT, // e.g., 'localhost'
  port: parseInt(process.env.MINIO_PORT, 10) || 9000,
  useSSL: process.env.MINIO_USE_SSL === "true", // true or false
  accessKey: process.env.MINIO_ROOT_USER,
  secretKey: process.env.MINIO_ROOT_PASSWORD,
});

export default minioClient;
