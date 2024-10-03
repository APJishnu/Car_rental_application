import VehicleRepository from '../repositories/vehicles-repo.js';
import minioClient from '../../../config/minio.js';

import mime from 'mime-types';

class VehicleHelper {
  static async createVehicle({ name, description,transmission,fuelType,numberOfSeats, primaryImage, otherImages, quantity, manufacturerId, year }) {
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
        transmission,fuelType,numberOfSeats,
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
      const uniqueFilename = `${folder}/${filename}`;
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

      const imageUrl = `http://localhost:9000/${process.env.MINIO_BUCKET_NAME}/${uniqueFilename}`;

      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error.message);
      throw new Error('Image upload failed');
    }
  }


  static async getVehicles() {
    try {
      return await VehicleRepository.getAllVehicles();  // Fetch all vehicles from the database
    } catch (error) {
      console.error('Error fetching vehicles:', error.message);
      throw new Error('Failed to fetch vehicles');
    }
  }



  static async deleteFromMinio(imageUrl) {
    try {

    const filePath = imageUrl.replace(`http://localhost:9000/${process.env.MINIO_BUCKET_NAME}/`, '');

      await new Promise((resolve, reject) => {
        minioClient.removeObject(process.env.MINIO_BUCKET_NAME, filePath, (error) => {
          if (error) {
            return reject(new Error('MinIO image deletion failed'));
          }
          resolve();
        });
      });
      console.log(`Image deleted successfully: ${filePath}`);
    } catch (error) {
      console.error('Error deleting image from MinIO:', error.message);
      throw new Error('Failed to delete image from MinIO');
    }
  }


  
  // Delete vehicle and its images from MinIO
  static async deleteVehicleById(id) {
    try {
      const vehicle = await VehicleRepository.getVehicleById(id);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }

      // Delete images from MinIO
      await this.deleteFromMinio(vehicle.primaryImageUrl);
      await Promise.all(vehicle.otherImageUrls.map(imageUrl => this.deleteFromMinio(imageUrl)));

      // Delete the vehicle from the database
      const deletedVehicle = await VehicleRepository.deleteVehicleById(id);
      return deletedVehicle;
    } catch (error) {
      console.error('Error deleting vehicle:', error.message);
      throw new Error(error.message || 'Failed to delete vehicle');
    }
  }


  static async getVehicleById(id) {
    try {
      // Call the repository method to delete the vehicle
      const vehicle = await VehicleRepository.getVehicleById(id);
      return vehicle; // Return the deleted vehicle
    } catch (error) {
      console.error('Error getting vehicle:', error.message);
      throw new Error(error.message || 'Failed to get vehicle');
    }
  }

  static async updateVehicle({ id, name, description, primaryImage, otherImages, quantity, year }) {
    try {


      // Check if a vehicle with the same name and manufacturerId already exists
      const existingVehicle = await VehicleRepository.findVehicleByNameAndManufacturer(name);
      if (existingVehicle) {
        throw new Error('Vehicle with the same name and manufacturer already exists');
      }


      const vehicle = await VehicleRepository.getVehicleById(id);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }
      let primaryImageUrl = vehicle.primaryImageUrl;
      let otherImageUrls = vehicle.otherImageUrls;

      // Handle primary image upload if new image is provided
      if (primaryImage) {
        primaryImageUrl = await this.uploadToMinio(primaryImage, `vehicle/${name}/primary`);
      }

      // Handle other images upload if new images are provided
      if (otherImages && otherImages.length > 0) {
        otherImageUrls = await Promise.all(
          otherImages.map((image) => this.uploadToMinio(image, `vehicle/${name}/other`))
        );
      }

      // Update the vehicle in the database
      const updatedVehicle = await VehicleRepository.updateVehicleById(id, {
        name,
        description,
        quantity,

        year,
        primaryImageUrl,
        otherImageUrls,
      });

      return updatedVehicle;
    } catch (error) {
      throw new Error(error.message || 'Failed to update vehicle');
    }
  }

}

export default VehicleHelper;
