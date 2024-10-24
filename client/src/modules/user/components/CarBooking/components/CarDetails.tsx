
// src/components/CarBooking/components/CarDetails.tsx
import React from 'react';
import { Tooltip } from 'antd';
import { CarOutlined, FireOutlined, TeamOutlined } from '@ant-design/icons';
import styles from '../CarBooking.module.css';
import { RentableVehicle } from '../../../../../interfaces/user-interfaces/types';
import FloatingPrice from './FloatingPrice';

interface CarDetailsProps {
  car: RentableVehicle;
  onRentClick: () => void;
  showBookingButton: boolean;
}

export const CarDetails: React.FC<CarDetailsProps> = ({
  car,
  onRentClick,
  showBookingButton,
}) => {
  return (
    <div className={styles.carDetails}>
      <h2>
        {car.vehicle.name} <span>{car.vehicle.year}</span>
      </h2>
      <p className={styles.description}>
        {`${car.vehicle.description.substring(0, 300)}...`}
      </p>
      <FloatingPrice price={car.pricePerDay} />
      
      <div className={styles.specifications}>
        <div className={styles.detailItem}>
          <Tooltip title="Transmission">
            <CarOutlined /> {car.vehicle.transmission}
          </Tooltip>
        </div>
        <div className={styles.detailItem}>
          <Tooltip title="Fuel Type">
            <FireOutlined /> {car.vehicle.fuelType}
          </Tooltip>
        </div>
        <div className={styles.detailItem}>
          <Tooltip title="Number of Seats">
            <TeamOutlined /> {car.vehicle.numberOfSeats}
          </Tooltip>
        </div>
      </div>

      {showBookingButton && (
        <div className={styles.ownerSection}>
          <button className={styles.expandButton} onClick={onRentClick}>
            Rent Now
          </button>
        </div>
      )}
    </div>
  );
};