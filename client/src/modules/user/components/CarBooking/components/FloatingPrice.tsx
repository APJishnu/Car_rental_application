// FloatingPrice.tsx
import React from 'react';
import styles from './FloatingPrice.module.css';

// Define the props interface
interface FloatingPriceProps {
  price: String; // Specify that price is a number
}

const FloatingPrice: React.FC<FloatingPriceProps> = ({ price }) => {
  return (
    <div className={styles.container}>
      <p className={styles.priceText}>₹{price} / day</p>
      
      <div className={styles.moneyLayer}>
        {/* Coins */}
        <div className={`${styles.coin} ${styles.coin1}`}>₹</div>
        <div className={`${styles.coin} ${styles.coin2}`}>₹</div>
        <div className={`${styles.coin} ${styles.coin3}`}>₹</div>
        
        {/* Notes */}
        <div className={`${styles.note} ${styles.note1}`}>₹</div>
        <div className={`${styles.note} ${styles.note2}`}>₹</div>
        <div className={`${styles.note} ${styles.note3}`}>₹</div>
      </div>
    </div>
  );
};

export default FloatingPrice;
