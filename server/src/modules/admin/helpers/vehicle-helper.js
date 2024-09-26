// helpers/vehicle-helper.js
import VehicleRepository from '../repositories/vehicles-repo.js';
import ManufacturerRepository from '../repositories/manufacturer-repo.js';

class VehicleHelper {
  static async addVehicle(name, manufacturerId, year) {
    try {
      // Ensure the manufacturer exists
      const manufacturer = await ManufacturerRepository.findManufacturerById(manufacturerId);
      if (!manufacturer) {
        throw new Error('Manufacturer not found');
      }

      // Check if the vehicle with the same name and manufacturer already exists
      const existingVehicle = await VehicleRepository.findVehicleByNameAndManufacturer(name, manufacturerId);
      if (existingVehicle) {
        throw new Error('A vehicle with this name and manufacturer already exists');
      }

      // Create the vehicle
      const vehicle = await VehicleRepository.createVehicle({ name, manufacturerId, year });
      
      // Return vehicle data with manufacturer info
      return {
        id: vehicle.id,
        name: vehicle.name,
        year: vehicle.year,  // Include the year in the return object
        manufacturer: {
          id: manufacturer.id,
          name: manufacturer.name,
        },
      };
    } catch (error) {
      console.error('Error adding vehicle:', error);
      throw new Error('Failed to add vehicle');
    }
  }

  static async getVehicles() {
    return await VehicleRepository.getVehicles();
  }
}

export default VehicleHelper;
