// index.js
import authTypeDefs from './typeDefs/auth-type-defs.js';
import authResolvers from './resolvers/auth-resolvers.js';

import manufactureTypeDefs from './typeDefs/manufacture-type-defs.js';
import manufacturerResolver from './resolvers/manufacture-resolvers.js';
import vehicleTypeDefs from './typeDefs/vehicle-type-defs.js';
import vehicleResolvers from './resolvers/vehicle-resolvers.js';
import RentabletypeDefs from './typeDefs/rentable-vehicle-type-defs.js';
import RentableResolvers from './resolvers/rentable-vehicle-resolvers.js';
import BookingsTypeDefs from './typeDefs/bookings-type-defs.js';
import BookingsResolvers from './resolvers/bookings-resolver.js';

const adminTypeDefs = [authTypeDefs, manufactureTypeDefs,vehicleTypeDefs,RentabletypeDefs,BookingsTypeDefs]; // Combine typeDefs
const adminResolvers = [authResolvers, manufacturerResolver, vehicleResolvers,RentableResolvers,BookingsResolvers]; // Combine resolvers

export { adminTypeDefs, adminResolvers };
