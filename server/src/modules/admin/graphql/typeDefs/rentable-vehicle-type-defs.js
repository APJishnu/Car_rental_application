import { gql } from 'apollo-server-express';

const RentableTypeDefs = gql`
  scalar Float
  scalar Int

  type Manufacturer {
    id: ID!
    name: String!
    country: String!
    image: String
  }

  type Vehicle {
    id: ID!
    name: String!
    description: String
    quantity: String!
    year: String!
    primaryImageUrl: String
    otherImageUrls: [String]
    manufacturer: Manufacturer
  }

  type Rentable {
    id: ID!
    vehicleId: ID!
    pricePerDay: Float!
    availableQuantity: Int!
    vehicle: Vehicle  # Include vehicle details
  }

  type Query {
    getRentableVehicles: [Rentable!]!
  }

  type Mutation {
    addRentable(vehicleId: ID!, pricePerDay: Float!, availableQuantity: Int!): Rentable
    deleteRentableVehicle(id: ID!): Rentable 
  }
`;

export default RentableTypeDefs;
