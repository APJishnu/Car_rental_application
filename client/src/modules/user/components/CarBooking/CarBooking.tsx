import React, { useState } from 'react';
import styles from './CarBooking.module.css';

interface CarBookingProps {
  car: {
    image: string;
    model: string;
    price: string;
    features: { passengers: string; transmission: string; fuelType: string };
    year: string;
    seats: string;
    mileage: string;
    description: string;
    owner: string;
    ownerImage: string;
  };
}

const CarBooking: React.FC<CarBookingProps> = ({ car }) => {
  const [isBookingSectionVisible, setIsBookingSectionVisible] = useState<boolean>(false);

  const handleToggleBooking = () => {
    setIsBookingSectionVisible((prevVisible) => !prevVisible);
  };

  return (
    <div className={styles.bookingContainer}>
      <div className={styles.secondMainDiv}>
      {/* Left Section with Car Image */}
      <div className={styles.leftSection}>
        <img src={car.image} alt={car.model} className={styles.carImage} />
      </div>

      {/* Right Section with Car Details, Owner Info, and Booking */}
      <div className={styles.rightSection}>
        <h2>{car.model}</h2>
        <p className={styles.price}>{`$${car.price} / day`}</p>
        <div className={styles.specifications}>
          <p><strong>Transmission:</strong> {car.features.transmission}</p>
          <p><strong>Year:</strong> {car.year}</p>
          <p><strong>Seats:</strong> {car.seats}</p>
          <p><strong>Mileage:</strong> {car.mileage}</p>
          <p><strong>Fuel Type:</strong> {car.features.fuelType}</p>
          <p><strong>Passengers:</strong> {car.features.passengers}</p>
        </div>
        <p className={styles.description}>{car.description}</p>

        {/* Owner Information */}
        <div className={styles.ownerSection}>
          <div className={styles.ownerInfo}>
            <img src={'/carImages/Testimonials/Profile.svg'} alt={car.owner} className={styles.ownerImage} />
            <p>{car.owner}</p>
          </div>
           {/* Rent Now Button */}
        <button className={styles.expandButton} onClick={handleToggleBooking}>
          {isBookingSectionVisible ? 'Hide Booking' : 'Rent Now'}
        </button>
        </div>

       
      </div>

      {/* Mobile Booking Form Overlay */}
      <div className={`${styles.overlay} ${isBookingSectionVisible ? styles.visible : ''}`}>
        <div className={styles.overlayContent}>
          <button className={styles.closeButton} onClick={handleToggleBooking}>×</button>
          <h3>Where are you going?</h3>
          <div className={styles.formGroup}>
            <input type="text" placeholder="Start Location" className={styles.inputField} />
            <input type="text" placeholder="Destination" className={styles.inputField} />
          </div>
          <button className={styles.bookButton}>Rent Car</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CarBooking;
