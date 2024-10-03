// src/graphql/resolvers.js

import RentableVehicleHelper from '../../helpers/rentable-vehicle-helper.js';
import { addVehicleToTypesense} from '../../../../config/typesense-config.js';



const RentableVehicleResolvers = {
  Query: {
    rentableVehicleWithId: async (_, { id }) => {
      return await RentableVehicleHelper.getRentableVehicleById(id);
    },
  },

  Mutation: {
    addVehicleToTypesense: async (_, { vehicle }) => {
      console.log(vehicle);
      try {
        // Prepare the document to be added to Typesense

        console.log(vehicle)
        const typesenseVehicle = {
          id:vehicle.id,
          name: vehicle.name,
          pricePerDay:vehicle.pricePerDay,
          transmission: vehicle.transmission,
          fuelType: vehicle.fuelType,
          manufacturer:vehicle.manufacturer,
          primaryImageUrl:vehicle.primaryImageUrl
          
        };

        await addVehicleToTypesense(typesenseVehicle);
        return 'Vehicle added to Typesense successfully';
      } catch (error) {
        console.error('Error adding vehicle to Typesense:', error);
        throw new Error('Failed to add vehicle');
      }
    },
  },
};

export default RentableVehicleResolvers;
