// car-booking/page.tsx

'use client'; // This component can use hooks like useState and useEffect
import React from 'react';
import { useSearchParams } from 'next/navigation'; // For accessing URL search params
import CarBooking from '../../../modules/user/components/CarBooking/CarBooking';
import styles from './page.module.css';

const CarBookingPage: React.FC = () => {
  const searchParams = useSearchParams();
  const carId = searchParams.get('carId'); // Get the carId from the URL

  if (!carId) {
    return <p>No car ID provided!</p>; // Handle case where no ID is found
  }

  return (
    <div className={styles.pageContainer}>
      <CarBooking carId={carId} /> {/* Pass carId to CarBooking */}
    </div>
  );
};

export default CarBookingPage;
