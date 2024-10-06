"use client";

import React, { useEffect, useState } from "react";
import styles from "./CarBooking.module.css";
import { gql, useQuery } from "@apollo/client";
import { Tooltip, Rate, Input, Button, Progress } from "antd";

import { CarOutlined, TeamOutlined, FireOutlined,LeftOutlined, RightOutlined } from '@ant-design/icons';

interface Vehicle {
  id: string;
  name: string;
  description: string;
  transmission: string;
  fuelType: string;
  numberOfSeats: string;
  year: string;
  primaryImageUrl: string;
  otherImageUrls: string[]; // Array for additional images
  manufacturer: {
    id: string;
    name: string;
    country: string;
    imageUrl: string;
  };
}

interface Review {
  userName: string;
  rating: number;
  comment: string;
  userReviewImage: string; // New field for user profile image
}


interface RentableVehicle {
  vehicleId: string;
  pricePerDay: string;
  availableQuantity: number;
  vehicle: Vehicle;
}

interface CarBookingProps {
  carId: string;
}

// GraphQL Query to get the details of a specific rentable vehicle by ID
const GET_RENTABLE_VEHICLE_BY_ID = gql`
  query GetRentableVehicleById($id: ID!) {
    rentableVehicleWithId(id: $id) {
      id
      vehicleId
      pricePerDay
      availableQuantity
      vehicle {
        id
        name
        description
        transmission
        fuelType
        numberOfSeats
        year
        primaryImageUrl
        otherImageUrls
        manufacturer {
          id
          name
          country
          imageUrl
        }
      }
    }
  }
`;

const CarBooking: React.FC<CarBookingProps> = ({ carId }) => {
  const [car, setCar] = useState<RentableVehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const { loading: queryLoading, error: queryError, data } = useQuery(GET_RENTABLE_VEHICLE_BY_ID, {
    variables: { id: carId },
    skip: !carId,
  });

  useEffect(() => {
    if (data) {
      setCar(data.rentableVehicleWithId);
    }
    if (queryError) {
      setError("Error fetching data!");
    }
    setLoading(queryLoading);



    setReviews([
      { userName: "John Doe", rating: 5, comment: "Great experience!", userReviewImage: "/profile.svg" },
      { userName: "Jane Smith", rating: 5, comment: "Fantastic car!", userReviewImage: "/profile.svg" },
      { userName: "Peter Parker", rating: 5, comment: "Good, but could be better.", userReviewImage: "/profile.svg" },
      { userName: "Peter Parker", rating: 2, comment: "Good, but could be better.", userReviewImage: "/profile.svg" },
      { userName: "Peter Parker", rating: 5, comment: "Good, but could be better.", userReviewImage: "/profile.svg" },
      { userName: "Peter Parker", rating: 4, comment: "Good, but could be better.", userReviewImage: "/profile.svg" },
      { userName: "Peter Parker", rating: 5, comment: "Good, but could be better.", userReviewImage: "/profile.svg" },
      { userName: "Peter Parker", rating: 5, comment: "Good, but could be better.", userReviewImage: "/profile.svg" },
      { userName: "Peter Parker", rating: 5, comment: "Good, but could be better.", userReviewImage: "/profile.svg" },
      { userName: "Peter Parker", rating: 4, comment: "Good, but could be better.", userReviewImage: "/path/to/peter-image.jpg" },
      { userName: "Peter Parker", rating: 3, comment: "Good, but could be better.", userReviewImage: "/path/to/peter-image.jpg" },
      { userName: "Peter Parker", rating: 3, comment: "Good, but could be better.", userReviewImage: "/path/to/peter-image.jpg" },
      { userName: "Mary Jane", rating: 5, comment: "Loved it!", userReviewImage: "/path/to/mary-image.jpg" },
      { userName: "Mary Jane", rating: 4, comment: "Loved it!", userReviewImage: "/path/to/mary-image.jpg" },
      { userName: "Mary Jane", rating: 1, comment: "Loved it!", userReviewImage: "/path/to/mary-image.jpg" },
    ]);

  }, [data, queryLoading, queryError]);

  const [isBookingSectionVisible, setIsBookingSectionVisible] = useState<boolean>(false);
  const [currentPrimaryImage, setCurrentPrimaryImage] = useState<string>(car?.vehicle.primaryImageUrl || ""); // Default to empty string

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);


  // Set the primary image on initial load
  useEffect(() => {
    if (car) {
      setCurrentPrimaryImage(car.vehicle.primaryImageUrl);
    }
  }, [car]);

  const handleToggleBooking = () => {
    setIsBookingSectionVisible((prevVisible) => !prevVisible);
  };

  // Function to change the primary image
  const handleImageClick = (imageUrl: string) => {
    setCurrentPrimaryImage(imageUrl);
  };



  const calculateOverallRating = (): number => {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  const getRatingDistribution = (): { [key: number]: number } => {
    const distribution: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();


  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < (car?.vehicle.otherImageUrls.length || 0)) {
      setCurrentImageIndex((prevIndex) => prevIndex + 1);
    }
  };


  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!car) {
    return <p>No car details found.</p>;
  }

  return (
    <div className={styles.bookingContainer}>
      <div className={styles.secondMainDiv}>
        {/* Left Section with Car Image */}
        <div className={styles.leftSection}>
        <div className={styles.imageContainer}>

            <img
              src={
                currentImageIndex === 0
                  ? car.vehicle.primaryImageUrl
                  : car.vehicle.otherImageUrls[currentImageIndex - 1] // Show other image if index is greater than 0
              }
              alt={car.vehicle.name}
              className={styles.displayImage}
            />
           
          </div>
<div className={styles.additionalImagesDiv}>
          <Button
              className={styles.scrollButton}
              onClick={handlePrevImage} // Scroll left
              icon={<LeftOutlined />}
              disabled={currentImageIndex === 0} // Disable if showing primary image
            />
          {/* Additional Images Section */}
          <div className={styles.additionalImages}>
            {car.vehicle.otherImageUrls.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`${car.vehicle.name} additional ${index + 1}`}
                className={styles.additionalImage}
                onClick={() => setCurrentImageIndex(index + 1)} // Change current index on click
              />
            ))}
          </div>
          <Button
              className={styles.scrollButton}
              onClick={handleNextImage} // Scroll right
              icon={<RightOutlined />}
              disabled={currentImageIndex >= car.vehicle.otherImageUrls.length} // Disable if no other images
            />
        </div>
        </div>

        {/* Right Section with Car Details and Booking */}
        <div className={styles.rightSection}>
          <h2>{car.vehicle.name} <span>{car.vehicle.year}</span></h2>

          <p className={styles.description}> {`${car.vehicle.description.substring(0, 300)}...`}</p>
          <p className={styles.price}>{`$${car.pricePerDay} / day`}</p>

          {/* Vehicle Info (Transmission, Fuel Type, Number of Seats) */}
          <div className={styles.specifications}>
            <div className={styles.detailItem}>
              <Tooltip title="Transmission">
                <CarOutlined /> {car.vehicle.transmission}
              </Tooltip>
            </div>
            <div className={styles.detailItem}>
              <Tooltip title="Fuel Type">
                <FireOutlined /> {car.vehicle.fuelType}
              </Tooltip>
            </div>
            <div className={styles.detailItem}>
              <Tooltip title="Number of Seats">
                <TeamOutlined /> {car.vehicle.numberOfSeats}
              </Tooltip>
            </div>
          </div>


          <div className={styles.ownerSection}>
            <p><strong>Owner:</strong> {/* Owner data can be added here */}</p>
            <button className={styles.expandButton} onClick={handleToggleBooking}>
              {isBookingSectionVisible ? "Hide Booking" : "Rent Now"}
            </button>
          </div>





          <div className={styles.reviewSection}>
            <h3>User Reviews</h3>
            <div className={styles.reviewSummary}>
              <Rate value={calculateOverallRating()} disabled />
              <p>{`Overall Rating: ${calculateOverallRating().toFixed(1)} / 5 ★`}</p>
            </div>

            <div className={styles.ratingDistribution}>
              <div className={styles.ratingItem}>
                <Progress
                  type="circle"
                  percent={(ratingDistribution[5] / reviews.length) * 100}
                  format={() => '5 ★'} 
                  strokeColor="#40A578"
                  size={80}
                  
                />
                <p>5 Stars</p>
              </div>
              <div className={styles.ratingItem}>
                <Progress
                  type="circle"
                  percent={(ratingDistribution[4] / reviews.length) * 100}
                  format={() => '4 ★'} 
                  strokeColor="#52c41a"
                  size={80}
                />
                <p>4 Stars</p>
              </div>
              <div className={styles.ratingItem}>
                <Progress
                  type="circle"
                  percent={(ratingDistribution[3] / reviews.length) * 100}
                  format={() => '3 ★'} 
                  strokeColor="#fadb14"
                  size={80}
                />
                <p>3 Stars</p>
              </div>
              <div className={styles.ratingItem}>
                <Progress
                  type="circle"
                  percent={(ratingDistribution[2] / reviews.length) * 100}
                  format={() => '2 ★'} 
                  strokeColor="#faad14"
                  size={80}
                  
               
                />
                <p>2 Stars</p>
              </div>
              <div className={styles.ratingItem}>
                <Progress
                  type="circle"
                  percent={(ratingDistribution[1] / reviews.length) * 100}
                  format={() => '1 ★'} 
                  strokeColor="#ff4d4f"
                  size={80}
                  
                />
                <p>1 Star</p>
              </div>
            </div>

            {reviews.slice(0, 5).map((review, index) => (
              <div key={index} className={styles.reviewItem}>
                <img
                  src={review.userReviewImage}
                  alt={`${review.userName}'s profile`}
                  className={styles.userImage}
                />
                <div className={styles.reviewContent}>
                  <h4>{review.userName}</h4>
                  <Rate value={review.rating} disabled />
                  <p>{review.comment}</p>
                </div>
              </div>
            ))}
          </div>

        </div>


        {/* Mobile Booking Form Overlay */}
        <div className={`${styles.overlay} ${isBookingSectionVisible ? styles.visible : ""}`}>
          <div className={styles.overlayContent}>
            <button className={styles.closeButton} onClick={handleToggleBooking}>×</button>
            <h3>Where are you going?</h3>
            <div className={styles.formGroup}>
              <input type="text" placeholder="Start Location" className={styles.inputField} />
              <input type="text" placeholder="Destination" className={styles.inputField} />
            </div>
            <button className={styles.bookButton}>Rent Car</button>
          </div>
        </div>



      </div>
    </div>
  );
};

export default CarBooking;
