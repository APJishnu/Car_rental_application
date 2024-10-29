// services/vehicleService.ts
import { gql } from "@apollo/client";

export const GET_VEHICLES = gql`
  query GetVehicles {
    getVehicles {
      id
      name
      description
      transmission
      fuelType
      numberOfSeats
      quantity
      year
      primaryImageUrl
      otherImageUrls
      isRented
    }
  }
`;

export const DELETE_VEHICLE = gql`
  mutation DeleteVehicle($id: String!) {
    deleteVehicle(id: $id) {
      id
    }
  }
`;

export const ADD_RENTABLE = gql`
  mutation AddRentable(
    $vehicleId: ID!
    $pricePerDay: Float!
    $availableQuantity: Int!
    $inventoryLocation: String!
  ) {
    addRentable(
      vehicleId: $vehicleId
      pricePerDay: $pricePerDay
      availableQuantity: $availableQuantity
      inventoryLocation: $inventoryLocation
    ) {
      status
      statusCode
      message
      data {
        id
        vehicleId
        pricePerDay
        availableQuantity
        inventoryLocation
      }
    }
  }
`;

export const ADD_VEHICLE_EXCEL = gql`
  mutation AddVehicleExcel($excelFile: Upload!) {
    addVehicleExcel(excelFile: $excelFile) {
      success
      message
      processedVehiclesCount
    }
  }
`;
