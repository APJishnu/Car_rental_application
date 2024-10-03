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

    // Fetch list of vehicles
    getVehicles: async () => {
      try {
        return await VehicleHelper.getVehicles(); // Create a helper function to fetch vehicles
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        throw new Error('Failed to fetch vehicles');
      }
    },

     
  getVehicleById: async (_, { id }) => {
    try {
      return await VehicleHelper.getVehicleById(id); // Fetch vehicle by ID
    } catch (error) {
      console.error("Error fetching vehicle:", error.message);
      throw new Error("Failed to fetch vehicle");
    }
  },

  },
 



  Mutation: {
    addVehicle: async (_, { input, primaryImage, otherImages }) => {
      const { name, description,transmission,fuelType,numberOfSeats, quantity, manufacturerId, year } = input;

      try {
        // Use helper method to handle image uploads and vehicle creation
        const vehicle = await VehicleHelper.createVehicle({
          name,
          description,
          transmission,fuelType,numberOfSeats,
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


    // Your current deleteVehicle mutation
    deleteVehicle: async (_, { id }) => {
      const deleted = await VehicleHelper.deleteVehicleById(id);
      if (!deleted) {
        throw new Error("Vehicle not found");
      }
      return { id }; // Optionally return the ID of the deleted vehicle
    },


    updateVehicle: async (_, { id, input }) => {
      const { name, description, quantity, year, primaryImage, otherImages } = input;

      console.log("backend input",input)
      try {
        const updatedVehicle = await VehicleHelper.updateVehicle({
          id,
          name,
          description,
          primaryImage,
          otherImages,
          quantity,
          year,
        });
        return updatedVehicle;
      } catch (error) {
        throw new Error(error.message || 'Failed to edit vehicle');
      }
    },


    

  },




};


export default vehicleResolvers;
