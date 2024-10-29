import { gql } from "apollo-server-express";

const RentableTypeDefs = gql`
  scalar Float
  scalar Int

  type Manufacturer {
    id: ID!
    name: String!
    country: String!
    image: String
  }

  type DeleteStatus {
    status: Boolean!
    statusCode: Int!
    message: String!
    data: String
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
    inventoryId: ID
    vehicle: Vehicle
  }

  type AddRentableResponse {
    status: Boolean!
    statusCode: Int!
    message: String!
    data: Rentable
  }
  type RentableResponse {
    status: String!
    statusCode: Int!
    message: String!
    data: [Rentable!]!
  }
  type Query {
    getRentableVehicles(query: String): RentableResponse!
  }

  type Mutation {
    addRentable(
      vehicleId: ID!
      pricePerDay: Float!
      availableQuantity: Int!
      inventoryId: ID!
    ): AddRentableResponse

    deleteRentableVehicle(id: ID!): DeleteStatus
  }
`;

export default RentableTypeDefs;
