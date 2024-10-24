// registeration

// types.ts
export interface FormData {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    isPhoneVerified?: boolean;
    phoneVerifiedAt?: string;
  }
  
  export interface FieldError {
    field: string;
    message: string;
  }
  


//carBooking types
export interface Vehicle {
  id: string;
  name: string;
  description: string;
  transmission: string;
  fuelType: string;
  numberOfSeats: string;
  year: string;
  primaryImageUrl: string;
  otherImageUrls: string[];
  manufacturer: {
    id: string;
    name: string;
    country: string;
    imageUrl: string;
  };
}

export interface Review {
  id: string;
  bookingId: string;
  vehicleId: string;
  userId: string;
  comment: string;
  rating: number;
  user: {
    id: string;
    fullName: string;
    email: string;
    profileImage: string;
  };
}


export type RatingDistribution = {
  [K in 1 | 2 | 3 | 4 | 5]: number;
};


export interface RentableVehicle {
  vehicleId: string;
  pricePerDay: string;
  availableQuantity: number;
  vehicle: Vehicle;
}

export interface CarBookingProps {
  carId: string;
}

