import ManufacturerRepository from '../repositories/manufacturer-repo.js';
import minioClient from '../../../config/minio.js';
import { v4 as uuidv4 } from 'uuid'; // To generate a unique filename
import mime from 'mime-types'; // Import to get the content type

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

class ManufacturerHelper {
  static async addManufacturer(name, country, image) {
    try {
      const { createReadStream, filename } = await image; // Get filename
      const stream = createReadStream();
      const uniqueFilename = `manufacturer/${uuidv4()}-${filename}`; // Generate a unique filename

      const contentType = mime.lookup(filename) || 'application/octet-stream'; // Default to octet-stream

      // Upload to MinIO
      await new Promise((resolve, reject) => {
        minioClient.putObject(process.env.MINIO_BUCKET_NAME, uniqueFilename, stream,{
            'Content-Type': contentType, // Set the content type for the uploaded file
            'Content-Disposition': 'inline', // Allow inline rendering in the browser
          }, (error) => {
            if (error) {
              console.error("Error uploading to MinIO:", error);
              return reject(new Error('MinIO upload failed'));
            }
      
          resolve();
        });
      });

      // Generate a presigned URL (expires in 24 hours)
      const imageUrl = await minioClient.presignedGetObject(process.env.MINIO_BUCKET_NAME, uniqueFilename);
   
      console.log("Image url",imageUrl)
      // Use the repository to create a new manufacturer in the database
      const manufacturer = await ManufacturerRepository.createManufacturer({
        name,
        country,
        imageUrl,
      });

      return manufacturer; // Return the newly created manufacturer
    } catch (error) {
      console.error('Error adding manufacturer:', error);
      throw new Error('Failed to add manufacturer');
    }
  }

  static async getManufacturers() {
    try {
      return await ManufacturerRepository.findAll(); // Use the repository to fetch manufacturers
    } catch (error) {
      console.error('Error in helper while fetching manufacturers:', error);
      throw new Error('Failed to fetch manufacturers in helper');
    }
  }
}

export default ManufacturerHelper;
