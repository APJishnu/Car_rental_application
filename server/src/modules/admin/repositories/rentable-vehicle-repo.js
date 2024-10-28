import Rentable from '../models/rentable-vehicle-model.js';
import Vehicle from '../models/vehicles-model.js';
import Manufacturer from '../models/manufacturer-model.js';
import VehicleRepository from './vehicles-repo.js';

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

    // In your RentableRepo.js
    static async findAllRentableByIds(ids) {
      try {
        const queryOptions = {
          include: [
            {
              model: Vehicle,
              as: 'vehicle',
              include: {
                model: Manufacturer,
                as: 'manufacturer',
              },
            },
          ],
        };
    
        // If ids are provided, add the where clause
        if (ids && ids.length > 0) {
          queryOptions.where = {
            id: ids,
          };
        }
    
        return await Rentable.findAll(queryOptions);
      } catch (error) {
        throw new Error('Database error occurred while fetching rentable vehicles by IDs: ' + error.message);
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
            // Find the rentable entry by ID
            const rentable = await Rentable.findByPk(id);
            
            if (!rentable) {
                throw new Error('Rentable not found');
            }

            if (rentable){
                await VehicleRepository.updateVehicleStatus(rentable.vehicleId, false);
              }

    
            // Soft delete the rentable entry
            await rentable.destroy(); // This will set the deletedAt field
    
            return true; // Optionally, you can return the ID of the deleted rentable
        } catch (error) {
            throw new Error('Database error occurred while deleting rentable vehicle: ' + error.message);
        }
    }
    
}

export default RentableRepo;
