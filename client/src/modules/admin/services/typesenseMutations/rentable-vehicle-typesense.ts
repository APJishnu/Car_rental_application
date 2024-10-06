import { useMutation } from '@apollo/client';
import {ADD_VEHICLE_TO_TYPESENSE} from '../../../../graphql/admin-mutations/typesense-mutations'


export const useAddVehicleToTypesense = () => {
    const [addVehicleToTypesense] = useMutation(ADD_VEHICLE_TO_TYPESENSE);
  
    const addVehicles = async (vehicles: any[]) => {
      for (const vehicle of vehicles) {
        const document = {
          id: vehicle.id,
          name: vehicle.vehicle.name,
          pricePerDay: vehicle.pricePerDay,
          transmission: vehicle.vehicle.transmission,
          fuelType: vehicle.vehicle.fuelType,
          year: vehicle.vehicle.year,
          availableQuantity: vehicle.availableQuantity,
          primaryImageUrl: vehicle.vehicle.primaryImageUrl,
          manufacturer: vehicle.vehicle.manufacturer.name,
          imageUrl: vehicle.vehicle.manufacturer.imageUrl,
          numberOfSeats: vehicle.vehicle.numberOfSeats,
          description: vehicle.vehicle.description,
        };
  
        try {
          await addVehicleToTypesense({ variables: { vehicle: document } });
          console.log(`Vehicle ${vehicle.vehicle.name} added to Typesense!`);
        } catch (error) {
          console.error(`Error adding vehicle ${vehicle.vehicle.name} to Typesense:`, error);
          throw new Error(`Failed to add vehicle ${vehicle.vehicle.name} to Typesense.`);
        }
      }
    };
  
    return { addVehicles };
  };