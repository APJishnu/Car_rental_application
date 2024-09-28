import VehicleRepository from '../repositories/vehicles-repo.js';
import minioClient from '../../../config/minio.js';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';

class VehicleHelper {
  static async createVehicle({ name, description, primaryImage, otherImages, quantity, manufacturerId, year }) {
    try {
      // Check if a vehicle with the same name and manufacturerId already exists
      const existingVehicle = await VehicleRepository.findVehicleByNameAndManufacturer(name, manufacturerId);
      if (existingVehicle) {
        throw new Error('Vehicle with the same name and manufacturer already exists');
      }

      // Upload the primary image to MinIO
      const primaryImageUrl = await this.uploadToMinio(primaryImage, `vehicle/${name}/primary`);

      // Upload the other images to MinIO
      const otherImageUrls = await Promise.all(
        otherImages.map((image) => this.uploadToMinio(image, `vehicle/${name}/other`))
      );

      // Save vehicle details in the database
      const vehicle = await VehicleRepository.createVehicle({
        manufacturerId,
        year,
        name,
        description,
        quantity,
        primaryImageUrl,
        otherImageUrls,
      });

      return vehicle;
    } catch (error) {
      console.error('Error adding vehicle:', error.message);
      // Propagate specific errors for the front-end to handle
      throw new Error(error.message || 'Failed to add vehicle');
    }
  }

  static async uploadToMinio(file, folder) {
    try {
      const { createReadStream, filename } = await file;
      const stream = createReadStream();
      const uniqueFilename = `${folder}/${uuidv4()}-${filename}`;
      const contentType = mime.lookup(filename) || 'application/octet-stream';

      await new Promise((resolve, reject) => {
        minioClient.putObject(
          process.env.MINIO_BUCKET_NAME,
          uniqueFilename,
          stream,
          { 'Content-Type': contentType },
          (error) => {
            if (error) {
              return reject(new Error('MinIO upload failed'));
            }
            resolve();
          }
        );
      });

      const imageUrl = await minioClient.presignedGetObject(
        process.env.MINIO_BUCKET_NAME,
        uniqueFilename
      );

      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error.message);
      throw new Error('Image upload failed');
    }
  }

}

export default VehicleHelper;
