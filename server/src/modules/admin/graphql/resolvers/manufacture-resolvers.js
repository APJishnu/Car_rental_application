// src/graphql/resolvers/manufacturer-resolvers.js
import { GraphQLUpload } from 'graphql-upload';
import ManufacturerHelper from '../../helpers/manufacturer-helper.js'; // Import the helper class



const manufacturerResolver = {
  Upload: GraphQLUpload,

  Query: {
    getManufacturers: async () => {
      try {
        return await ManufacturerHelper.getManufacturers(); // Fetch manufacturers using the helper
      } catch (error) {
        console.error('Error fetching manufacturers:', error);
        throw new Error('Failed to fetch manufacturers');
      }
    },
  },

  Mutation: {
    addManufacturer: async (_, { name, country, image }) => {
      try {
        // Call the helper method to handle the image upload and manufacturer creation
        const manufacturer = await ManufacturerHelper.addManufacturer(name, country, image);
        return manufacturer; // Return the newly created manufacturer
      } catch (error) {
        console.error('Error in addManufacturer mutation:', error);
        throw new Error('Failed to add manufacturer');
      }
    },
  },
};

export default manufacturerResolver;
