// index.js

import userAuthResolvers from "./resolvers/auth-resolver.js";
import RentableVehicleResolvers from "./resolvers/rentable-vehicle-resolver.js";
import userAuthTypeDefs from "./typedefs/auth-type-defs.js";
import RentableVehicleTypeDefs from "./typedefs/rentable-vehicle-type-defs.js";



const userTypeDefs = [RentableVehicleTypeDefs,userAuthTypeDefs]; // Combine typeDefs
const userResolvers = [RentableVehicleResolvers,userAuthResolvers]; // Combine resolvers

export { userTypeDefs, userResolvers };
