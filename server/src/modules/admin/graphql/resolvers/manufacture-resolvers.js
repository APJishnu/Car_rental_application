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
        throw new Error('Failed to fetch manufacturers');
      }
    },
  },

  Mutation: {
    addManufacturer: async (_, { name, country, image }) => {
      try {
        return await ManufacturerHelper.addManufacturer(name, country, image);
      } catch (error) {
        throw new Error(error.message || 'Failed to add manufacturer');
      }
    },

    editManufacturer: async (_, { id, name, country, image }) => {
      try {
        return await ManufacturerHelper.editManufacturer(id, name, country, image);
      } catch (error) {
        throw new Error(error.message || 'Failed to edit manufacturer');
      }
    },

    deleteManufacturer: async (_, { id }) => {
      try {
        return await ManufacturerHelper.deleteManufacturer(id); // Call the helper method
      } catch (error) {
        throw new Error('Failed to delete manufacturer');
      }
    },
  },
};

export default manufacturerResolver;
