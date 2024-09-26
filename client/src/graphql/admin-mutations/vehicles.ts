import { gql } from '@apollo/client';

export const ADD_VEHICLE = gql`
  mutation AddVehicle($manufacturerId: ID!, $name: String!, $year: String!) {
    addVehicle(manufacturerId: $manufacturerId, name: $name, year: $year) {
      id
      name
      year
      manufacturer {
        name
      }
    }
  }
`;
