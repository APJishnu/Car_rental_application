import { gql } from '@apollo/client';

export const GET_RENTABLE_VEHICLE_BY_ID = gql`
  query GetRentableVehicleById($id: ID!) {
    rentableVehicleWithId(id: $id) {
      id
      vehicleId
      pricePerDay
      availableQuantity
      vehicle {
        id
        name
        description
        transmission
        fuelType
        numberOfSeats
        year
        primaryImageUrl
        otherImageUrls
        manufacturer {
          id
          name
          country
          imageUrl
        }
      }
    }
  }
`;

export const FETCH_REVIEWS = gql`
  query FetchReviewsByVehicleId($vehicleId: ID!) {
    fetchReviews(vehicleId: $vehicleId) {
      id
      bookingId
      vehicleId
      userId
      comment
      rating
      user {
        id
        firstName
        lastName
        email
        profileImage
      }
    }
  }
`;
