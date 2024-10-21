// authTypeDefs.ts

import { gql } from 'apollo-server-express';

const authTypeDefs = gql`
  type Admin {
    id: ID!
    name: String!
    email: String!
    role: String!
    createdAt: String!
    updatedAt: String!
  }

  type FieldErrors {
    email: String
    password: String
  }

  type AuthResponse {
    status: Boolean!
    statusCode: Int!
    message: String!
    token: String
    fieldErrors: FieldErrors  
    data: AdminData
  }

  type AdminData {
    admin: Admin!
  }

  type Query {
    getAdmin(id: ID!): Admin
  }
    
  type Mutation {
    adminLogin(email: String!, password: String!): AuthResponse!
  }
`;

export default authTypeDefs;
