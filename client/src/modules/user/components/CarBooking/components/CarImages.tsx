// src/components/CarBooking/components/CarImages.tsx
import React from "react";
import { Button, message } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import styles from "../CarBooking.module.css";
import { Vehicle } from "../../../../../interfaces/user-interfaces/types";

interface CarImagesProps {
  vehicle: Vehicle;
  currentImageIndex: number;
  onPrevImage: () => void;
  onNextImage: () => void;
  onImageClick: (index: number) => void;
  onRentClick: () => void;
  showBookingButton: boolean;
}

export const CarImages: React.FC<CarImagesProps> = ({
  vehicle,
  currentImageIndex,
  onPrevImage,
  onNextImage,
  onImageClick,
  onRentClick,
  showBookingButton,
}) => {

    // Function to handle "Add to Wishlist" click
    const handleAddToWishlist = () => {
      // Display a success message
      message.success("Added to Wishlist");
    };
  
  return (
    <div className={styles.leftSection}>
      <div className={styles.imageContainer}>
        <img
          src={
            currentImageIndex === 0
              ? vehicle.primaryImageUrl
              : vehicle.otherImageUrls[currentImageIndex - 1]
          }
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
      <div className={styles.BookingButtonsDiv}>
        <button className={styles.wishlistButton} onClick={handleAddToWishlist}>
          <HeartOutlined /> <span>Add to Wishlist</span>
        </button>

        {showBookingButton && (
          <button className={styles.rentNowButton} onClick={onRentClick}>
            <ShoppingCartOutlined /> <span>Rent Now</span>
          </button>
        )}
      </div>
    </div>
  );
};
