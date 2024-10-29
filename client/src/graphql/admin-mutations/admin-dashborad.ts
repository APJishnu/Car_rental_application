// graphql/queries.ts
import { gql } from "@apollo/client";

export const FETCH_ALL_BOOKINGS = gql`
  query FetchAllBookings($inventoryId: ID) {
    fetchAllBookings(inventoryId: $inventoryId) {
      status
      statusCode
      message
      data {
        id
        rentableId
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
          inventoryId
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

// Fetch all inventories
export const FETCH_ALL_INVENTORIES = gql`
  query fetchAllInventories {
    fetchAllInventories {
      status
      statusCode
      message
      data {
        id
        name
        location
      }
    }
  }
`;

// Mutation to add an inventory
export const ADD_INVENTORY = gql`
  mutation addInventory($name: String!, $location: String!) {
    addInventory(name: $name, location: $location) {
      status
      statusCode
      message
      inventory {
        id
        name
        location
      }
    }
  }
`;
