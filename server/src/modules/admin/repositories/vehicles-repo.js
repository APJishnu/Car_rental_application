import Vehicle from '../models/vehicles-model.js';
import { deleteVehicleFromTypesense } from '../../../config/typesense-config.js';
import Rentable from '../models/rentable-vehicle-model.js';

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
      throw new Error('Failed to create vehicle');
    }
  }

  // Find a vehicle by name and manufacturer ID (to check for duplicates)
  static async findVehicleByNameAndManufacturer(name, manufacturerId, year) {
    try {

      const vehicle = await Vehicle.findOne({
        where: {
          name,
          manufacturerId,
          year,
        },
      });

      return vehicle;
    } catch (error) {
      throw new Error('Failed to find vehicle');
    }
  }


  static async getAllVehicles() {
    try {
      const vehicles = await Vehicle.findAll();  // Fetch all vehicle data
      return vehicles;
    } catch (error) {
      throw new Error('Failed to fetch vehicles');
    }
  }

  static async deleteVehicleById(id) {
    try {
        // Find all rentable entries associated with the vehicle
        const rentables = await Rentable.findAll({ where: { vehicleId: id } });

        // If there are rentables, iterate through each and soft delete it
        if (rentables.length > 0) {
            for (const rentable of rentables) {
                await rentable.destroy(); // This will set the deletedAt field
                await deleteVehicleFromTypesense(rentable.id); // Optionally delete from Typesense
            }
        }

        // Now, attempt to soft delete the vehicle from the Vehicles table
        const vehicle = await Vehicle.findByPk(id);
        if (!vehicle) {
            return null; // No rows were affected, meaning no vehicle was found with the given ID
        }
        await vehicle.destroy(); // This will set the deletedAt field

        return { id }; // Optionally return the ID of the deleted vehicle
    } catch (error) {
        throw new Error('Failed to delete vehicle and associated rentables');
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

 static async updateVehicleStatus(vehicleId, isRented) {
    try {
      const vehicle = await Vehicle.findByPk(vehicleId);
      const statusUpdatedVehicle =await vehicle.update({
        isRented:isRented
      });

    } catch (error) {
      throw new Error("Failed to update vehicle status");
    }
  }

}

export default VehicleRepository;
