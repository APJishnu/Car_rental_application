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
