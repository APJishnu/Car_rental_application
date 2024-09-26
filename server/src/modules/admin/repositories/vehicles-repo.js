// repositories/vehicles-repo.js
import Vehicle from '../models/vehicles-model.js'; // Adjust the path according to your project structure

class VehicleRepository {
  // Add a method to find a vehicle by name and manufacturer ID
  static async findVehicleByNameAndManufacturer(name, manufacturerId) {
    return await Vehicle.findOne({
      where: {
        name,
        manufacturerId,
      },
    });
  }

  // Update the create method to include the year
  static async createVehicle({ name, manufacturerId, year }) {
    return await Vehicle.create({
      name,
      manufacturerId,
      year,  // Add the year here
    });
  }

  static async getVehicles() {
    return await Vehicle.findAll();
  }
}

export default VehicleRepository;
