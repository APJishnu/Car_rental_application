import Vehicle from '../models/vehicles-model.js';
import { deleteVehicleFromTypesense } from '../../../config/typesense-config.js';

class VehicleRepository {
  // Create a vehicle in the database
  static async createVehicle(vehicleData) {
    try {
      const vehicle = await Vehicle.create(vehicleData);
      return {
        id: vehicle.id,
        name: vehicle.name,
        description: vehicle.description,
        transmission: vehicle.transmission,
        fuelType: vehicle.fuelType,
        numberOfSeats: vehicle.numberOfSeats,
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

      if (!manufacturerId) {
        const vehicle = await Vehicle.findOne({
          where: {
            name,
          },
        });

        return vehicle;
      }
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


  static async getAllVehicles() {
    try {
      const vehicles = await Vehicle.findAll();  // Fetch all vehicle data
      return vehicles;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw new Error('Failed to fetch vehicles');
    }
  }



  static async deleteVehicleById(id) {
    try {
      const deletedVehicle = await Vehicle.destroy({
        where: { id },
      });

      if (deletedVehicle === 0) {
        // No rows were affected, meaning no vehicle was found with the given ID
        return null;
      }
      await deleteVehicleFromTypesense(id); 
      return { id }; // Optionally return the ID of the deleted vehicle
    } catch (error) {
      console.error('Error deleting vehicle from database:', error);
      throw new Error('Failed to delete vehicle');
    }
  }



  static async updateVehicleById(id, vehicleData) {
    try {
      const vehicle = await Vehicle.findByPk(id);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }

      await vehicle.update(vehicleData);
      return vehicle;
    } catch (error) {
      throw new Error('Failed to update vehicle');
    }
  }

  static async getVehicleById(id) {
    try {
      const vehicle = await Vehicle.findByPk(id);
      return vehicle;
    } catch (error) {
      throw new Error('Failed to fetch vehicle');
    }
  }
}

export default VehicleRepository;
