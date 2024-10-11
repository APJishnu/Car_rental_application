"use client";
import React, { useState } from 'react';
import styles from './RentByCars.module.css';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { DatePicker } from 'antd';
import { GET_MANUFACTURERS } from '@/graphql/admin-queries/manufacture'; 


const { RangePicker } = DatePicker;

const FilterOptions: React.FC = () => {
  const router = useRouter();
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    if (dates) {
      setPickupDate(dateStrings[0]); // Set the pickup date
      setDropoffDate(dateStrings[1]); // Set the dropoff date
    } else {
      setPickupDate(''); // Clear dates if none are selected
      setDropoffDate('');
    }
  };

  const handleFindVehicle = () => {
    if (pickupDate && dropoffDate) {
      // Redirect to the find cars page with selected dates as query params
      router.push(`/user/find-cars?pickupDate=${pickupDate}&dropoffDate=${dropoffDate}`);
    } else {
      alert('Please select both pickup and dropoff dates');
    }
  };

  return (
    <div className={styles.filterSection}>
      <div className={styles.filterWrapper}>
        <div className={styles.filterItem}>
          <label htmlFor="pickup-date">Pick-up and Drop-off Date</label>
          <RangePicker
            format="YYYY-MM-DD" // Set the date format
            onChange={handleDateChange} // Handle date changes
            style={{ width: '100%' }} // Style to make it full width
            className={styles.DatePicker}
          />
        </div>
        <button className={styles.findVehicleBtn} onClick={handleFindVehicle}>Find a Vehicle</button>
      </div>
    </div>
  );
};


const Brands: React.FC = () => {
  const { loading, error, data } = useQuery(GET_MANUFACTURERS);

  if (loading) return <p>Loading manufacturers...</p>;
  if (error) return <p>Error fetching manufacturers: {error.message}</p>;

  // Limit to the first 12 manufacturers
  const limitedManufacturers = data.getManufacturers.slice(0, 8);

  return (
    <div className={styles.rentSection}>
      <div className={styles.rentHeader}>
        <h2>Rent by Manufacturers</h2>
        
      </div>
      <div className={styles.brandGrid}>
        {limitedManufacturers.map((manufacturer: any) => (
          <div key={manufacturer.id} className={styles.brandCard}>
            <img src={manufacturer.imageUrl} alt={manufacturer.name} className={styles.brandLogo} />
            <p>{manufacturer.name}</p>
          </div>
        ))}
      </div>
      <a href="/user/all-manufacturers" className={styles.viewAll}>View all &rarr;</a>
    </div>
  );
};

const RentByBrands: React.FC = () => {
  return (
    <>
      <FilterOptions />
      <Brands />
    </>
  );
};

export default RentByBrands;
