import {
  deleteVehicleFromTypesense,
  typesense,
} from "../../../config/typesense-config.js";
import RentableRepo from "../repositories/rentable-vehicle-repo.js";
import VehicleRepository from "../repositories/vehicles-repo.js";

class RentableVehicleHelper {
  static async getAllRentableVehicles(
    query,
    transmission,
    fuelType,
    seats,
    priceSort
  ) {
    try {
      if (query || transmission || fuelType || seats || priceSort) {
        // If there is a search query or any filters, call the search function
        return await RentableVehicleHelper.searchRentableVehicles({
          query: query,
          transmission: transmission,
          fuelType: fuelType,
          seats: seats,
          priceSort: priceSort,
        });
      } else {
        // If no input is provided, fetch all rentable vehicles
        return await RentableRepo.findAllRentable();
      }
    } catch (error) {
      throw new Error("Error in RentableVehicleHelper: " + error.message);
    }
  }

  static async searchRentableVehicles({
    query,
    transmission,
    fuelType,
    seats,
    priceSort,
    priceRange,
  }) {
    try {
      // Build search params for Typesense
      const searchParams = {
        q: query || "*", // Fallback to all results if no query
        query_by: "vehicle.name,vehicle.manufacturer.name", // Search within these fields
        filter_by: [], // Will hold filters
        sort_by: `pricePerDay:${priceSort || "asc"}`,
      };

      // Transmission filter
      if (
        transmission &&
        Array.isArray(transmission) &&
        transmission.length > 0
      ) {
        searchParams.filter_by.push(
          `vehicle.transmission:=[${transmission.join(",")}]`
        );
      }

      // Fuel type filter
      if (fuelType && Array.isArray(fuelType) && fuelType.length > 0) {
        searchParams.filter_by.push(
          `vehicle.fuelType:=[${fuelType.join(",")}]`
        );
      }

      // Seats filter
      if (seats && Array.isArray(seats) && seats.length > 0) {
        searchParams.filter_by.push(
          `vehicle.numberOfSeats:=[${seats.join(",")}]`
        );
      }

      // Price range filter
      if (priceRange && Array.isArray(priceRange) && priceRange.length === 2) {
        const [minPrice, maxPrice] = priceRange;
        searchParams.filter_by.push(
          `pricePerDay:>=${minPrice} && pricePerDay:<=${maxPrice}`
        );
      }

      // If there are filters, join them with '&&', otherwise, delete the filter key
      if (searchParams.filter_by.length > 0) {
        searchParams.filter_by = searchParams.filter_by.join(" && ");
      } else {
        delete searchParams.filter_by; // No filters, so remove the key
      }

      let vehicleIds;
      try {
        // Perform the search using Typesense
        const typesenseResponse = await typesense
          .collections("cars")
          .documents()
          .search(searchParams);

        // Extract the vehicle IDs from the search results
        vehicleIds = typesenseResponse.hits.map((hit) => hit.document.id);
      } catch (error) {
        // If Typesense is unreachable, log the error and continue with fetching all data
        vehicleIds = null; // Set vehicleIds to null to fetch all vehicles
      }

      if (!vehicleIds || vehicleIds.length === 0) {
        return [];
      }
      // Fetch vehicles based on IDs if found, otherwise fetch all
      const vehicles = await RentableRepo.findAllRentableByIds(vehicleIds);
      return vehicles;
    } catch (error) {
      throw new Error("Failed to search rentable vehicles");
    }
  }

  static async addRentable(data) {
    try {
      const { vehicleId, pricePerDay, availableQuantity, inventoryId } = data;

      // Add custom validation logic
      if (!vehicleId || !pricePerDay || !availableQuantity || !inventoryId) {
        return {
          status: false,
          statusCode: 400,
          message:
            "Missing required fields: vehicleId, pricePerDay, availableQuantity, or inventoryLocation",
          data: null,
        };
      }

      const existingVehicle = await RentableRepo.findRenatableVehicleById(
        vehicleId
      );
      if (existingVehicle) {
        return {
          status: false,
          statusCode: 409, // Conflict
          message: "This Vehicle is already rented",
          data: null,
        };
      }

      const rentable = await RentableRepo.createRentable({
        vehicleId,
        pricePerDay,
        availableQuantity,
        inventoryId, // Include inventory location in the data
      });

      if (rentable) {
        await VehicleRepository.updateVehicleStatus(vehicleId, true);
        return {
          status: true,
          statusCode: 201, // Created
          message: "Rentable vehicle added successfully",
          data: rentable, // Return the created rentable object
        };
      }

      return {
        status: false,
        statusCode: 500, // Internal Server Error
        message: "Failed to add rentable vehicle",
        data: null,
      };
    } catch (error) {
      return {
        status: false,
        statusCode: 500, // Internal Server Error
        message: error.message || "Failed to add rentable vehicle",
        data: null,
      };
    }
  }

  static async deleteRentableVehicle(id) {
    try {
      const deletedVehicle = await RentableRepo.deleteRentableById(id);

      if (!deletedVehicle) {
        return {
          status: false,
          statusCode: 203,
          message: "error delete rentable",
          data: null,
        };
      }
      await deleteVehicleFromTypesense(id);

      return {
        status: true,
        statusCode: 200,
        message: "successfull deleted rentable",
        data: null,
      }; // Return the deleted vehicle data if needed
    } catch (error) {
      throw new Error("Error occurred while deleting the vehicle");
    }
  }
}

export default RentableVehicleHelper;
