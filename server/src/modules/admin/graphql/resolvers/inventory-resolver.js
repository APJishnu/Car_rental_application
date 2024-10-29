// inventoryResolvers.js

import inventoryHelper from "../../helpers/inventory-helper.js";


const inventoryResolvers = {
  Query: {
    fetchAllInventories: async () => {
      return await inventoryHelper.fetchAllInventories(); // Call helper to fetch inventories
    },
  },
  Mutation: {
    addInventory: async (_, { name, location }) => {
      return await inventoryHelper.addInventory(name, location); // Call helper to add inventory
    },
  },
};

export default inventoryResolvers;
