// repositories/ManufacturerRepository.js
import Manufacturer from '../models/manufacturer-model.js'; // Adjust the import path as necessary

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
}

export default ManufacturerRepository;
