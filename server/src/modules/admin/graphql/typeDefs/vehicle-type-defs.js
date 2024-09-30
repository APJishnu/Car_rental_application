import { gql } from 'apollo-server-express';

const vehicleTypeDefs = gql`
  # Scalar for handling file uploads
  scalar Upload

  # Vehicle Type for GraphQL schema
  type Vehicle {
    id: ID!
    name: String!
    description: String
    quantity: String!
    manufacturerId: String!
    year: String!
    primaryImageUrl: String
    otherImageUrls: [String] # Array of URLs for other images
  }

  # Input for adding vehicle details
  input VehicleInput {
    name: String!
    description: String
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
      input: VehicleInput!, 
      primaryImage: Upload!, 
      otherImages: [Upload!]! # Accept multiple file uploads for otherImages
    ): Vehicle!

     deleteVehicle(id: String!): Vehicle

     updateVehicle(id: String!, input: EditVehicleInput!): Vehicle!  # Add this line for editing

  }
`;

export default vehicleTypeDefs;
