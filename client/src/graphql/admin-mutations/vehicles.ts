import { gql } from '@apollo/client';

export const ADD_VEHICLE = gql`
  mutation AddVehicle(
    $name: String!
    $description: String
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
      quantity
      manufacturerId
      year
      primaryImageUrl
      otherImageUrls
    }
  }
`;
