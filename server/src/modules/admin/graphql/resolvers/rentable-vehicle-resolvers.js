import RentableVehicleHelper from '../../helpers/rentable-vehicle-helper.js';
import { ApolloError } from 'apollo-server-express';
import Rentable from '../../models/rentable-vehicle-model.js'

const RentableResolvers = {
  Query: {
    getRentableVehicles: async () => {
      try {
        return await RentableVehicleHelper.getAllRentableVehicles(); // Call the helper method
      } catch (error) {
        throw new Error('Error fetching rentable vehicles: ' + error.message);
      }
    },
  },
  Mutation: {
    addRentable: async (_, { vehicleId, pricePerDay, availableQuantity }) => {
      try {
        return await RentableVehicleHelper.addRentable({ vehicleId, pricePerDay, availableQuantity });
      } catch (error) {
        throw new ApolloError(error.message || 'Error adding rentable vehicle', 'ADD_RENTABLE_ERROR');
      }
    },
    deleteRentableVehicle: async (_, { id }) => {
      try {
        return await RentableVehicleHelper.deleteRentableVehicle(id);
      } catch (error) {
        console.error('Error in deleteRentableVehicle resolver:', error);
        throw new Error('Failed to delete vehicle');
      }
    }
    
  },
};

export default RentableResolvers;
