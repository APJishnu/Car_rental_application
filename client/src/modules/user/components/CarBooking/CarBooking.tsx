"use client"
// src/components/CarBooking/CarBooking.tsx
import React,{useState} from 'react';
import { useSearchParams } from 'next/navigation';
import { useCarBooking } from '../../services/car-booking';
import { CarImages } from './components/CarImages';
import { CarDetails } from './components/CarDetails';
import { ReviewSection } from './components/ReviewSection';
import { BookingModal } from './components/BookingModal';
import styles from './CarBooking.module.css';
import { CarBookingProps } from '../../../../interfaces/user-interfaces/types';

const CarBooking: React.FC<CarBookingProps> = ({ carId }) => {
  const {
    car,
    reviews,
    carLoading,
    carError,
    currentImageIndex,
    setCurrentImageIndex,
    // ... other state and data
  } = useCarBooking(carId);

  const searchParams = useSearchParams();
  const [isBookingSectionVisible, setIsBookingSectionVisible] = useState(false);

  if (carLoading) return <p>Loading...</p>;
  if (carError) return <p>Error loading car details</p>;
  if (!car) return <p>No car details found.</p>;

  return (
    <div className={styles.bookingContainer}>
      <div className={styles.secondMainDiv}>
        <CarImages
          vehicle={car.vehicle}
          currentImageIndex={currentImageIndex}
          onPrevImage={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
          onNextImage={() => setCurrentImageIndex(currentImageIndex + 1)}
          onImageClick={(index) => setCurrentImageIndex(index)}
          onRentClick={() => setIsBookingSectionVisible(true)}
          showBookingButton={!!searchParams.get('pickupDate') && !!searchParams.get('dropoffDate')}
        />

        <div className={styles.rightSection}>
          <CarDetails
            car={car}
          />
          <ReviewSection reviews={reviews} />
        </div>

        {isBookingSectionVisible && (
          <BookingModal
            car={car}
            onClose={() => setIsBookingSectionVisible(false)}
            pickupDate={searchParams.get('pickupDate')}
            dropoffDate={searchParams.get('dropoffDate')}
          />
        )}
      </div>
    </div>
  );
};

export default CarBooking;