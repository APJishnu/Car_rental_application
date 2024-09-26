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
}

export default ManufacturerRepository;
