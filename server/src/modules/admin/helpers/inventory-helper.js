// inventoryHelper.js
 // Adjust the path and include the .js extension

import inventoryRepo from "../repositories/inventory-repo.js";

const inventoryHelper = {
  fetchAllInventories: async () => {
    try {
      const inventories = await inventoryRepo.fetchAllInventories(); // Request to repo to fetch inventories
      return {
        status: true,
        statusCode: 200,
        message: "Inventories fetched successfully.",
        data: inventories,
      };
    } catch (error) {
      return {
        status: false,
        statusCode: 500,
        message: error.message || "Failed to fetch inventories.",
        data: [],
      };
    }
  },

  addInventory: async (name, location) => {
    try {
      const newInventory = await inventoryRepo.addInventory(name, location); // Request to repo to add inventory
      return {
        status: true,
        statusCode: 201,
        message: "Inventory added successfully.",
        inventory: newInventory,
      };
    } catch (error) {
      return {
        status: false,
        statusCode: 500,
        message: error.message || "Failed to add inventory.",
        inventory: null,
      };
    }
  },
};

export default inventoryHelper; // Exporting as default
