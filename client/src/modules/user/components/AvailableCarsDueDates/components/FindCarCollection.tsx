import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_AVAILABLE_VEHICLES } from '../../../../../graphql/user/available-cars';
import CarCard from '../../CarCardsSection/CarCards';
import styles from '../AvailableCarsDueDates.module.css';

interface CarListSectionProps {
  pickupDate: string | null;
  dropoffDate: string | null;
  inventoryId?: string | null;
  query: string;
  transmission: string[];
  fuelType: string[];
  seats: number[];
  priceSort?: "asc" | "desc";
  priceRange: [number, number];
  onRentNow: (carId: string) => void;
}

const FindCarCollection: React.FC<CarListSectionProps> = ({
  pickupDate,
  dropoffDate,
  inventoryId,
  query,
  transmission,
  fuelType,
  seats,
  priceSort,
  priceRange, 
  onRentNow,
}) => {
  const calculateTotalPrice = (pricePerDay: number) => {
    if (!pickupDate || !dropoffDate) return 0;
    const start = new Date(pickupDate);
    const end = new Date(dropoffDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
    return pricePerDay * days;
  };


  const { loading, error, data, refetch } = useQuery(GET_AVAILABLE_VEHICLES, {
    variables: {
      pickupDate: pickupDate || "",
      dropoffDate: dropoffDate || "",
      inventoryId: inventoryId || undefined, 
      query: query || undefined,
      transmission: transmission.length > 0 ? transmission : undefined,
      fuelType: fuelType.length > 0 ? fuelType : undefined,
      seats: seats.length > 0 ? seats : undefined,
      priceSort: priceSort || undefined,
      priceRange: priceRange || undefined, 
    },
    skip: !pickupDate || !dropoffDate,
  });

  // Effect to refetch when price range changes
  useEffect(() => {
    if (pickupDate && dropoffDate) {
      refetch();
    }
  }, [priceRange, refetch, pickupDate, dropoffDate]);

  if (loading) return <p>Loading available cars...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const availableCars = data?.getAvailableVehicles?.data || [];
  const noCarsAvailable = availableCars.length === 0;

  return (
    <div className={styles.carCollectionSecondDiv}>
      <div className={styles.carsGrid}>
        {noCarsAvailable ? (
          <p style={{ textAlign: "center" }}>
            No cars available for the selected dates.
          </p>
        ) : (
          availableCars.map((car: any) => {
            const totalPrice = calculateTotalPrice(Number(car.pricePerDay));
            return (
              <CarCard
                key={car.id}
                image={car.vehicle.primaryImageUrl}
                model={car.vehicle.name}
                price={car.pricePerDay}
                totalPrice={totalPrice}
                features={{
                  passengers: car.vehicle.numberOfSeats || "",
                  transmission: car.vehicle.transmission,
                  fuelType: car.vehicle.fuelType,
                }}
                onRentNow={() => onRentNow(car.id)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default FindCarCollection;