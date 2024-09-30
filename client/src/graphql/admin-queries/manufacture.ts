// graphql/queries.js
import { gql } from '@apollo/client';

export const GET_MANUFACTURERS = gql`
  query {
    getManufacturers {
      id
      name
      country
      imageUrl
    }
  }
`;



export const DELETE_MANUFACTURER = gql`
  mutation deleteManufacturer($id: ID!) {
    deleteManufacturer(id: $id)
  }
`;


// Mutation to edit a manufacturer
export const EDIT_MANUFACTURER = gql`
  mutation EditManufacturer($id: ID!, $name: String!, $country: String!, $image: Upload) {
    editManufacturer(id: $id, name: $name, country: $country, image: $image) {
      id
      name
      country
      imageUrl
    }
  }
`;
