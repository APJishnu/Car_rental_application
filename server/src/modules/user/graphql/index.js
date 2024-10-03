// index.js

import RentableVehicleResolvers from "./resolvers/rentable-vehicle-resolver.js";
import RentableVehicleTypeDefs from "./typedefs/rentable-vehicle-type-defs.js";



const userTypeDefs = RentableVehicleTypeDefs; // Combine typeDefs
const userResolvers = RentableVehicleResolvers; // Combine resolvers

export { userTypeDefs, userResolvers };
