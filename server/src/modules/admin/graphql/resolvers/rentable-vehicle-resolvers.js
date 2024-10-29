import RentableVehicleHelper from '../../helpers/rentable-vehicle-helper.js';
import { ApolloError } from 'apollo-server-express';

const RentableResolvers = {
  Query: {
    getRentableVehicles: async (_, { query ,  }) => {
      try {
          const vehicles = await RentableVehicleHelper.getAllRentableVehicles(query);
     
        return {
          status: "success",                  // Indicate the status of the response
          statusCode: 200,                    // HTTP status code
          message: "Vehicles fetched successfully", // A message describing the response
          data: vehicles                       // The actual data being returned
        };
      } catch (error) {
        throw new ApolloError('Error fetching rentable vehicles: ' + error.message, 'FETCH_VEHICLES_ERROR');
      }
    },
  },

  Mutation: {
    addRentable: async (_, { vehicleId, pricePerDay, availableQuantity, inventoryId }) => {
      try {
        // Call the helper method to add the rentable vehicle
        const response = await RentableVehicleHelper.addRentable({ 
          vehicleId, 
          pricePerDay, 
          availableQuantity, 
          inventoryId
        });
        // Check the response and throw an error if status is false
        if (!response.status) {
          throw new ApolloError(response.message, response.statusCode);
        }
    
        // If successful, return the response data
        return response;
      } catch (error) {
        // Handle any unexpected errors
        throw new ApolloError(error.message || 'Error adding rentable vehicle', 'ADD_RENTABLE_ERROR');
      }
    },


    deleteRentableVehicle: async (_, { id }) => {
      try {
        const result = await RentableVehicleHelper.deleteRentableVehicle(id);
        
        return {
          status: true,                    // Indicate success
          statusCode: 200,                 // HTTP status code for successful operation
          message: "Rentable vehicle deleted successfully", // A message describing the response
          data: result.data                     // The actual data being returned (if applicable)
        };
      } catch (error) {
        throw new ApolloError('Failed to delete vehicle: ' + error.message, 'DELETE_VEHICLE_ERROR');
      }
    }
    
  },
};

export default RentableResolvers;
