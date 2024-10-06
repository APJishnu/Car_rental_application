// typesenseMutations.ts

import {  gql } from '@apollo/client';

export const ADD_VEHICLE_TO_TYPESENSE = gql`
  mutation AddVehicleToTypesense($vehicle: VehicleInput!) {
    addVehicleToTypesense(vehicle: $vehicle)
  }
`;
