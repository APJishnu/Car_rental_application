import RentableRepo from '../repositories/rentable-vehicle-repo.js';

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

      const rentable = await RentableRepo.createRentable(data);
      return rentable;
    } catch (error) {
      throw new Error(error.message || 'Failed to add rentable vehicle');
    }
  }
}

export default RentableVehicleHelper;
