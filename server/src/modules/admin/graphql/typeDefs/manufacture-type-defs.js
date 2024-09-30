// modules/admin/graphql/typeDefs/manufacture-type-defs.js
import { gql } from 'apollo-server-express';

const manufactureTypeDefs = gql`
  scalar Upload

  type Manufacturer {
    id: ID!
    name: String!
    country: String
    imageUrl: String
  }

  type Query {
    getManufacturers: [Manufacturer!]!
  
  }

  type Mutation {
    addManufacturer(name: String!, country: String, image: Upload!): Manufacturer!
    editManufacturer(id: ID!, name: String!, country: String, image: Upload): Manufacturer!  
    deleteManufacturer(id: ID!): Boolean!  
  }
`;

export default manufactureTypeDefs;
