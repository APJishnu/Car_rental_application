import { gql } from 'apollo-server-express';

const vehicleTypeDefs = gql`
  # Scalar for handling file uploads
  scalar Upload
  scalar Int

  # Vehicle Type for GraphQL schema
  type Vehicle {
    id: ID!
    name: String!
    description: String
    transmission:String!
    fuelType: String!
    numberOfSeats:String!
    quantity: String!
    manufacturerId: String!
    year: String!
    primaryImageUrl: String
    otherImageUrls: [String] # Array of URLs for other images
    isRented: Boolean
  }

  # Input for adding vehicle details
  input AdminVehicleInput {
    name: String!
    description: String
    transmission:String!
    fuelType: String!
    numberOfSeats:String!
    quantity: String!
    manufacturerId: String!
    year: String!
  }

  input EditVehicleInput {
    name: String!
    description: String
    quantity: String!
    primaryImage: Upload
    otherImages: [Upload!]
    year: String!
  }

  type Query {
    getVehicles: [Vehicle!]!  # Query to fetch the list of vehicles
    getVehicleById(id: String!): Vehicle
  }

  # Mutation for adding a new vehicle
  type Mutation {
    addVehicle(
      input: AdminVehicleInput!, 
      primaryImage: Upload!, 
      otherImages: [Upload!]! # Accept multiple file uploads for otherImages
    ): Vehicle!

     deleteVehicle(id: String!): Vehicle

     updateVehicle(id: String!, input: EditVehicleInput!): Vehicle!  

  }
`;

export default vehicleTypeDefs;
