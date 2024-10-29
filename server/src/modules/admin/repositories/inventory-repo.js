// inventoryRepo.js

import Inventory from "../models/inventory-models.js";


const inventoryRepo = {
  fetchAllInventories: async () => {
    try {
      return await Inventory.findAll(); // Fetch all inventory records
    } catch (error) {
      throw new Error("Failed to fetch inventories."); // Throw an error to be caught in the helper
    }
  },

  addInventory: async (name, location) => {
    try {
      return await Inventory.create({ name, location }); // Create a new inventory record
    } catch (error) {
      throw new Error("Failed to add inventory."); // Throw an error to be caught in the helper
    }
  },
};

export default inventoryRepo; // Exporting as default
