// src/components/CarBooking/components/CarImages.tsx
import React from 'react';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import styles from '../CarBooking.module.css';
import { Vehicle } from '../../../../../interfaces/user-interfaces/types';

interface CarImagesProps {
  vehicle: Vehicle;
  currentImageIndex: number;
  onPrevImage: () => void;
  onNextImage: () => void;
  onImageClick: (index: number) => void;
}

export const CarImages: React.FC<CarImagesProps> = ({
  vehicle,
  currentImageIndex,
  onPrevImage,
  onNextImage,
  onImageClick,
}) => {
  return (
    <div className={styles.leftSection}>
      <div className={styles.imageContainer}>
        <img
          src={currentImageIndex === 0 
            ? vehicle.primaryImageUrl 
            : vehicle.otherImageUrls[currentImageIndex - 1]}
          alt={vehicle.name}
          className={styles.displayImage}
        />
      </div>
      <div className={styles.additionalImagesDiv}>
        <Button
          className={styles.scrollButton}
          onClick={onPrevImage}
          icon={<LeftOutlined />}
          disabled={currentImageIndex === 0}
        />
        <div className={styles.additionalImages}>
          {vehicle.otherImageUrls.map((imageUrl, index) => (
            <img
              key={index}
              src={imageUrl}
              alt={`${vehicle.name} additional ${index + 1}`}
              className={styles.additionalImage}
              onClick={() => onImageClick(index + 1)}
            />
          ))}
        </div>
        <Button
          className={styles.scrollButton}
          onClick={onNextImage}
          icon={<RightOutlined />}
          disabled={currentImageIndex >= vehicle.otherImageUrls.length}
        />
      </div>
    </div>
  );
};
