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

  type ResponseRegisterUser {
    status: String!
    statusCode: Int!
    message: String!
    data: User
    errors: [ValidationError]
  }

  type ResponseSendOtp {
    status: String!
    message: String!
    data: String
    errors: [ValidationError]
  }

  input AdditionalDetailsInput {
    city: String
    state: String
    country: String
    pincode: String
  }

  input RegisterInput {
    firstName: String!
    lastName: String!
    phoneNumber: String!
    isPhoneVerified: Boolean!
    phoneVerifiedAt: String
    email: String!
    password: String!
    confirmPassword: String!
    additionalDetails: AdditionalDetailsInput
  }

  type VerifyOTP {
    isPhoneVerified: Boolean
    phoneVerifiedAt: String
  }

  type VerifyOTPResponse {
    status: String!
    statusCode: Int!
    message: String!
    errors: [ValidationError]
    data: VerifyOTP
  }

  type Query {
    getUser: Response
  }

  type Mutation {
    registerUser(input: RegisterInput): ResponseRegisterUser!
    sendOTP(
      firstName: String
      lastName: String
      phoneNumber: String
      email: String
      password: String
      confirmPassword: String
    ): ResponseSendOtp!
    verifyOTP(phoneNumber: String!, otp: String): VerifyOTPResponse!
    loginUser(email: String, password: String): LoginResponse!
    updateProfileImage(userId: ID!, profileImage: Upload): Response
  }
`;

export default userAuthTypeDefs;
