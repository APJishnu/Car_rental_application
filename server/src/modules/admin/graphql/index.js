// index.js
import authTypeDefs from './typeDefs/auth-type-defs.js';
// import vehicleTypeDefs from './vehicle-schema.js'; // Uncomment if needed
import authResolvers from './resolvers/auth-resolvers.js';
// import vehicleResolvers from '../resolvers/admin-resolvers/vehicle-resolvers.js'; // Create this file as needed

import manufactureTypeDefs from './typeDefs/manufacture-type-defs.js';
import manufacturerResolver from './resolvers/manufacture-resolvers.js';

const typeDefs = [authTypeDefs, manufactureTypeDefs]; // Combine typeDefs
const resolvers = [authResolvers, manufacturerResolver]; // Combine resolvers

export { typeDefs, resolvers };
