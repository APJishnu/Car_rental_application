"use client";
import React from 'react';
import styles from './RentByCars.module.css';
import { useQuery } from '@apollo/client';
import { GET_MANUFACTURERS } from '@/graphql/admin-queries/manufacture'; 

const FilterOptions: React.FC = () => {
  return (
    <div className={styles.filterSection}>
      <div className={styles.filterWrapper}>
        <div className={styles.filterItem}>
          <label htmlFor="pickup-location">Pick-up Location</label>
          <input type="text" id="pickup-location" placeholder="Search a location" />
        </div>
        <div className={styles.filterItem}>
          <label htmlFor="pickup-date">Pick-up Date</label>
          <input type="date" id="pickup-date" />
        </div>
        <div className={styles.filterItem}>
          <label htmlFor="dropoff-location">Drop-off Location</label>
          <input type="text" id="dropoff-location" placeholder="Search a location" />
        </div>
        <div className={styles.filterItem}>
          <label htmlFor="dropoff-date">Drop-off Date</label>
          <input type="date" id="dropoff-date" />
        </div>
        <button className={styles.findVehicleBtn}>Find a Vehicle</button>
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
      {/* <FilterOptions /> */}
      <Brands />
    </>
  );
};

export default RentByBrands;
