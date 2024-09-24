import React from 'react';
import styles from './RentByCars.module.css';

// Define the type for the brand
interface Brand {
  id: string;  // Unique identifier
  name: string;
  logo: string;
}

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

    const brands: Brand[] = [
      { id: '1', name: 'Toyota', logo: '/carImages/carBrands/toyota.svg' },
      { id: '2', name: 'Ford', logo: '/carImages/carBrands/ford.svg' },
      { id: '3', name: 'Tesla', logo: '/carImages/carBrands/tesla.svg' },
      { id: '4', name: 'Volkswagen', logo: '/carImages/carBrands/volkswagen.svg' },
      { id: '5', name: 'Honda', logo: '/carImages/carBrands/honda.svg' },
      { id: '6', name: 'Nissan', logo: '/carImages/carBrands/nissan.svg' },
      { id: '7', name: 'Chevrolet', logo: '/carImages/carBrands/chevrolet.svg' },
      { id: '8', name: 'BMW', logo: '/carImages/carBrands/bmw.svg' },
      { id: '9', name: 'Mercedes-Benz', logo: '/carImages/carBrands/mercedes-benz.svg' },
      { id: '10', name: 'Hyundai', logo: '/carImages/carBrands/hyundai.svg' },
      { id: '11', name: 'Audi', logo: '/carImages/carBrands/audi.svg' },
      { id: '12', name: 'KIA', logo: '/carImages/carBrands/kia.svg' },
  ];

  return (
    <div className={styles.rentSection}>
      <div className={styles.rentHeader}>
        <h2>Rent by Brands</h2>
        <a href="/all" className={styles.viewAll}>View all &rarr;</a>
      </div>
      <div className={styles.brandGrid}>
        {brands.map((brand) => (
          <div key={brand.id} className={styles.brandCard}> {/* Use brand ID as the key */}
            <img src={brand.logo} alt={brand.name} className={styles.brandLogo} />
            <p>{brand.name}</p>
          </div>
        ))}
      </div>
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
