// src/graphql/typedefs.js
import { gql } from "apollo-server-express";

const userAuthTypeDefs = gql`
  scalar Upload

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    phoneNumber: String!
    email: String!
    isPhoneVerified: Boolean!
    phoneVerifiedAt: String
    profileImage: String
    city: String
    state: String
    country: String
    pincode: String
  }

  type Response {
    status: String!
    message: String!
    data: User
  }

  type LoginValidationError {
    email: String
    password: String
  }

  type LoginResponse {
    status: Boolean
    statusCode: Int!
    message: String
    token: String
    data: User
    fieldErrors: LoginValidationError
  }

  type ValidationError {
    field: String
    message: String
  }

  type ResponseSendOtp {
    status: String!
    message: String!
    data: String
    errors: [ValidationError] # Added this field for validation errors
  }

  input RegisterInput {
    firstName: String!
    lastName: String!
    phoneNumber: String!
    email: String!
    password: String!
    confirmPassword: String!
    city: String
    state: String
    country: String
    pincode: String
  }

  type Query {
    getUser: Response
  }

  type Mutation {
    registerUser(input: RegisterInput): Response!
    sendOTP(
      firstName: String
      lastName: String
      phoneNumber: String
      email: String
      password: String
      confirmPassword: String
    ): ResponseSendOtp!
    verifyOTP(phoneNumber: String!, otp: String!): Response!
    loginUser(email: String, password: String): LoginResponse!
    updateProfileImage(userId: ID!, profileImage: Upload): Response
  }
`;

export default userAuthTypeDefs;
