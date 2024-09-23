"use client"

import React from 'react';
import CarCard from '../CarCardsSection/CarCards';
import styles from './CarCollection.module.css';

const carsData = [
  {
    image: '/carImages/Audi.svg',
    model: 'Audi A8 L 2022',
    price: '78.90',
    features: { passengers: '4', transmission: 'Auto', fuelType: 'Electric' }
  },
  {
    image: '/carImages/Nissan.svg',
    model: 'Nissan Maxima Platinum 2022',
    price: '78.90',
    features: { passengers: '4', transmission: 'Auto', fuelType: 'Electric' }
  },
  {
    image: '/carImages/Porsche.svg',
    model: 'Porsche Cayenne GTS 2022',
    price: '78.90',
    features: { passengers: '4', transmission: 'Auto', fuelType: 'Electric' }
  },
  {
    image: '/carImages/Audi.svg',
    model: 'Audi A8 L 2022',
    price: '78.90',
    features: { passengers: '4', transmission: 'Auto', fuelType: 'Electric' }
  },
  {
    image: '/carImages/Nissan.svg',
    model: 'Nissan Maxima Platinum 2022',
    price: '78.90',
    features: { passengers: '4', transmission: 'Auto', fuelType: 'Electric' }
  },
  {
    image: '/carImages/Porsche.svg',
    model: 'Porsche Cayenne GTS 2022',
    price: '78.90',
    features: { passengers: '4', transmission: 'Auto', fuelType: 'Electric' }
  },
  // Add more cars here...
];

const CarCollection: React.FC = () => {
  return (
    <div className={styles.carCollection}>
        <div  className={styles.carCollectionSecondDiv}>
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
        {carsData.map((car, index) => (
          <CarCard
            key={index}
            image={car.image}
            model={car.model}
            price={car.price}
            features={car.features}
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
