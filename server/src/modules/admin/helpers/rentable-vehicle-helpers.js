import Vehicle from '../../models/vehicle-models.js';
import { validateVehicle } from '../../utils/vechicle-validators.js'; // Assume you implement validation logic

class VehicleHelper {
    

    async getVehicles() {
        return await Vehicle.findAll();
    }

    async getVehicle(id) {
        return await Vehicle.findByPk(id);
    }

    async addVehicle(input) {
        // Validate input data
        const validationErrors = validateVehicle(input); // Implement server-side validation
        if (validationErrors.length) throw new Error(validationErrors.join(', '));

        // Create vehicle record in the database
        const vehicle = await Vehicle.create({
            name: input.name,
            description: input.description,
            price: input.price,
            primaryImage: input.primaryImage, // URL from S3
            otherImages: input.otherImages, // Array of URLs from S3
            quantity: input.quantity,
            manufacturerId: input.manufacturerId,
        });

        return vehicle; // Return the created vehicle record
    }

    async editVehicle(id, input) {
        const validationErrors = validateVehicle(input);
        if (validationErrors.length) throw new Error(validationErrors.join(', '));

        const vehicle = await Vehicle.findByPk(id);
        if (!vehicle) throw new Error('Vehicle not found');

        return await vehicle.update(input);
    }

    async deleteVehicle(id) {
        const vehicle = await Vehicle.findByPk(id);
        if (!vehicle) throw new Error('Vehicle not found');

        await vehicle.destroy();
        return true;
    }
}

export default new VehicleHelper(); // Export a singleton instance of VehicleHelper
