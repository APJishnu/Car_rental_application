import { gql } from 'apollo-server-express';

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

  # Define the Vehicle type
  type Vehicle {
    id: ID!
    name: String!
    description: String
    transmission: String!
    fuelType: String!
    numberOfSeats: String!
    year: String!
    primaryImageUrl: String
    manufacturer: Manufacturer!  # Relation with Manufacturer
  }

  # Define the Rentable type
  type Rentable {
    id: ID!
    vehicleId: ID!
    pricePerDay: Float!
    availableQuantity: Int!
    vehicle: Vehicle!  # Relation with Vehicle
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

  # Payment order response type
  type PaymentOrder {
    status: String!
    message: String!
    razorpayOrderId: String!
    amount: Float!
    currency: String!
  }

 

  # Input for verifying payment
  input PaymentInput {
    razorpayPaymentId: String!
    razorpayOrderId: String!
    razorpaySignature: String!
  }


  type CreateBookingResponse {
    status: String!
    message: String!
    data: Booking
  }

  # Query for getting available vehicles
  type Query {
    getAvailableVehicles(pickupDate: String!, dropoffDate: String!): [Rentable]
  }

  # Mutation for creating a Razorpay payment order and verifying payment + booking creation
  type Mutation {
    # Mutation for creating the Razorpay payment order
    createPaymentOrder(totalPrice: Float!, bookingInput: CreateBookingInput!): PaymentOrder!

    # Mutation for verifying the payment and creating a booking
    verifyPaymentAndCreateBooking(paymentDetails: PaymentInput!, bookingInput: CreateBookingInput!): CreateBookingResponse!
  }
`;

export default VehicleBookingTypeDefs;
