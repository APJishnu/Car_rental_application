// src/graphql/schema.js
import { adminTypeDefs, adminResolvers } from '../modules/admin/graphql/index.js';


const typeDefs = adminTypeDefs; // Flatten typeDefs into one array
const resolvers = adminResolvers; // Merge resolvers

// Combine into a single schema (if needed, especially with tools like Apollo Federation)
export { typeDefs, resolvers };

