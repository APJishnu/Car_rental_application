import { deleteVehicleFromTypesense } from '../../../config/typesense-config.js';
import RentableRepo from '../repositories/rentable-vehicle-repo.js';
import VehicleRepository from '../repositories/vehicles-repo.js';

class RentableVehicleHelper {
  static async getAllRentableVehicles() {
    try {
      const rentable = await RentableRepo.findAllRentable(); // Call the repository method
      console.log(rentable)
      return rentable
    } catch (error) {
      throw new Error('Error in RentableVehicleHelper: ' + error.message);
    }
  }


  static async addRentable(data) {
    try {
      const { vehicleId, pricePerDay, availableQuantity } = data;

      // Add custom validation logic
      if (!vehicleId || !pricePerDay || !availableQuantity) {
        throw new Error('Missing required fields: vehicleId, pricePerDay, or availableQuantity');
      }

      // Check if a vehicle with the same name and manufacturerId already exists
      const existingVehicle = await RentableRepo.findRenatableVehicleById(vehicleId);
      if (existingVehicle) {
        throw new Error('This Vehicle is already rented');
      }

      const rentable = await RentableRepo.createRentable(data);
      if (rentable){
        await VehicleRepository.updateVehicleStatus(vehicleId, true);
      }
      
      return rentable;
    } catch (error) {
      throw new Error(error.message || 'Failed to add rentable vehicle');
    }
  }

  static async deleteRentableVehicle(id) {
    try {
      const deletedVehicle = await RentableRepo.deleteRentableById(id);
      
      if (!deletedVehicle) {
        throw new Error('Vehicle not found');
      }
      await deleteVehicleFromTypesense(id);

      return deletedVehicle.id; // Return the deleted vehicle data if needed
    } catch (error) {
      console.error('Error in RentableVehicleHelper:', error);
      throw new Error('Error occurred while deleting the vehicle');
    }
  }
}

export default RentableVehicleHelper;
