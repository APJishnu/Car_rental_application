import React from 'react';
import styles from './RentByCars.module.css';

const FilterOptions = () => {
  return (
    <div className={styles.filterSection}>
      <div className={styles.filterWrapper}>
        <div className={styles.filterItem}>
          <label>Pick-up Location</label>
          <input type="text" placeholder="Search a location" />
        </div>
        <div className={styles.filterItem}>
          <label>Pick-up date</label>
          <input type="date" />
        </div>
        <div className={styles.filterItem}>
          <label>Drop-off Location</label>
          <input type="text" placeholder="Search a location" />
        </div>
        <div className={styles.filterItem}>
          <label>Drop-off date</label>
          <input type="date" />
        </div>
        <button className={styles.findVehicleBtn}>Find a Vehicle</button>
      </div>
    </div>
  );
};

const Brands = () => {
  const brands = [
    { name: 'Toyota', logo: '/carImages/carBrands/toyota.svg' },
    { name: 'Ford', logo: '/carImages/carBrands/ford.svg' },
    { name: 'Tesla', logo: '/carImages/carBrands/tesla.svg' },
    { name: 'Volkswagen', logo: '/carImages/carBrands/volkswagen.svg' },
    { name: 'Honda', logo: '/carImages/carBrands/honda.svg' },
    { name: 'Nissan', logo: '/carImages/carBrands/nissan.svg' },
    { name: 'Chevrolet', logo: '/carImages/carBrands/chevrolet.svg' },
    { name: 'BMW', logo: '/carImages/carBrands/bmw.svg' },
    { name: 'Mercedes-Benz', logo: '/carImages/carBrands/mercedes-benz.svg' },
    { name: 'Hyundai', logo: '/carImages/carBrands/hyundai.svg' },
    { name: 'Audi', logo: '/carImages/carBrands/audi.svg' },
    { name: 'KIA', logo: '/carImages/carBrands/kia.svg' },
  ];

  return (
    <div className={styles.rentSection}>
      <div className={styles.rentHeader}>
        <h2>Rent by Brands</h2>
        <a href="#" className={styles.viewAll}>View all &rarr;</a>
      </div>
      <div className={styles.brandGrid}>
        {brands.map((brand, index) => (
          <div key={index} className={styles.brandCard}>
            <img src={brand.logo} alt={brand.name} className={styles.brandLogo} />
            <p>{brand.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const RentByBrands : React.FC = () => {
  return (
    <>
      <FilterOptions />
      <Brands />
    </>
  );
};

export default RentByBrands;
