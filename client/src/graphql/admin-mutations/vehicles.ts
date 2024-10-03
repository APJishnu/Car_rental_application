import { gql } from '@apollo/client';

export const ADD_VEHICLE = gql`
  mutation AddVehicle(
    $name: String!
    $description: String
    $transmission: String!
    $fuelType: String!
    $numberOfSeats: String!
    $quantity: String!
    $manufacturerId: String!
    $year: String!
    $primaryImage: Upload!
    $otherImages: [Upload!]!
  ) {
    addVehicle(
      input: {
        name: $name
        description: $description
        transmission: $transmission
        fuelType: $fuelType
        numberOfSeats: $numberOfSeats
        quantity: $quantity
        manufacturerId: $manufacturerId
        year: $year
      }
      primaryImage: $primaryImage
      otherImages: $otherImages
    ) {
      id
      name
      description
      transmission
      fuelType
      numberOfSeats
      quantity
      manufacturerId
      year
      primaryImageUrl
      otherImageUrls
    }
  }
`;
