// src/backend/typesenseConfig.js
import Typesense from 'typesense';


const typesense = new Typesense.Client({
    nodes: [
        {
            host: 'e4usi1rjl26dtbacp-1.a1.typesense.net', // Replace with your Typesense host
            port: 443,
            protocol: 'https',
        },
    ],
    apiKey: 'tiRPshalhWslNmaZA3WZVQgw2VJbxWiX', // Replace with your Typesense API key
    connectionTimeoutSeconds: 2,
});

// Create a schema for the cars collection
const createSchema = async () => {
    const schema = {
        name: 'cars',
        enable_nested_fields: true, // Enable nested fields
        fields: [
            { name: 'id', type: 'string', facet: false },
            { name: 'pricePerDay', type: 'int32', facet: false },
            { name: 'availableQuantity', type: 'int32', facet: false },
            { name: 'vehicle', type: 'object', facet: false, fields: [
                { name: 'name', type: 'string', facet: false },
                { name: 'year', type: 'string', facet: false },
                { name: 'description', type: 'string', facet: false },
                { name: 'numberOfSeats', type: 'string', facet: false },
                { name: 'transmission', type: 'string', facet: true },
                { name: 'fuelType', type: 'string', facet: true },
                { name: 'primaryImageUrl', type: 'string', facet: false },
                { name: 'manufacturer', type: 'object', facet: false, fields: [
                    { name: 'name', type: 'string', facet: false },
                    { name: 'imageUrl', type: 'string', facet: false },
                ] },
            ] },
        ],
    };
    

    try {
        await typesense.collections().create(schema);
        console.log('Schema created successfully');
    } catch (error) {
        console.error('Error creating schema:', error);
    }
};


// createSchema()

// Function to add a vehicle to Typesense
const addVehicleToTypesense = async (vehicle) => {

    const document = {
        id: vehicle.id,
        pricePerDay: vehicle.pricePerDay,
        availableQuantity:vehicle.availableQuantity,
        vehicle:{
            name: vehicle.name,
            transmission: vehicle.transmission,
            fuelType: vehicle.fuelType,
            year:vehicle.year,
            numberOfSeats:vehicle.numberOfSeats,
            description:vehicle.description,
           
            primaryImageUrl: vehicle.primaryImageUrl,
            manufacturer:{
                name: vehicle.manufacturer,
                imageUrl:vehicle.imageUrl
            }  
        }  
       
    };

    try {
        await typesense.collections('cars').documents().upsert(document); // Upsert to handle adding or updating
        console.log('Vehicle added to Typesense successfully!');
    } catch (error) {
        console.error('Error adding vehicle to Typesense:', error);
    }
};

// Function to delete a vehicle from Typesense
const deleteVehicleFromTypesense = async (id) => {
    try {
        await typesense.collections('cars').documents(id).delete(); // Delete document from Typesense using the vehicle ID
        console.log(`Vehicle with ID ${id} deleted from Typesense successfully.`);
    } catch (error) {
        console.error(`Error deleting vehicle from Typesense: ${error.message}`);
    }
};


export { typesense, createSchema, addVehicleToTypesense , deleteVehicleFromTypesense  };
