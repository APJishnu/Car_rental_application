'use client';

import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useRouter, useSearchParams } from 'next/navigation';
import CarCard from '../../../modules/user/components/CarCardsSection/CarCards';
import styles from './page.module.css';

const GET_AVAILABLE_VEHICLES = gql`
    query GetAvailableVehicles($pickupDate: String!, $dropoffDate: String!) {
        getAvailableVehicles(pickupDate: $pickupDate, dropoffDate: $dropoffDate) {
        id
        vehicleId
        pricePerDay
        availableQuantity
        vehicle {
            id
            name
            description
            transmission
            fuelType
            numberOfSeats
            year
            primaryImageUrl
            manufacturer {
            id
            name
            country
            imageUrl
            }
        }
        }
    }
    `;

const FindCars: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams(); // Use `useSearchParams` to get search params

    // Get query params for pickupDate and dropoffDate
    const pickupDate = searchParams.get('pickupDate');
    const dropoffDate = searchParams.get('dropoffDate');

    // Ensure we fetch the data only when dates are available
    const { loading, error, data } = useQuery(GET_AVAILABLE_VEHICLES, {
        variables: {
            pickupDate: pickupDate || '',  // Handle null gracefully
            dropoffDate: dropoffDate || '',
        },
        skip: !pickupDate || !dropoffDate,  // Skip query if dates are not present
    });
    // Function to calculate total price based on dates and pricePerDay
    const calculateTotalPrice = (pricePerDay: number) => {
        if (!pickupDate || !dropoffDate) return 0; // If dates are not available, return 0

        const start = new Date(pickupDate);
        const end = new Date(dropoffDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)); // Calculate days

        const priceWithoutGST = pricePerDay * days;

        return priceWithoutGST; // Return total price including GST
    };

    if (loading) return <p>Loading available cars...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const availableCars = data?.getAvailableVehicles || [];


    const handleRentNow = (carId: string, pickupDate: string, dropoffDate: string) => {
        router.push(`/user/car-booking?carId=${carId}&pickupDate=${pickupDate}&dropoffDate=${dropoffDate}`); // Navigates to dynamic car booking page
    };


    const handleRentNowWithChecks = (carId: string) => {
        if (pickupDate && dropoffDate) {
            handleRentNow(carId, pickupDate, dropoffDate);
        } else {
            // Handle the case where pickupDate or dropoffDate is null
            console.error('Pickup date or dropoff date is not set.');
        }
    };

    return (
        <div className={styles.carCollection}>
            <div className={styles.carCollectionSecondDiv}>
                <div className={styles.carsGrid}>
                    {availableCars.length > 0 ? (
                        availableCars.map((car: any) => {
                            const totalPrice = calculateTotalPrice(Number(car.pricePerDay));
                            return (
                                <CarCard
                                    key={car.id}
                                    image={car.vehicle.primaryImageUrl}
                                    model={car.vehicle.name}
                                    price={car.pricePerDay}
                                    totalPrice={totalPrice} // Pass total price to the component
                                    features={{
                                        passengers: car.vehicle.numberOfSeats || '',
                                        transmission: car.vehicle.transmission,
                                        fuelType: car.vehicle.fuelType,
                                    }}
                                    onRentNow={() => handleRentNowWithChecks(car.id)} // Call the new function
                                />
                            );
                        })
                    ) : (
                        <p>No cars available for the selected dates.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FindCars;
