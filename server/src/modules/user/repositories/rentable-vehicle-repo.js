// src/graphql/repositories/RentableVehicleRepository.js

import Rentable from '../../admin/models/rentable-vehicle-model.js'; // Adjust the import based on your model path
import Vehicle from '../../admin/models/vehicles-model.js';
import Manufacturer from '../../admin/models/manufacturer-model.js';

class RentableVehicleRepository {
 static  async RentableVehicleFindById(id) {
    try {
      const rentableVehicle = await Rentable.findOne({
        where: { id },
        include: [
          {
            model: Vehicle,
            as: 'vehicle',
            include: [{ model: Manufacturer, as: 'manufacturer' }],
          },
        ],
      });

      if (!rentableVehicle) {
        throw new Error('Rentable vehicle not found');
      }

      console.log(rentableVehicle)

      return rentableVehicle; // This returns the entire Rentable object with included vehicle
    } catch (error) {
      throw new Error('Error fetching rentable vehicle: ' + error.message);
    }
  }

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
}

export default RentableVehicleRepository;
