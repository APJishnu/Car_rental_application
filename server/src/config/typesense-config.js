// src/backend/typesenseConfig.js
import Typesense from "typesense";

const typesense = new Typesense.Client({
  nodes: [
    {
      host: "e4usi1rjl26dtbacp-1.a1.typesense.net", // Replace with your Typesense host
      port: 443,
      protocol: "https",
    },
  ],
  apiKey: "tiRPshalhWslNmaZA3WZVQgw2VJbxWiX", // Replace with your Typesense API key
  connectionTimeoutSeconds: 2,
});

// Create a schema for the cars collection
const createSchema = async () => {
  const schema = {
    name: "cars",
    enable_nested_fields: true, // Enable nested fields
    fields: [
      { name: "id", type: "string", facet: false }, // Used for document ID
      { name: "pricePerDay", type: "float", facet: true }, // Enable price filtering
      { name: "availableQuantity", type: "int32", facet: false }, // Optional field to know availability

      {
        name: "vehicle",
        type: "object",
        facet: false,
        fields: [
          { name: "name", type: "string", facet: false }, // Searchable field
          { name: "numberOfSeats", type: "int32", facet: true }, // Used for filtering
          { name: "transmission", type: "string", facet: true }, // Used for filtering
          { name: "fuelType", type: "string", facet: true }, // Used for filtering

          {
            name: "manufacturer",
            type: "object",
            facet: false,
            fields: [
              { name: "name", type: "string", facet: false }, // Searchable field
            ],
          },
        ],
      },
    ],
  };

  try {
    await typesense.collections().create(schema);
  } catch (error) {
  }
};

// createSchema()

// Function to add a vehicle to Typesense
const addVehicleToTypesense = async (vehicle) => {
  const document = {
    id: vehicle.id,
    pricePerDay: vehicle.pricePerDay,
    availableQuantity: vehicle.availableQuantity,
    vehicle: {
      name: vehicle.name,
      transmission: vehicle.transmission,
      fuelType: vehicle.fuelType,
      year: vehicle.year,
      numberOfSeats: vehicle.numberOfSeats,
      manufacturer: {
        name: vehicle.manufacturer,
      },
    },
  };

  try {
    await typesense.collections("cars").documents().upsert(document); // Upsert to handle adding or updating
  } catch (error) {
  }
};

// Function to delete a vehicle from Typesense
const deleteVehicleFromTypesense = async (id) => {
  try {
    await typesense.collections("cars").documents(id).delete(); // Delete document from Typesense using the vehicle ID
  } catch (error) {
  }
};

export {
  typesense,
  createSchema,
  addVehicleToTypesense,
  deleteVehicleFromTypesense,
};
