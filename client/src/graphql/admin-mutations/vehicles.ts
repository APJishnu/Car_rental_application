// graphql/vehicles.js
import { gql } from '@apollo/client';

export const ADD_VEHICLE = gql`
  mutation addVehicle($input: VehicleInput!) {
    addVehicle(input: $input) {
      id
      name
      description
      price
      primaryImage
      otherImages
      quantity
      manufacturerId
    }
  }
`;

export const GET_VEHICLES = gql`
  query getVehicles {
    getVehicles {
      id
      name
      description
      price
      primaryImage
      otherImages
      quantity
      manufacturerId
    }
  }
`;

export const DELETE_VEHICLE = gql`
  mutation deleteVehicle($id: ID!) {
    deleteVehicle(id: $id)
  }
`;
