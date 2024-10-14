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
      console.error('Error creating vehicle:', error);
      throw new Error('Failed to create vehicle');
    }
  }

  // Find a vehicle by name and manufacturer ID (to check for duplicates)
  static async findVehicleByNameAndManufacturer(name, manufacturerId, year) {
    try {

      if (!manufacturerId) {
        const vehicle = await Vehicle.findOne({
          where: {
            name,
            year,
          },
        });

        return vehicle;
      }
      const vehicle = await Vehicle.findOne({
        where: {
          name,
          manufacturerId,
          year,
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
      // Find all rentable entries associated with the vehicle
      const rentables = await Rentable.findAll({ where: { vehicleId: id } });

      if (rentables.length === 0) {
        console.warn(`No rentable vehicles found for vehicle ID: ${id}`);
        throw new Error('No rentable vehicles associated with this vehicle.');
      }

      // Iterate through each rentable entry and delete it from Typesense
      for (const rentable of rentables) {
        await deleteVehicleFromTypesense(rentable.id); // Delete from Typesense using rentable.id
      }
      // Delete the vehicle from the Vehicles table
      const deletedVehicle = await Vehicle.destroy({ where: { id } });

      if (deletedVehicle === 0) {
        return null; // No rows were affected, meaning no vehicle was found with the given ID
      }

      return { id }; // Optionally return the ID of the deleted vehicle
    } catch (error) {
      console.error('Error deleting vehicle and rentables:', error);
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
      console.log(vehicle, "in update status")
      const statusUpdatedVehicle =await vehicle.update({
        isRented:isRented
      });

      console.log("updated successfull",statusUpdatedVehicle)
    } catch (error) {
      console.error("Error updating vehicle status:", error);
      throw new Error("Failed to update vehicle status");
    }
  }

}

export default VehicleRepository;
