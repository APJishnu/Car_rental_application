// index.js
import authTypeDefs from './auth-schema.js';
import vehicleTypeDefs from './vechicle-schema.js';
import authResolvers from '../resolvers/admin-resolvers/auth-resolvers.js'
import vehicleResolvers from '../resolvers/admin-resolvers/vehicle-resolvers.js'; // Create this file as needed

const typeDefs = [authTypeDefs, vehicleTypeDefs];
const resolvers = [authResolvers, vehicleResolvers]; // Combine resolvers

export { typeDefs, resolvers };
