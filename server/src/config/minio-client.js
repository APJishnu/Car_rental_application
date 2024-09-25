// config/minioClient.js
import Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'minio-access-key',
  secretKey: 'minio-secret-key',
});

export default minioClient;
