import { GraphQLUpload } from 'graphql-upload';
import VehicleHelper from '../../helpers/vehicle-helper.js'; // Helper for handling vehicle creation
import ManufacturerHelper from '../../helpers/manufacturer-helper.js'; // For fetching manufacturers
import RentableVehicleHelper from '../../helpers/rentable-vehicle-helper.js';
import urlToFile from '../../../../utils/url-to-file.js';
import ExcelHandler from '../../../../utils/excel-handler.js'


// Your resolver and helper function logic

const vehicleResolvers = {
  Upload: GraphQLUpload, // Scalar for file uploads

  Query: {
    // Fetch list of manufacturers
    getManufacturers: async () => {
      try {
        return await ManufacturerHelper.getManufacturers();

      } catch (error) {
        throw new Error('Failed to fetch manufacturers');
      }
    },

    // Fetch list of vehicles
    getVehicles: async () => {
      try {
        const vehicles = await VehicleHelper.getVehicles(); // Create a helper function to fetch vehicles
        const rentedVehicleIds = await  RentableVehicleHelper.getAllRentableVehicles(); // Fetch the rented vehicle IDs
        return vehicles
      } catch (error) {
        throw new Error('Failed to fetch vehicles');
      }
    },


    getVehicleById: async (_, { id }) => {
      try {
        return await VehicleHelper.getVehicleById(id); // Fetch vehicle by ID
      } catch (error) {
        throw new Error("Failed to fetch vehicle");
      }
    },

  },




  Mutation: {
    
    addVehicle: async (_, { input, primaryImage, otherImages }) => {
      const { name, description, transmission, fuelType, numberOfSeats, quantity, manufacturerId, year } = input;

      try {
        // Use helper method to handle image uploads and vehicle creation
        const vehicle = await VehicleHelper.createVehicle({
          name,
          description,
          transmission, fuelType, numberOfSeats,
          primaryImage,
          otherImages,
          quantity,
          manufacturerId,
          year,
        });

        return vehicle;
      } catch (error) {
        // Throw the specific error message to the client
        throw new Error(error.message || 'Failed to add vehicle');
      }
    },

    async addVehicleExcel(_, { excelFile }) {
      try {
        const { createReadStream } = await excelFile;
        const buffer = await ExcelHandler.getExcelBuffer(createReadStream);
        const jsonData = await ExcelHandler.parseExcel(buffer);

        let processedVehiclesCount = 0;

        for (const row of jsonData) {
          // Convert primary image URL to File
          const primaryImageFile = await urlToFile(row.primaryImageUrl);

          // Convert other image URLs to Files
          const otherImageFiles = row.otherImageUrls
            ? await Promise.all(
                row.otherImageUrls.split(',').map((url) => urlToFile(url.trim()))
              )
            : [];

          const vehicleData = {
            name: row.name,
            description: row.description,
            transmission: row.transmission,
            fuelType: row.fuelType,
            numberOfSeats: row.numberOfSeats.toString(),
            primaryImage: primaryImageFile,
            otherImages: otherImageFiles,
            quantity: row.quantity.toString(),
            manufacturerId: "43",
            year: row.year.toString(),
          };

          try {
            await VehicleHelper.createVehicle(vehicleData);
            processedVehiclesCount++;
          } catch (error) {
            throw new Error(error.message || 'Failed to add vehicle');
          }
        }

        return {
          success: true,
          processedVehiclesCount,
          message: `Successfully processed ${processedVehiclesCount} vehicles.`,
        };
      } catch (error) {
        return {
          success: false,
          message: 'Failed to process the Excel file: ' + error.message,
          processedVehiclesCount: 0, // Return zero in case of failure
        };
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
