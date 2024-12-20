// repositories/ManufacturerRepository.js
import Manufacturer from '../models/manufacturer-model.js'; // Adjust the import path as necessary
import Vehicle from '../models/vehicles-model.js'; // Import the Vehicle model
import { deleteVehicleFromTypesense } from '../../../config/typesense-config.js';
import Rentable from '../models/rentable-vehicle-model.js';

class ManufacturerRepository {
  static async createManufacturer({ name, country, imageUrl }) {
    try {
      const manufacturer = await Manufacturer.create({
        name,
        country,
        imageUrl,
      });

      return manufacturer; // Return the newly created manufacturer
    } catch (error) {
      throw new Error('Failed to create manufacturer');
    }
  }


  static async findAll() {
    try {
      return await Manufacturer.findAll(); // Fetch all manufacturers from the database
    } catch (error) {
      throw new Error('Failed to fetch manufacturers from repository');
    }
  }

  // Method to find a manufacturer by ID
  static async findManufacturerById(manufacturerId) {
    try {
      const manufacturer = await Manufacturer.findOne({
        where: { id: manufacturerId },
      });
      if (!manufacturer) {
        throw new Error(`Manufacturer with ID ${manufacturerId} not found`);
      }
      return manufacturer;
    } catch (error) {
      throw new Error('Failed to fetch manufacturer');
    }
  }


  // Find a vehicle by name and manufacturer ID (to check for duplicates)
  static async findManufacturerByName(name) {
    try {
      const manufacture = await Manufacturer.findOne({
        where: {
          name,
        },
      });

      return manufacture;
    } catch (error) {
      throw new Error('Failed to find Manufacturer');
    }
  }


  static async deleteManufacturer(id) {
    try {
      // Step 1: Find all vehicles associated with the manufacturer
      const vehicles = await Vehicle.findAll({ where: { manufacturerId: id } });
  
      if (vehicles.length === 0) {
      }
  
      // Step 2: For each vehicle, find and soft delete associated rentables
      for (const vehicle of vehicles) {
        const rentables = await Rentable.findAll({ where: { vehicleId: vehicle.id } });
  
        for (const rentable of rentables) {
          // Soft delete rentable entry
          await rentable.destroy(); // This will set the deletedAt field
  
          // Optionally delete from Typesense
          await deleteVehicleFromTypesense(rentable.id);
        }
        // Step 3: Soft delete vehicle entry
        await vehicle.destroy(); // This will set the deletedAt field
      }
  
      // Step 4: Soft delete the manufacturer itself
      const manufacturer = await Manufacturer.findByPk(id);
      if (!manufacturer) {
        throw new Error('Manufacturer not found or already deleted');
      }
      await manufacturer.destroy(); // This will set the deletedAt field
  
      return true; // Return true if a manufacturer was deleted
    } catch (error) {
      throw new Error('Failed to delete manufacturer and associated data');
    }
  }
  


  static async updateManufacturer(id, updates) {
    try {
      const manufacturer = await Manufacturer.findByPk(id);
      if (!manufacturer) {
        throw new Error('Manufacture not found');
      }

      await manufacturer.update(updates);

      return manufacturer;
    } catch (error) {
      throw new Error('Failed to update manufacturer in the repository');
    }
  }


}

export default ManufacturerRepository;
