import { GraphQLUpload } from 'graphql-upload';
import VehicleHelper from '../../helpers/vehicle-helper.js'; // Helper for handling vehicle creation
import ManufacturerHelper from '../../helpers/manufacturer-helper.js'; // For fetching manufacturers

const vehicleResolvers = {
  Upload: GraphQLUpload, // Scalar for file uploads

  Query: {
    // Fetch list of manufacturers
    getManufacturers: async () => {
      try {
        return await ManufacturerHelper.getManufacturers();
      } catch (error) {
        console.error('Error fetching manufacturers:', error);
        throw new Error('Failed to fetch manufacturers');
      }
    },
  },

 
  Mutation: {
    addVehicle: async (_, { input, primaryImage, otherImages }) => {
      const { name, description, quantity, manufacturerId, year } = input;

      try {
        // Use helper method to handle image uploads and vehicle creation
        const vehicle = await VehicleHelper.createVehicle({
          name,
          description,
          primaryImage,
          otherImages,
          quantity,
          manufacturerId,
          year,
        });

        return vehicle;
      } catch (error) {
        console.error('Error in addVehicle mutation:', error.message);
        // Throw the specific error message to the client
        throw new Error(error.message || 'Failed to add vehicle');
      }
    },
  },
};


export default vehicleResolvers;
