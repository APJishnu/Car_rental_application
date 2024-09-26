// graphql/typeDefs/vehicle-types.js
import { gql } from 'apollo-server-express';

const vehicleTypeDefs = gql`
  type Manufacturer {
    id: ID!
    name: String!
    country: String
    imageUrl: String
  }

  type Vehicle {
    id: ID!
    name: String!
    year: String!  # Include the year field
    manufacturer: Manufacturer!  # Relationship with Manufacturer
  }

  type Query {
    getVehicles: [Vehicle!]!  # Fetch a list of vehicles
  }

  type Mutation {
    addVehicle(manufacturerId: ID!, name: String!, year: String!): Vehicle!  # Adds a new vehicle with year
  }
`;

export default vehicleTypeDefs;
