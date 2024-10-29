import { gql } from "@apollo/client";

export const GET_AVAILABLE_VEHICLES = gql`
  query GetAvailableVehicles(
    $pickupDate: String!
    $dropoffDate: String!
    $inventoryId: ID
    $query: String
    $transmission: [String]
    $fuelType: [String]
    $seats: [Int]
    $priceSort: String
    $priceRange: [Int] 
  ) {
    getAvailableVehicles(
      pickupDate: $pickupDate
      dropoffDate: $dropoffDate
      inventoryId: $inventoryId
      query: $query
      transmission: $transmission
      fuelType: $fuelType
      seats: $seats
      priceSort: $priceSort
      priceRange:$priceRange
    ) {
      status
      statusCode
      message
      data {
        id
        vehicleId
        pricePerDay
        availableQuantity
        inventoryId
        vehicle {
          id
          name
          description
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
`;
