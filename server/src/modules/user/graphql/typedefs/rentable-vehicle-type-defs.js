// typedefs.ts

import { gql } from 'apollo-server-express';

const RentableVehicleTypeDefs = gql`
  scalar Float
  scalar Int

  type Manufacturer {
    id: ID!
    name: String!
    country: String!
    imageUrl: String
  }

  type Vehicle {
    id: ID!
    name: String!
    description: String
    primaryImageUrl: String
    otherImageUrls: [String]
    quantity: String!
    year: String!
    manufacturer: Manufacturer
  }

 input VehicleInput {
    id:String!
    name: String!
    pricePerDay:Int!
    transmission: String
    fuelType: String
    manufacturer: String!
    imageUrl:String
    availableQuantity:Int
    numberOfSeats:String
    year: String!
    description: String!
    primaryImageUrl: String
     
  }



  type Rentable {
    id: ID!
    vehicleId: ID!
    pricePerDay: Float!
    availableQuantity: Int!
    vehicle: Vehicle
  }

  type Query {
    rentableVehicleWithId(id: ID!): Rentable
  }


  type Mutation {
    addVehicleToTypesense(vehicle: VehicleInput!): String
  }
`;
export default RentableVehicleTypeDefs;
