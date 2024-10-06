// src/graphql/typedefs.js
import { gql } from 'apollo-server-express';

const userAuthTypeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    phoneNumber: String!
    email: String!
    isPhoneVerified: Boolean!
    phoneVerifiedAt: String
    profileImage:String
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

  type LoginResponse{
    status: String
    message: String
    token:String
    data: User
  }

  type ResponseSendOtp{
    status: String!
    message: String!
    data:String
  }

  input RegisterInput {
    firstName: String!
    lastName: String!
    phoneNumber: String!
    email: String!
    password: String!
    confirmPassword:String!
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
    sendOTP(phoneNumber: String!): ResponseSendOtp!
    verifyOTP(phoneNumber: String!, otp: String!): Response!
    loginUser(email: String!, password: String!): LoginResponse!
    updateProfileImage(userId: ID!, profileImage: String): Response
  }
`;

export default userAuthTypeDefs;
