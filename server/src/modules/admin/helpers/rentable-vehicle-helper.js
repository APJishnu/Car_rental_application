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
    console.log("haii", query);
    try {
      if (query || transmission || fuelType || seats || priceSort) {
        // If there is a search query or any filters, call the search function
        console.log("haii", query);
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
  }) {
    try {
      const searchParams = {
        q: query || "*", 
        query_by: "vehicle.name,vehicle.manufacturer.name",
        filter_by: [],
        sort_by: priceSort === "asc" ? "pricePerDay:asc" : "pricePerDay:desc", 
      };

      if (
        transmission &&
        Array.isArray(transmission) &&
        transmission.length > 0
      ) {
        searchParams.filter_by.push(
          `vehicle.transmission:=[${transmission.join(",")}]`
        );
      }
      if (fuelType && Array.isArray(fuelType) && fuelType.length > 0) {
        searchParams.filter_by.push(
          `vehicle.fuelType:=[${fuelType.join(",")}]`
        );
      }
      if (seats && Array.isArray(seats) && seats.length > 0) {
        searchParams.filter_by.push(
          `vehicle.numberOfSeats:>=${Math.min(...seats)}`
        ); 
      }

      if (searchParams.filter_by.length > 0) {
        searchParams.filter_by = searchParams.filter_by.join(" && ");
      } else {
        delete searchParams.filter_by; 
      }

      // Perform the search in Typesense with the constructed searchParams
      const typesenseResponse = await typesense
        .collections("cars")
        .documents()
        .search(searchParams);

      // If no hits are found, return an empty array
      if (!typesenseResponse.hits.length) {
        return [];
      }

      const vehicleIds = typesenseResponse.hits.map((hit) => hit.document.id);

      const vehicles = await RentableRepo.findAllRentableByIds(vehicleIds);

      console.log(vehicles, "in searching cksabbc");
      return vehicles;
    } catch (error) {
      console.error("Error searching for rentable vehicles:", error);
      throw new Error("Failed to search rentable vehicles");
    }
  }

  static async addRentable(data) {
    try {
      const { vehicleId, pricePerDay, availableQuantity } = data;

      // Add custom validation logic
      if (!vehicleId || !pricePerDay || !availableQuantity) {
        throw new Error(
          "Missing required fields: vehicleId, pricePerDay, or availableQuantity"
        );
      }

      const existingVehicle = await RentableRepo.findRenatableVehicleById(
        vehicleId
      );
      if (existingVehicle) {
        throw new Error("This Vehicle is already rented");
      }

      const rentable = await RentableRepo.createRentable(data);
      if (rentable) {
        await VehicleRepository.updateVehicleStatus(vehicleId, true);
      }

      return rentable;
    } catch (error) {
      throw new Error(error.message || "Failed to add rentable vehicle");
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
      console.error("Error in RentableVehicleHelper:", error);
      throw new Error("Error occurred while deleting the vehicle");
    }
  }
}

export default RentableVehicleHelper;
