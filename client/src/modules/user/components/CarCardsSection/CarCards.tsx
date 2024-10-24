import React from 'react';
import styles from './CarCards.module.css';
import { DoubleRightOutlined,UserOutlined, CarFilled, FireFilled } from '@ant-design/icons'; 
import { Typography } from 'antd';

const { Text } = Typography;


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
        <div className={styles.headingDiv} style={{display:'flex',alignItems:'center',gap:'10px'}}> <DoubleRightOutlined style={{fontWeight:'100',color:'red'}}/> <h3> {`${model}`}</h3></div>
     
        <p className={styles.price}> <Text style={{color:'darkblue',fontSize:'18px'}}>{'₹'}</Text> {price} / DAY
        </p>

        
       
        <div className={styles.features}>
            <span><UserOutlined /> {features.passengers} Person</span>
            <span><CarFilled /> {features.transmission}</span>
            <span><FireFilled /> {features.fuelType}</span>
          </div>
        {totalPrice < 1 && (
        <button className={styles.rentButton} onClick={onRentNow}>
          Check Details 
        </button>
            )}
       
      </div>
      </div>
      {totalPrice > 0 && (
      <div className={styles.totalWithButton}>
        
          <div className={styles.totalPrice}> TOTAL<span>₹{totalPrice}</span></div>
     
       
        <button className={styles.rentButton} onClick={onRentNow}>
          Rent Now
        </button>
        </div>
      )}
    </div>
  );
};

export default CarCard;
