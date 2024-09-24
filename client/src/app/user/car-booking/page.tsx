'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation'; // For accessing URL search params
import CarBooking from '../../../modules/user/components/CarBooking/CarBooking';
import styles from './page.module.css';

const carsData = [
    {
      id: '1',
      image: '/carImages/Audi.svg',
      model: 'Audi A8 L 2022',
      price: '78.90',
      features: { passengers: '4', transmission: 'Auto', fuelType: 'Electric' },
      year: '2022',
      seats: '4',
      mileage: '18.5 km/l',
      description: 'The Audi A8 L 2022 is the pinnacle of luxury and performance. Perfect for long journeys and city rides, this car combines elegance with power.',
      owner: 'Sonia Juminten',
      ownerImage: '/ownerImages/Sonia.jpg'
    },
    {
      id: '2',
      image: '/carImages/Nissan.svg',
      model: 'Nissan Maxima Platinum 2022',
      price: '75.50',
      features: { passengers: '4', transmission: 'Auto', fuelType: 'Electric' },
      year: '2022',
      seats: '4',
      mileage: '17 km/l',
      description: 'The Nissan Maxima Platinum 2022 is designed for those who value both luxury and efficiency. It offers a smooth ride and modern technology for a superior driving experience.',
      owner: 'John Doe',
      ownerImage: '/ownerImages/John.jpg'
    },
    {
      id: '3',
      image: '/carImages/Porsche.svg',
      model: 'Porsche Cayenne GTS 2022',
      price: '120.00',
      features: { passengers: '5', transmission: 'Auto', fuelType: 'Petrol' },
      year: '2022',
      seats: '5',
      mileage: '12 km/l',
      description: 'The Porsche Cayenne GTS 2022 is a powerful SUV that combines sporty performance with luxury. Perfect for family trips or off-road adventures.',
      owner: 'Alice Smith',
      ownerImage: '/ownerImages/Alice.jpg'
    },
    {
      id: '4',
      image: '/carImages/Audi.svg',
      model: 'Audi A8 L 2022',
      price: '78.90',
      features: { passengers: '4', transmission: 'Auto', fuelType: 'Electric' },
      year: '2022',
      seats: '4',
      mileage: '18.5 km/l',
      description: 'Another Audi A8 L 2022, perfect for those who love the combination of elegance and performance. With top-notch comfort features, it’s ideal for long trips.',
      owner: 'Michael Brown',
      ownerImage: '/ownerImages/Michael.jpg'
    },
    {
      id: '5',
      image: '/carImages/Nissan.svg',
      model: 'Nissan Maxima Platinum 2022',
      price: '75.50',
      features: { passengers: '4', transmission: 'Auto', fuelType: 'Electric' },
      year: '2022',
      seats: '4',
      mileage: '17 km/l',
      description: 'This Nissan Maxima Platinum 2022 is designed for city driving with a focus on comfort and fuel efficiency. A perfect car for daily commutes.',
      owner: 'Jane Doe',
      ownerImage: '/ownerImages/Jane.jpg'
    },
    {
      id: '6',
      image: '/carImages/Porsche.svg',
      model: 'Porsche Cayenne GTS 2022',
      price: '120.00',
      features: { passengers: '5', transmission: 'Auto', fuelType: 'Petrol' },
      year: '2022',
      seats: '5',
      mileage: '12 km/l',
      description: 'Another Porsche Cayenne GTS 2022, ideal for those who crave adventure and style. Whether on the highway or off-road, it delivers unparalleled performance.',
      owner: 'Emily Johnson',
      ownerImage: '/ownerImages/Emily.jpg'
    }
  ];
  
const CarBookingPage: React.FC = () => {
  const searchParams = useSearchParams();
  const carId = searchParams.get('carId'); // Get the carId from the URL

  // Find the car based on carId
  const car = carsData.find((car) => car.id === carId);

  if (!car) {
    return <p>Car not found!</p>; // Display error if carId doesn't match any car
  }

  return (
    <div className={styles.pageContainer}>
      <CarBooking car={car} />
    </div>
  );
};

export default CarBookingPage;
