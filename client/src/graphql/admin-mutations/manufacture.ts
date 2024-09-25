import { gql } from '@apollo/client';

export const ADD_MANUFACTURER = gql`
  mutation AddManufacturer($name: String!, $country: String, $image: Upload!) {
  addManufacturer(name: $name, country: $country, image: $image) {
    id
    name
    country
    imageUrl
  }
}

`;
