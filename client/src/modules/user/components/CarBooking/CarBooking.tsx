"use client";

import React, { useEffect, useState } from "react";
import styles from "./CarBooking.module.css";
import { useSearchParams } from "next/navigation";
import { gql, useQuery } from "@apollo/client";
import confetti from "canvas-confetti";

import { Tooltip, Rate, Input, Button, Progress } from "antd";
import {
  CarOutlined,
  TeamOutlined,
  FireOutlined,
  LeftOutlined,
  RightOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useBooking } from "../../services/booking-services"; // Import the custom hook
import Modal from "../../../../themes/Modal/Modal"; // Import the modal component

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
  id: string;
  bookingId: string;
  vehicleId: string;
  userId: string;
  comment: string;
  rating: number;
  user: {
    id: string;
    fullName: string;
    email: string;
    profileImage: string; // URL or path to the user's profile picture
  };
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

const FETCH_REVIEWS = gql`
  query FetchReviewsByVehicleId($vehicleId: ID!) {
    fetchReviews(vehicleId: $vehicleId) {
      id
      bookingId
      vehicleId
      userId
      comment
      rating
      user {
        id
        firstName
        lastName
        email
        profileImage
      }
    }
  }
`;

const CarBooking: React.FC<CarBookingProps> = ({ carId }) => {
  const [car, setCar] = useState<RentableVehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userContact, setUserContact] = useState<string>("");

  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [modalStatus, setModalStatus] = useState<"success" | "error" | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchParams = useSearchParams(); // Use `useSearchParams` to get search params

  // Get query params for pickupDate and dropoffDate
  const pickupDate = searchParams.get("pickupDate");
  const dropoffDate = searchParams.get("dropoffDate");

  const [isBookingSectionVisible, setIsBookingSectionVisible] =
    useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [numberOfDays, setNumberOfDays] = useState<number>(0);
  const [setGstPerDay, setIsGstPerDay] = useState<number>(0);
  const {
    loading: queryLoading,
    error: queryError,
    data,
  } = useQuery(GET_RENTABLE_VEHICLE_BY_ID, {
    variables: { id: carId },
    skip: !carId,
  });

  const {
    handleBooking,
    loading: mutationLoading,
    error: mutationError,
    data: mutationData,
  } = useBooking();
  const handlerfunction = (data: any) => {
    console.log(data, "data in carbooking");
    if (data && data.verifyPaymentAndCreateBooking.status === "success") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setModalMessage(
        data.verifyPaymentAndCreateBooking.message ||
          "Booking created successfully!"
      ); // Display success message
      setModalStatus("success");

      // setTimeout(() => {
      //   window.location.href = "/user/user-bookings"; // Change this to the correct path for user bookings
      // }, 5000);
    } else {
      setModalMessage(
        data.verifyPaymentAndCreateBooking?.message || "Something went wrong!"
      ); // Display error message
      setModalStatus("error");
    }
    setIsModalOpen(true); // Open the modal to show the message
  };

  const vehicleId = car?.vehicleId; // Get the vehicle ID from the fetched car data
  const {
    loading: reviewsLoading,
    error: reviewsError,
    data: reviewsData,
  } = useQuery(FETCH_REVIEWS, {
    variables: { vehicleId },
    skip: !vehicleId, // Skip the query if vehicleId is not available
  });

  useEffect(() => {
    if (reviewsData) {
      const fetchedReviews = reviewsData.fetchReviews.map((review: any) => ({
        id: review.id,
        bookingId: review.bookingId,
        vehicleId: review.vehicleId,
        userId: review.userId,
        comment: review.comment,
        rating: review.rating,
        user: {
          id: review.user.id,
          fullName: `${review.user.firstName} ${review.user.lastName}`, // Combine first and last names
          email: review.user.email,
          profileImage: review.user.profileImage || "/default-profile.png", // Default profile picture if missing
        },
      }));

      setReviews(fetchedReviews); // Update the state with fetched reviews
    }

    if (reviewsError) {
      console.error("Error fetching reviews:", reviewsError);
    }
  }, [reviewsData, reviewsError]);

  useEffect(() => {
    if (data) {
      setCar(data.rentableVehicleWithId);
    }
    if (queryError) {
      setError("Error fetching data!");
    }
    setLoading(queryLoading);
  }, [data, queryLoading, queryError]);

  // const [isBookingSectionVisible, setIsBookingSectionVisible] = useState<boolean>(false);
  const [currentPrimaryImage, setCurrentPrimaryImage] = useState<string>(
    car?.vehicle.primaryImageUrl || ""
  ); // Default to empty string

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  console.log(reviews);
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
    const distribution: { [key: number]: number } = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };
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

  const GST_PERCENTAGE = 0.18; // Assuming GST is 18%

  useEffect(() => {
    if (pickupDate && dropoffDate) {
      const startDate = new Date(pickupDate);
      const endDate = new Date(dropoffDate);
      const diffTime = Math.abs(startDate.getTime() - endDate.getTime());
      const numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Calculate number of days
      setNumberOfDays(numberOfDays);

      // Calculate base price
      const basePrice = parseFloat(car?.pricePerDay || "0") * numberOfDays;

      // Calculate GST
      const gst = basePrice * GST_PERCENTAGE;

      // Set total price
      const totalPriceWithGst = basePrice + gst;

      setTotalPrice(totalPriceWithGst);
      setIsGstPerDay(gst); // Set the GST value per day
    }
  }, [pickupDate, dropoffDate, car]);

  const handleConfirmRent = async (userContact: any) => {
    // Check if user contact information is provided
    if (!userContact) {
      setModalMessage("Please enter your contact information.");
      setModalStatus("error");
      setIsModalOpen(true);
      return;
    }

    // Proceed if a car is selected
    if (car) {
      const bookingData = {
        vehicleId: car.vehicleId,
        pickupDate: pickupDate!,
        dropoffDate: dropoffDate!,
        totalPrice,
        userContact,
      };

      try {
        // Call the createBooking function from the useBooking hook
        const response = await handleBooking(bookingData, handlerfunction);

        console.log("response in handleBooking", response);

        if (response != undefined) {
          // Ensure response is defined before accessing its properties
          if (response && response?.status === "success") {
            setModalMessage(
              response.message || "Booking created successfully!"
            ); // Display success message
            setModalStatus("success");
          } else {
            setModalMessage(response?.message || "Something went wrong!"); // Display error message
            setModalStatus("error");
          }
          setIsModalOpen(true); // Open the modal to show the message
        }
      } catch (err) {
        // Handle any errors that occur during the booking process
        console.error("Error during booking:", err);
        setModalMessage("Error occurred while creating the booking.");
        setModalStatus("error");
        setIsModalOpen(true); // Open the modal on error
      } finally {
        setIsBookingSectionVisible(false); // Hide the booking section
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage(null);
    setModalStatus(null);
  };

  // Helper function to format the date
  const formatDate = (dateString: any) => {
    if (!dateString) return "Not selected"; // Handle empty dates
    const date = new Date(dateString);
    const options: any = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
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
          <h2>
            {car.vehicle.name} <span>{car.vehicle.year}</span>
          </h2>

          <p className={styles.description}>
            {" "}
            {`${car.vehicle.description.substring(0, 300)}...`}
          </p>
          <p className={styles.price}>{`₹${car.pricePerDay} / day`}</p>

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
            <p>
              <strong>Owner:</strong> {/* Owner data can be added here */}
            </p>
            <button
              className={styles.expandButton}
              onClick={handleToggleBooking}
            >
              {isBookingSectionVisible ? "Hide Booking" : "Rent Now"}
            </button>
          </div>

          <div className={styles.reviewSection}>
            <h3>User Reviews</h3>
            <div className={styles.reviewSummary}>
              <Rate
                value={calculateOverallRating()}
                disabled
                allowHalf
                style={{ color: "black" }}
              />
              <p>{`Overall Rating: ${calculateOverallRating().toFixed(1)} / 5 ★`}</p>
            </div>

            <div className={styles.ratingDistribution}>
              <div className={styles.ratingItem}>
                <Progress
                  type="circle"
                  percent={(ratingDistribution[5] / reviews.length) * 100}
                  format={() => "5 ★"}
                  strokeColor="#40A578"
                  size={80}
                />
                <p>5 Stars</p>
              </div>
              <div className={styles.ratingItem}>
                <Progress
                  type="circle"
                  percent={(ratingDistribution[4] / reviews.length) * 100}
                  format={() => "4 ★"}
                  strokeColor="#52c41a"
                  size={80}
                />
                <p>4 Stars</p>
              </div>
              <div className={styles.ratingItem}>
                <Progress
                  type="circle"
                  percent={(ratingDistribution[3] / reviews.length) * 100}
                  format={() => "3 ★"}
                  strokeColor="#fadb14"
                  size={80}
                />
                <p>3 Stars</p>
              </div>
              <div className={styles.ratingItem}>
                <Progress
                  type="circle"
                  percent={(ratingDistribution[2] / reviews.length) * 100}
                  format={() => "2 ★"}
                  strokeColor="#faad14"
                  size={80}
                />
                <p>2 Stars</p>
              </div>
              <div className={styles.ratingItem}>
                <Progress
                  type="circle"
                  percent={(ratingDistribution[1] / reviews.length) * 100}
                  format={() => "1 ★"}
                  strokeColor="#ff4d4f"
                  size={80}
                />
                <p>1 Star</p>
              </div>
            </div>
            <div className={styles.reviews}>
              {reviews.slice(0, 5).map((review, index) => (
                <div key={index} className={styles.reviewItem}>
                  <img
                    src={review.user.profileImage}
                    alt={`${review.user.fullName}'s profile`}
                    className={styles.userImage}
                  />
                  <div className={styles.reviewContent}>
                    <h4>{review.user.fullName}</h4> {/* Display full name */}
                    <p>{review.user.email}</p> {/* Display user email */}
                    <Rate
                      value={review.rating}
                      allowHalf
                      disabled
                      style={{ color: "black", fontSize: "12px" }}
                    />
                    <p>{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* modal */}

        <div
          className={`${styles.confirmOverlay} ${isBookingSectionVisible ? styles.visible : ""}`}
        >
          <div className={styles.confirmOverlayContent}>
            <CloseOutlined
              className={styles.closeButton}
              onClick={() => setIsBookingSectionVisible(false)}
            />

            <h1 className={styles.modalTitle}>Confirm Your Rental</h1>
            <div className={styles.cardModal}>
              <div className={styles.dateModal}>
                <div className={styles.dateModalDotDiv}>
                  <p>
                    <span> {formatDate(pickupDate)}</span>
                  </p>
                  <p>
                    <strong>TO</strong>
                  </p>
                  <p>
                    <span> {formatDate(dropoffDate)}</span>
                  </p>
                </div>
              </div>
              <div className={styles.modalContent}>
                <div className={styles.carImageContainer}>
                  <img
                    src={car.vehicle.primaryImageUrl}
                    alt="Car"
                    className={styles.carImage}
                  />
                </div>
              </div>
            </div>

            <div className={styles.secondCard}>
              <div className={styles.rideInfo}>
                <table className={styles.priceTable}>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Price per Day:</strong>
                      </td>
                      <td>₹{car?.pricePerDay || "0.00"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Number of Days:</strong>
                      </td>
                      <td>{numberOfDays} Days</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Base Price:</strong>
                      </td>
                      <td>
                        ₹{parseFloat(car?.pricePerDay || "0") * numberOfDays}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>
                          GST ({(GST_PERCENTAGE * 100).toFixed(2)}%):
                        </strong>
                      </td>
                      <td>₹{setGstPerDay?.toFixed(2)}</td>{" "}
                      {/* Assuming GST is calculated per day */}
                    </tr>
                    <tr>
                      <td>
                        <strong>Total Price:</strong>
                      </td>
                      <td>
                        <strong>₹{totalPrice.toFixed(2)}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={styles.inputWithButton}>
                <Input
                  className={styles.confirmInput}
                  type="text"
                  placeholder="Enter your contact number"
                  onChange={(e) => setUserContact(e.target.value)}
                />
                <Button
                  className={styles.modalButton}
                  type="text"
                  onClick={() => handleConfirmRent(userContact)}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && modalMessage && modalStatus && (
        <Modal
          message={modalMessage}
          status={modalStatus}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default CarBooking;
