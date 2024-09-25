"use client"

import React from 'react';
import CarCard from '../CarCardsSection/CarCards';
import styles from './CarCollection.module.css';
import { useRouter } from 'next/navigation'; // For navigation in Next.js

const carsData = [
  {
    id: '1',  // Add a unique ID for each car
    image: '/carImages/Audi.svg',
    model: 'Audi A8 L 2022',
    price: '78.90',
    features: { passengers: '4', transmission: 'Auto', fuelType: 'Electric' }
  },
  {
    id: '2',
    image: '/carImages/Nissan.svg',
    model: 'Nissan Maxima Platinum 2022',
    price: '78.90',
    features: { passengers: '4', transmission: 'Auto', fuelType: 'Electric' }
  },
  {
    id: '3',
    image: '/carImages/Porsche.svg',
    model: 'Porsche Cayenne GTS 2022',
    price: '78.90',
    features: { passengers: '4', transmission: 'Auto', fuelType: 'Electric' }
  },
  {
    id: '4',
    image: '/carImages/Audi.svg',
    model: 'Audi A8 L 2022',
    price: '78.90',
    features: { passengers: '4', transmission: 'Auto', fuelType: 'Electric' }
  },
  {
    id: '5',
    image: '/carImages/Nissan.svg',
    model: 'Nissan Maxima Platinum 2022',
    price: '78.90',
    features: { passengers: '4', transmission: 'Auto', fuelType: 'Electric' }
  },
  {
    id: '6',
    image: '/carImages/Porsche.svg',
    model: 'Porsche Cayenne GTS 2022',
    price: '78.90',
    features: { passengers: '4', transmission: 'Auto', fuelType: 'Electric' }
  },
  // Add more cars here...
];

const CarCollection: React.FC = () => {

  const router = useRouter();

  const handleRentNow = (carId: string) => {
    router.push(`/user/car-booking?carId=${carId}`); // Navigates to dynamic car booking page
  };

  return (
    <div className={styles.carCollection}>
      <div className={styles.carCollectionSecondDiv}>
        <h2>Our Impressive Collection of Cars</h2>
        <p className={styles.subheading}>Ranging from elegant sedans to powerful sports cars...</p>
        <div className={styles.filters}>
          <button className={styles.filterButton}>Popular Car</button>
          <button className={styles.filterButton}>Luxury Car</button>
          <button className={styles.filterButton}>Vintage Car</button>
          <button className={styles.filterButton}>Family Car</button>
          <button className={styles.filterButton}>Off-Road Car</button>
        </div>
        <div className={styles.carsGrid}>
          {carsData.map((car) => (
            <CarCard
              key={car.id}
              image={car.image}
              model={car.model}
              price={car.price}
              features={car.features}
              onRentNow={() => handleRentNow(car.id)} // Passing the car's ID
            />
          ))}
        </div>
        <div className={styles.viewMore}>
          <button className={styles.viewMoreButton}>See all Cars &rarr;</button>
        </div>
      </div>
    </div>
  );
};

export default CarCollection;
