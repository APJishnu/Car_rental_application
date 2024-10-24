"use client";

import React, { useEffect, useState } from "react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import {
  List,
  Card,
  Image,
  Spin,
  Result,
  Alert,
  Tag,
  Dropdown,
  Menu,
  Steps,
  Rate,
  message as antdMessage, // For notification after submitting the review
} from "antd";
import {
  DownOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined, // Icon for reporting an issue
  HistoryOutlined, // Icon for viewing history
  EditOutlined, // Icon for adding a review
  CheckOutlined, // Icon for return accepted
} from "@ant-design/icons"; // Importing icons
import Cookies from "js-cookie";
import styles from "./UserBookings.module.css";
const { Step } = Steps;

// GraphQL Query
const FETCH_BOOKINGS = gql`
  query FetchBookings {
    fetchBookings {
      status
      statusCode
      message
      data {
        id
        vehicleId
        userId
        pickupDate
        dropoffDate
        status
        totalPrice
        razorpayOrderId
        paymentMethod
        rentable {
          id
          vehicleId
          pricePerDay
          availableQuantity
          vehicle {
            id
            name
            transmission
            fuelType
            numberOfSeats
            year
            primaryImageUrl
            manufacturer {
              id
              name
              country
              imageUrl
            }
          }
        }
      }
    }
  }
`;

// GraphQL Mutation
const ADD_REVIEW = gql`
  mutation AddReview(
    $bookingId: ID!
    $vehicleId: ID!
    $comment: String!
    $rating: Float!
  ) {
    addReview(
      bookingId: $bookingId
      vehicleId: $vehicleId
      comment: $comment
      rating: $rating
    ) {
      status
      message
    }
  }
`;

interface Booking {
  id: string;
  pickupDate: string;
  dropoffDate: string;
  totalPrice: number;
  paymentMethod: string;
  status: string; // Added status here
  rentable: {
    vehicleId: string;
    vehicle: {
      name: string;
      year: string;
      primaryImageUrl: string;
      manufacturer: {
        name: string;
        imageUrl: string;
      };
    };
  };
}

const BookingList: React.FC = () => {
  const token = Cookies.get("userToken");
  const [fetchBookings, { loading, data, error }] =
    useLazyQuery(FETCH_BOOKINGS);
  const [addReview] = useMutation(ADD_REVIEW);
  const [dateRange, setDateRange] = useState<[string, string]>([
    "Aug 20, 2022",
    "Oct 20, 2022",
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
  const [currentVehicleId, setCurrentVehicleId] = useState<string | null>(null);
  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number>(0);

  useEffect(() => {
    if (token) {
      fetchBookings({
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
    }
  }, [token, fetchBookings]);

  const openModal = (bookingId: string, vehicleId: string) => {
    setCurrentBookingId(bookingId);
    setCurrentVehicleId(vehicleId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setComment("");
    setRating(0);
  };

  const handleSubmitReview = async () => {
    if (!comment || rating === 0) {
      antdMessage.error("Please fill out all fields.");
      return;
    }

    try {
      const { data } = await addReview({
        variables: {
          bookingId: currentBookingId,
          vehicleId: currentVehicleId,
          comment,
          rating,
        },
        context: {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        },
      });
      if (data.addReview.status) {
        antdMessage.success("Review added successfully!");
        closeModal(); // Close modal after successful submission
      } else {
        antdMessage.error(data.addReview.message || "Failed to add review.");
      }
    } catch (err) {
      antdMessage.error("Error submitting the review.");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ marginTop: "20px" }}>
        <Alert
          message="Error"
          description={error.message}
          type="error"
          showIcon
        />
      </div>
    );
  }

  const {
    status,
    statusCode,
    message,
    data: bookings,
  } = data?.fetchBookings || {};

  if (status === false && statusCode === 401) {
    return (
      <Result
        status="403"
        title="Unauthorized Access"
        subTitle={message || "You are not authorized to view bookings."}
      />
    );
  }

  if (status === false && statusCode === 500) {
    return (
      <Result
        status="500"
        title="Server Error"
        subTitle={message || "There was a problem fetching your bookings."}
      />
    );
  }

  if (bookings?.length === 0 && statusCode === 200) {
    return (
      <Result
      style={{padding:"160px"}}
        status="404"
        title="No Bookings Found"
        subTitle={message || "It seems you haven't made any bookings yet."}
      />
    );
  }

  console.log(bookings);

  const menu = (
    <Menu>
      <Menu.Item key="1">Last 30 days</Menu.Item>
      <Menu.Item key="2">Last 3 months</Menu.Item>
      <Menu.Item key="3">Last 6 months</Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.bookingList}>
      <div className={styles.header}>
        <div className={styles.tabs}>
          <button className={styles.tabButton}>ALL (2)</button>
          <button className={styles.tabButton}>RETURN IN TRANSIT (2)</button>
          <button className={styles.tabButton}>RETURNS RECEIVED (0)</button>
        </div>
        <div className={styles.actions}>
          <Dropdown overlay={menu}>
            <button className={styles.dropdownButton}>
              {dateRange[0]} - {dateRange[1]} <DownOutlined />
            </button>
          </Dropdown>
          <button className={styles.primaryButton}>Request RTO</button>
        </div>
      </div>
      <List
        className={styles.cardsMainDiv}
        dataSource={bookings}
        renderItem={(booking: Booking) => {
          // Get today's date and format it to match the booking's dropoffDate format
          const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
          const isDropoffToday = booking.dropoffDate === today;

          // Determine the current step based on the booking's status and dropoff date
          let currentStep = 1; // Default to Pickup step
          if (booking.status === "released" || isDropoffToday) {
            currentStep = 2; // Set to Dropoff step if return is verified or dropoff is today
          }

          return (
            <List.Item>
              <Card className={styles.bookingCard}>
                <div className={styles.cardContent}>
                  <div className={styles.imageSection}>
                    <div className={styles.imageWrapper}>
                      {booking.rentable?.vehicle?.manufacturer?.imageUrl ? (
                        <img
                          src={booking.rentable.vehicle.manufacturer.imageUrl}
                          alt={booking.rentable.vehicle.manufacturer.name}
                          className={styles.manufacturerLogo}
                        />
                      ) : (
                        <div>No Manufacturer Image</div> // Fallback for missing image
                      )}

                      {booking.rentable?.vehicle?.primaryImageUrl ? (
                        <img
                          src={booking.rentable.vehicle.primaryImageUrl}
                          alt={booking.rentable.vehicle.name}
                          className={styles.vehicleImage}
                        />
                      ) : (
                        <div>No Vehicle Image</div> // Fallback for missing image
                      )}
                    </div>
                    <h3 className={styles.carName}>
                      {booking.rentable?.vehicle?.name || "Unknown Vehicle"} /{" "}
                      {booking.rentable?.vehicle?.year || "Unknown Year"}
                    </h3>
                  </div>

                  <div className={styles.detailsSection}>
                    <div className={styles.bookingDetailsDiv}>
                      <div className={styles.stepContainer}>
                        <Steps
                          className={styles.stepDiv}
                          direction="vertical"
                          current={currentStep}
                        >
                          <Step
                            className={styles.steps}
                            icon={
                              currentStep >= 1 ? (
                                <CheckCircleOutlined
                                  style={{ color: "green" }}
                                /> // Change color to black
                              ) : (
                                <ExclamationCircleOutlined
                                  style={{ color: "red" }}
                                /> // Change color to gray for the exclamation icon
                              )
                            }
                            title={`Pickup Date: ${booking.pickupDate}`}
                            style={{ color: "black" }} // Ensure the title is black
                          />
                          <Step
                            className={styles.steps}
                            icon={
                              currentStep >= 2 ? (
                                <CheckCircleOutlined
                                  style={{ color: "green" }}
                                /> // Change color to black
                              ) : (
                                <ExclamationCircleOutlined
                                  style={{ color: "orange" }}
                                /> // Change color to gray for the exclamation icon
                              )
                            }
                            title={`Dropoff Date: ${booking.dropoffDate}`}
                            style={{ color: "black" }} // Ensure the title is black
                          />
                        </Steps>
                      </div>

                      <div className={styles.bookingInfoDiv}>
                        <p>Payment Method: {booking?.paymentMethod}</p>
                        <p>Total Price: ₹{booking.totalPrice}</p>
                        {/* Status Handling */}
                        {booking.status === "released" ? (
                          <Tag
                            icon={<CheckCircleOutlined />}
                            className={styles.tags}
                            color="success"
                          >
                            Return Verified
                          </Tag>
                        ) : booking.status === "booked" ? (
                          <Tag
                            icon={<InfoCircleOutlined />}
                            className={styles.tags}
                            color="warning"
                          >
                            Booked
                          </Tag>
                        ) : (
                          <Tag
                            icon={<ExclamationCircleOutlined />}
                            className={styles.tags}
                            color="error"
                          >
                            Error
                          </Tag>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={styles.actionButtons}>
                    <button className={styles.actionButton}>
                      <QuestionCircleOutlined /> Report an Issue
                    </button>
                    <button className={styles.actionButton}>
                      <HistoryOutlined /> View History
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={() =>
                        openModal(booking.id, booking.rentable?.vehicleId)
                      }
                    >
                      <EditOutlined /> Add Review
                    </button>
                  </div>
                </div>
              </Card>
            </List.Item>
          );
        }}
      />

      {/* Custom Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Add a Review</h2>
            <label>
              Comment:
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review here"
              />
            </label>
            <label>
              Rating:
              <Rate
                value={rating}
                onChange={(value) => setRating(value)}
                allowHalf
              />
            </label>
            <div className={styles.modalActions}>
              <button onClick={handleSubmitReview}>Submit Review</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingList;
