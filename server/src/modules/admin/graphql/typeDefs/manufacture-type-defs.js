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
  }
`;

export default manufactureTypeDefs;
