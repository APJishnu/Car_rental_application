// src/graphql/schema.js
import { adminTypeDefs, adminResolvers } from '../modules/admin/graphql/index.js';
import { userResolvers, userTypeDefs } from '../modules/user/graphql/index.js';


const typeDefs = [adminTypeDefs,userTypeDefs]; // Flatten typeDefs into one array
const resolvers = [adminResolvers,userResolvers]; // Merge resolvers

// Combine into a single schema (if needed, especially with tools like Apollo Federation)
export { typeDefs, resolvers };

