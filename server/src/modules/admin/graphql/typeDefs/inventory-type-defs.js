// inventoryTypeDefs.ts

import { gql } from "apollo-server-express";

const inventoryTypeDefs = gql`
  type Inventory {
    id: ID!
    name: String!
    location: String!
  }

  type InventoryResponse {
    status: Boolean!
    statusCode: Int!
    message: String!
    data: [Inventory]
  }

  type AddInventoryResponse {
    status: Boolean!
    statusCode: Int!
    message: String!
    inventory: Inventory
  }

  type Query {
    fetchAllInventories: InventoryResponse!
  }

  type Mutation {
    addInventory(name: String!, location: String!): AddInventoryResponse!
  }
`;

export default inventoryTypeDefs;
