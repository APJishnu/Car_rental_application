// repositories/ManufacturerRepository.js
import Manufacturer from '../models/manufacturer-model.js'; // Adjust the import path as necessary
import Vehicle from '../models/vehicles-model.js'; // Import the Vehicle model
import { deleteVehicleFromTypesense } from '../../../config/typesense-config.js';

class ManufacturerRepository {
  static async createManufacturer({ name, country, imageUrl }) {
    try {
      const manufacturer = await Manufacturer.create({
        name,
        country,
        imageUrl,
      });

      console.log('manufacture saved')
      return manufacturer; // Return the newly created manufacturer
    } catch (error) {
      console.error('Error creating manufacturer in the database:', error);
      throw new Error('Failed to create manufacturer');
    }
  }

  
  static async findAll() {
    try {
      return await Manufacturer.findAll(); // Fetch all manufacturers from the database
    } catch (error) {
      console.error('Error fetching manufacturers from repository:', error);
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
      console.error('Error fetching manufacturer by ID:', error);
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
      console.error('Error finding Manufacturer:', error);
      throw new Error('Failed to find Manufacturer');
    }
  }


  static async deleteManufacturer(id) {
    try {
      // Delete vehicles associated with the manufacturer
      await Vehicle.destroy({
        where: { manufacturerId: id },
      });

      // Now delete the manufacturer
      const result = await Manufacturer.destroy({
        where: { id },
      });

      await deleteVehicleFromTypesense(id);       
      return result > 0; // Return true if a manufacturer was deleted
    } catch (error) {
      console.error('Error deleting manufacturer from database:', error);
      throw new Error('Failed to delete manufacturer');
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
      console.error('Error updating manufacturer:', error);
      throw new Error('Failed to update manufacturer in the repository');
    }
  }

  
}

export default ManufacturerRepository;
