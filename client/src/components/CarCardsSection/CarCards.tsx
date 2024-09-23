import React from 'react';
import styles from './CarCards.module.css';

interface CarCardProps {
  image: string;
  model: string;
  price: string;
  features: { passengers: string, transmission: string, fuelType: string };
}

const CarCard: React.FC<CarCardProps> = ({ image, model, price, features }) => {
  return (
    <div className={styles.carCard}>
      <img src={image} alt={model} className={styles.carImage} />
      <div className={styles.carDetials}>
      <h3>{model}</h3>
      <p className={styles.price}>{price} /day</p>
      <div className={styles.features}>
        <span>{features.passengers} Person</span>
        <span>{features.transmission}</span>
        <span>{features.fuelType}</span>
      </div>
      
      <button className={styles.rentButton}>Rent Now</button>
      </div>
    </div>
  );
};

export default CarCard;
