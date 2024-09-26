// index.js
import authTypeDefs from './typeDefs/auth-type-defs.js';
import authResolvers from './resolvers/auth-resolvers.js';

import manufactureTypeDefs from './typeDefs/manufacture-type-defs.js';
import manufacturerResolver from './resolvers/manufacture-resolvers.js';
import vehicleTypeDefs from './typeDefs/add-vehicles-type-defs.js';
import vehicleResolver from './resolvers/add-vehicles-resolvers.js';

const adminTypeDefs = [authTypeDefs, manufactureTypeDefs,vehicleTypeDefs]; // Combine typeDefs
const adminResolvers = [authResolvers, manufacturerResolver,vehicleResolver]; // Combine resolvers

export { adminTypeDefs, adminResolvers };
