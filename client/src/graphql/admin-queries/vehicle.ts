// graphql/queries.js
import { gql } from '@apollo/client';

export const GET_MANUFACTURERS = gql`
  query {
    manufacturers {
      id
      name
    }
  }
`;
