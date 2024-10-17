import { gql } from "apollo-server-express";

const VehicleBookingTypeDefs = gql`
  scalar Float
  scalar Int

  # Define the Manufacturer type
  type Manufacturer {
    id: ID!
    name: String!
    country: String
    imageUrl: String
  }

  type Vehicle {
    id: ID!
    name: String!
    description: String
    transmission: String!
    fuelType: String!
    numberOfSeats: String!
    year: String!
    primaryImageUrl: String
    manufacturer: Manufacturer!
  }

  type Rentable {
    id: ID!
    vehicleId: ID!
    pricePerDay: Float!
    availableQuantity: Int!
    vehicle: Vehicle!
  }

  # Booking Details Type
  type Booking {
    id: ID!
    vehicleId: ID!
    userId: ID!
    pickupDate: String!
    dropoffDate: String!
    totalPrice: Float!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  # Input for creating a booking
  input CreateBookingInput {
    vehicleId: ID!
    pickupDate: String!
    dropoffDate: String!
    totalPrice: Float!
    userContact: String!
  }

type PaymentOrder {
    status: Boolean!
    message: String!
    statusCode: Int!
    data: PaymentOrderData
}

type PaymentOrderData {
    razorpayOrderId: String
    amount: Float
    currency: String
}


  input PaymentInput {
    razorpayPaymentId: String!
    razorpayOrderId: String!
    razorpaySignature: String!
  }

  type GetBooking {
    id: ID!
    vehicleId: Int!
    userId: Int!
    pickupDate: String!
    dropoffDate: String!
    status: String
    totalPrice: Float!
    razorpayOrderId: String
    paymentMethod: String!
    rentable: Rentable
  }

  type FetchBookingsResponse {
    status: Boolean!
    statusCode: Int!
    message: String!
    data: [GetBooking]
  }

  type CreateBookingResponse {
    status: String!
    message: String!
    data: Booking
  }
  type UserDetailsReview {
    id: Int!
    firstName: String!
    lastName: String!
    email: String!
    profileImage: String
  }

  type Review {
    id: Int!
    bookingId: Int!
    vehicleId: Int!
    userId: Int!
    comment: String!
    rating: Float!
    booking: Booking!
    user: UserDetailsReview! # Ensure it includes UserDetailsReview type
  }

  type ReviewResponse {
    status: Boolean!
    message: String!
  }

  # Query for getting available vehicles
  type Query {
    getAvailableVehicles(pickupDate: String!, dropoffDate: String!): [Rentable]
    fetchBookings: FetchBookingsResponse!
    fetchReviews(vehicleId: ID!): [Review!]!
  }

  # Mutation for creating a Razorpay payment order and verifying payment + booking creation
  type Mutation {
    # Mutation for creating the Razorpay payment order
    createPaymentOrder(
      totalPrice: Float!
      bookingInput: CreateBookingInput!
    ): PaymentOrder!

    # Mutation for verifying the payment and creating a booking
    verifyPaymentAndCreateBooking(
      paymentDetails: PaymentInput!
      bookingInput: CreateBookingInput!
    ): CreateBookingResponse!

    addReview(
      bookingId: ID!
      vehicleId: ID!
      comment: String!
      rating: Float!
    ): ReviewResponse
  }
`;

export default VehicleBookingTypeDefs;
