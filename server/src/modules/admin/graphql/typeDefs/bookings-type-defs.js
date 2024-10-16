import { gql } from "apollo-server-express";

const BookingsTypeDefs = gql`
  scalar Float
  scalar Int

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

  type GetBooking {
    id: ID!
    vehicleId: Int!
    userId: Int!
    pickupDate: String!
    dropoffDate: String!
    status:String
    totalPrice: Float!
    razorpayOrderId: String
    paymentMethod: String!
    releaseDate: String
    rentable: Rentable
  }

  type FetchBookingsResponse {
    status: Boolean!
    statusCode: Int!
    message: String!
    data: [GetBooking]
  }

  type updateBooking {
    id: ID!
    status: String
    releaseDate: String
  }

  type BookingResponse {
    status: Boolean!
    statusCode: Int!
    message: String!
    updatedBooking: updateBooking
  }

  type Query {
    fetchAllBookings: FetchBookingsResponse!
  }

  type Mutation {
    releaseBooking(id: String!): BookingResponse!
  }
`;

export default BookingsTypeDefs;
