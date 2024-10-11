// index.js

import userAuthResolvers from "./resolvers/auth-resolver.js";
import RentableVehicleResolvers from "./resolvers/rentable-vehicle-resolver.js";
import VehicleBookingResolver from "./resolvers/vehicle-booking-resolver.js";
import userAuthTypeDefs from "./typedefs/auth-type-defs.js";
import RentableVehicleTypeDefs from "./typedefs/rentable-vehicle-type-defs.js";
import VehicleBookingTypeDefs from "./typedefs/vehicle-booking-type-defs.js";



const userTypeDefs = [RentableVehicleTypeDefs,userAuthTypeDefs,VehicleBookingTypeDefs]; // Combine typeDefs
const userResolvers = [RentableVehicleResolvers,userAuthResolvers,VehicleBookingResolver]; // Combine resolvers

export { userTypeDefs, userResolvers };
