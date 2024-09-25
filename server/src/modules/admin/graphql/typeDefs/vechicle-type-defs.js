import { gql } from 'apollo-server-express';

const vehicleTypeDefs = gql`
  scalar Upload

  type Vehicle {
    id: ID!
    name: String!
    description: String!
    price: Float!
    primaryImage: String!
    otherImages: [String]
    quantity: Int!
    manufacturerId: Int!
    createdAt: String
    updatedAt: String
  }

  input VehicleInput {
    name: String!
    description: String!
    price: Float!
    otherImages: [String]
    quantity: Int!
    manufacturerId: Int!
  }

  type Query {
    getVehicles: [Vehicle]
    getVehicle(id: ID!): Vehicle
  }

  type Mutation {
    addVehicle(input: VehicleInput!, primaryImage: Upload!): Vehicle
    editVehicle(id: ID!, input: VehicleInput!): Vehicle
    deleteVehicle(id: ID!): Boolean
  }
`;

export default vehicleTypeDefs;
