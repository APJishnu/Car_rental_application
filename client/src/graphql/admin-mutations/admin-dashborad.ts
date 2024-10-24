// graphql/queries.ts
import { gql } from "@apollo/client";

export const FETCH_ALL_BOOKINGS = gql`
  query FetchAllBookings {
    fetchAllBookings {
      status
      statusCode
      message
      data {
        id
        vehicleId
        userId
        pickupDate
        dropoffDate
        status
        totalPrice
        razorpayOrderId
        paymentMethod
        rentable {
          id
          vehicleId
          pricePerDay
          availableQuantity
          vehicle {
            id
            name
            transmission
            fuelType
            numberOfSeats
            year
            primaryImageUrl
            manufacturer {
              id
              name
              country
              imageUrl
            }
          }
        }
      }
    }
  }
`;

export const RELEASE_BOOKING = gql`
  mutation ReleaseBooking($id: String!) {
    releaseBooking(id: $id) {
      status
      statusCode
      message
      updatedBooking {
        id
        status
        releaseDate
      }
    }
  }
`;
