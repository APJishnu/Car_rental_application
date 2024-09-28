import Vehicle from '../models/vehicles-model.js';

class VehicleRepository {
  // Create a vehicle in the database
  static async createVehicle(vehicleData) {
    try {
      const vehicle = await Vehicle.create(vehicleData);
      return {
        id: vehicle.id,
        name: vehicle.name,
        description: vehicle.description,
        quantity: vehicle.quantity,
        manufacturerId: vehicle.manufacturerId,
        year: vehicle.year,
        primaryImageUrl: vehicle.primaryImageUrl,
        otherImageUrls: vehicle.otherImageUrls,
      };
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw new Error('Failed to create vehicle');
    }
  }

  // Find a vehicle by name and manufacturer ID (to check for duplicates)
  static async findVehicleByNameAndManufacturer(name, manufacturerId) {
    try {
      const vehicle = await Vehicle.findOne({
        where: {
          name,
          manufacturerId,
        },
      });

      return vehicle;
    } catch (error) {
      console.error('Error finding vehicle:', error);
      throw new Error('Failed to find vehicle');
    }
  }
}
export default VehicleRepository;
