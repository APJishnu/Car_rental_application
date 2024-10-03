import ManufacturerRepository from '../repositories/manufacturer-repo.js';
import minioClient from '../../../config/minio.js';
import mime from 'mime-types'; // Import to get the content type

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

class ManufacturerHelper {
  static async addManufacturer(name, country, image) {
    try {


      // Check if a vehicle with the same name and manufacturerId already exists
      const existingManufacture = await ManufacturerRepository.findManufacturerByName(name);
      if (existingManufacture) {
        throw new Error('Manufacture with the same Details already exists');
      }

      const { createReadStream, filename } = await image; // Get filename
      const stream = createReadStream();
      const uniqueFilename = `manufacturer/${filename}`; // Generate a unique filename

      const contentType = mime.lookup(filename) || 'application/octet-stream'; // Default to octet-stream

      // Upload to MinIO
      await new Promise((resolve, reject) => {
        minioClient.putObject(process.env.MINIO_BUCKET_NAME, uniqueFilename, stream, {
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
      const imageUrl = `http://localhost:9000/${process.env.MINIO_BUCKET_NAME}/${uniqueFilename}`;

      console.log(imageUrl)

      console.log("Image url", imageUrl)
      // Use the repository to create a new manufacturer in the database
      const manufacturer = await ManufacturerRepository.createManufacturer({
        name,
        country,
        imageUrl,
      });

      return manufacturer; // Return the newly created manufacturer
    } catch (error) {
      console.error('Error adding manufacturer:', error);
      throw new Error(error.message || 'Failed to add manufacturer');
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

  static async deleteManufacturer(id) {
    try {
      const result = await ManufacturerRepository.deleteManufacturer(id); // Call the repository
      return result; // Return true if deletion was successful
    } catch (error) {
      console.error('Error deleting manufacturer:', error);
      throw new Error('Failed to delete manufacturer');
    }
  }

  static async editManufacturer(id, name, country, image) {
    try {


      // Check if a vehicle with the same name and manufacturerId already exists
      const existingManufacture = await ManufacturerRepository.findManufacturerByName(name);
      if (existingManufacture) {
        throw new Error('Manufacture with the same Details already exists');
      }
      let imageUrl =null;
     
      if (image) {

        const { createReadStream, filename } = await image; // Get filename
        const stream = createReadStream();
        const uniqueFilename = `manufacturer/${filename}`; // Generate a unique filename
        const contentType = mime.lookup(filename); // Default to octet-stream

        // Upload to MinIO
        await new Promise((resolve, reject) => {
          minioClient.putObject(process.env.MINIO_BUCKET_NAME, uniqueFilename, stream, {
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
      imageUrl = `http://localhost:9000/${process.env.MINIO_BUCKET_NAME}/${uniqueFilename}`;
      }

      // Use the repository to update the manufacturer in the database
      const updatedManufacturer = await ManufacturerRepository.updateManufacturer(id, {
        name,
        country,
        ...(imageUrl ? { imageUrl } : {}), // Only include imageUrl if it's available
      });

      return updatedManufacturer; // Return the updated manufacturer
    } catch (error) {
      console.error('Error editing manufacturer:', error);
      throw new Error(error.message || 'Failed to edit manufacturer');
    }
  }
}

export default ManufacturerHelper;
