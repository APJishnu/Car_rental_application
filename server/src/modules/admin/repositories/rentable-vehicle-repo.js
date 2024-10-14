import Rentable from '../models/rentable-vehicle-model.js';
import Vehicle from '../models/vehicles-model.js';
import Manufacturer from '../models/manufacturer-model.js';

class RentableRepo {
    static async findAllRentable() {
        try {
            return await Rentable.findAll({
                include: [
                    {
                        model: Vehicle,
                        as: 'vehicle', // Use the alias defined in Vehicle
                        include: {
                            model: Manufacturer, // Include the Manufacturer model
                            as: 'manufacturer', // Use the alias defined in Manufacturer
                        },
                    },
                ],
            });
        } catch (error) {
            throw new Error('Database error occurred while fetching rentable vehicles: ' + error.message);
        }
    }


    // Find a vehicle by name and manufacturer ID (to check for duplicates)
  static async findRenatableVehicleById(vehicleId) {
    try {

      if (vehicleId) {
        const rentable = await Rentable.findOne({
          where: {
            vehicleId
          },
        });

        return rentable;
      }
    
    } catch (error) {
      console.error('Error finding vehicle:', error);
      throw new Error('Failed to find vehicle');
    }
  }

    
    static async createRentable(data) {
        try {
            return await Rentable.create(data);
        } catch (error) {
            throw new Error('Database error occurred while adding rentable vehicle');
        }
    }

    // Add the delete method
    static async deleteRentableById(id) {
        try {
            const deletedRentable = await Rentable.destroy({
                where: { id },
            });

            if (deletedRentable === 0) {
                throw new Error('Vehicle not found');
            }

            

            return deletedRentable; // Optionally, you can return a success message or the ID of the deleted vehicle
        } catch (error) {
            throw new Error('Database error occurred while deleting rentable vehicle: ' + error.message);
        }
    }
}

export default RentableRepo;
