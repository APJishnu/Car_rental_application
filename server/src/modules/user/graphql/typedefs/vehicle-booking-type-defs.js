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
    inventoryId:ID
    vehicle: Vehicle!
  }


  type Booking {
    id: ID!
    rentableId: ID!
    userId: ID!
    pickupDate: String!
    dropoffDate: String!
    totalPrice: Float!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  input CreateBookingInput {
    rentableId: ID!
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
    rentableId: ID!
    userId: Int!
    pickupDate: String!
    dropoffDate: String!
    status: String
    totalPrice: Float!
    razorpayOrderId: String
    paymentMethod: String
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
    user: UserDetailsReview! 
  }

  type ReviewResponse {
    status: Boolean!
    message: String!
  }

  type GetAvailableVehiclesResponse {
    status: String!
    statusCode: Int!
    message: String!
    data: [Rentable]
  }

  

  type Query {

    getAvailableVehicles(
    pickupDate: String!
    dropoffDate: String!
    inventoryId: ID  
    query: String
    transmission: [String]         
    fuelType: [String]             
    seats: [Int]                  
    priceSort: String  
    priceRange: [Int]        
  ): GetAvailableVehiclesResponse

    fetchBookings: FetchBookingsResponse!
    fetchReviews(vehicleId: ID!): [Review!]!
  }

  type Mutation {
    createPaymentOrder(
      totalPrice: Float!
      bookingInput: CreateBookingInput!
    ): PaymentOrder!

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
