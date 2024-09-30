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

    static async createRentable(data) {
        try {
            return await Rentable.create(data);
        } catch (error) {
            throw new Error('Database error occurred while adding rentable vehicle');
        }
    }
}

export default RentableRepo;
    