// types/vehicle.types.ts
export interface Vehicle {
    id: string;
    name: string;
    description?: string;
    transmission: string;
    fuelType: string;
    numberOfSeats: string;
    quantity: string;
    year: string;
    primaryImageUrl?: string;
    otherImageUrls?: string[];
    isRented?: string;
  }
  
  export interface GetVehiclesData {
    getVehicles: Vehicle[];
  }
  
  export interface DeleteVehicleData {
    deleteVehicle: Vehicle;
  }
  export type RentableInput = {
    vehicleId: string;
    pricePerDay: number;
    availableQuantity: number;
    inventoryLocation: string;
  };
  
  export interface AddRentableData {
    addRentable: {
      id: string;
      vehicleId: string;
      pricePerDay: number;
      availableQuantity: number;
    };
  }
  