// src/graphql/resolvers.js

import RentableVehicleHelperUser from "../../helpers/rentable-vehicle-helper.js";
import { addVehicleToTypesense } from "../../../../config/typesense-config.js";

const RentableVehicleResolvers = {
  Query: {
    rentableVehicleWithId: async (_, { id }) => {
      return await RentableVehicleHelperUser.getRentableVehicleById(id);
    },

    getRentableVehiclesUser: async () => {
      try {
          const vehicles = await RentableVehicleHelperUser.getAllRentableVehicles();
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
    addVehicleToTypesense: async (_, { vehicle }) => {
      try {
        // Prepare the document to be added to Typesense
        const typesenseVehicle = {
          id: vehicle.id,
          name: vehicle.name,
          pricePerDay: vehicle.pricePerDay,
          transmission: vehicle.transmission,
          fuelType: vehicle.fuelType,
          year: vehicle.year,
          availableQuantity: vehicle.availableQuantity,
          manufacturer: vehicle.manufacturer,
          imageUrl: vehicle.imageUrl,
          numberOfSeats: vehicle.numberOfSeats,
          primaryImageUrl: vehicle.primaryImageUrl,
          description: vehicle.description,
        };

        await addVehicleToTypesense(typesenseVehicle);
        return "Vehicle added to Typesense successfully";
      } catch (error) {
        throw new Error("Failed to add vehicle");
      }
    },
  },
};

export default RentableVehicleResolvers;
