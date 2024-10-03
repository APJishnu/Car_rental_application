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
            { name: 'vehicle', type: 'object', facet: false, fields: [
                { name: 'name', type: 'string', facet: false },
                { name: 'transmission', type: 'string', facet: true },
                { name: 'fuelType', type: 'string', facet: true },
                { name: 'primaryImageUrl', type: 'string', facet: false },
                { name: 'manufacturer', type: 'object', facet: false, fields: [
                    { name: 'name', type: 'string', facet: false },
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

// Uncomment the line below to create the schema when starting the server


// createSchema()

// Function to add a vehicle to Typesense
const addVehicleToTypesense = async (vehicle) => {

    const document = {
        id: vehicle.id,
        pricePerDay: vehicle.pricePerDay,
        vehicle:{
            name: vehicle.name,
            transmission: vehicle.transmission,
            fuelType: vehicle.fuelType,
            primaryImageUrl: vehicle.primaryImageUrl,
            manufacturer:{
                name: vehicle.manufacturer,
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


export { typesense, createSchema, addVehicleToTypesense };
