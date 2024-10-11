import React from 'react';
import styles from './CarCards.module.css';

interface CarCardProps {
  image: string;
  model: string;
  price: string;
  totalPrice:number;
  features: {
    passengers: string;
    transmission: string;
    fuelType: string;
  };
  onRentNow: () => void; // Callback for "Rent Now" button click
}

const CarCard: React.FC<CarCardProps> = ({ image, model, price,totalPrice, features, onRentNow }) => {
  return (
    <div className={styles.carCard}>
      <div className={styles.secondCard}>
      <img src={image} alt={model} className={styles.carImage} />
      <div className={styles.carDetails}>
        <h3>{model}</h3>
        <p className={styles.price}>${price} / day</p>
        
       
        <div className={styles.features}>
          <span>{features.passengers} Person</span>
          <span>{features.transmission}</span>
          <span>{features.fuelType}</span>
        </div>
        {totalPrice < 1 && (
        <button className={styles.rentButton} onClick={onRentNow}>
          Rent Now
        </button>
            )}
       
      </div>
      </div>
      {totalPrice > 0 && (
      <div className={styles.totalWithButton}>
        
          <div className={styles.totalPrice}> TOTAL<span>${totalPrice}</span></div>
     
       
        <button className={styles.rentButton} onClick={onRentNow}>
          Rent Now
        </button>
        </div>
      )}
    </div>
  );
};

export default CarCard;
