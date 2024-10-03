// types.ts

export interface Manufacturer {
  id: string;
  name: string;
}

export interface FormData {
 
  name: string;
  description: string;
  transmission:string;
  numberOfSeats:string;
  fuelType:string;
  primaryImage: ImageFile | null; // This can be an ImageFile object or null
  otherImages: ImageFile[];
  quantity: string;
  manufacturerId: string;
  year: string;
}

export interface ImageFile {
  id: string;  
  file: File | null;  
  name: string | null; 
  preview: string | null; 
}

export interface GetManufacturersResponse {
  getManufacturers: Manufacturer[];
}
