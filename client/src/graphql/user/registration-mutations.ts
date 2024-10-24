// mutations.js
import { gql } from "@apollo/client";

export const SEND_OTP = gql`
  mutation sendOTP(
    $firstName: String
    $lastName: String
    $phoneNumber: String
    $email: String
    $password: String
    $confirmPassword: String
  ) {
    sendOTP(
      firstName: $firstName
      lastName: $lastName
      phoneNumber: $phoneNumber
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      status
      message
      errors {
        field
        message
      }
    }
  }
`;


export const VERIFY_OTP = gql`
  mutation VerifyOTP($phoneNumber: String!, $otp: String) {
    verifyOTP(phoneNumber: $phoneNumber, otp: $otp) {
      status
      statusCode
      message
      errors {
        field
        message
      }
      data {
        isPhoneVerified
        phoneVerifiedAt
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterInput!) {
    registerUser(input: $input) {
      status
      statusCode
      message
      errors {
        field
        message
      }
      data {
        id
        firstName
        lastName
        phoneNumber
        email
        isPhoneVerified
        phoneVerifiedAt
        city
        state
        country
        pincode
      }
    }
  }
`;

