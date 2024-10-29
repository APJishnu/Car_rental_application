// types.ts



export interface Inventory {
  id: string;
  name: string;
  location: string;
}

export interface Manufacturer {
    id: string;
    name: string;
    country: string;
    imageUrl: string;
  }
  
  export interface Vehicle {
    id: string;
    name: string;
    transmission: string;
    fuelType: string;
    numberOfSeats: number;
    year: number;
    primaryImageUrl: string;
    manufacturer: Manufacturer;
  }
  
  export interface Rentable {
    id: string;
    vehicleId: string;
    pricePerDay: number;
    availableQuantity: number;
    vehicle: Vehicle;
  }
  
  export interface Booking {
    id: string;
    rentableId: string;
    userId: string;
    pickupDate: string;
    dropoffDate: string;
    status: string;
    totalPrice: number;
    razorpayOrderId: string;
    paymentMethod: string;
    rentable: Rentable;
  }
  