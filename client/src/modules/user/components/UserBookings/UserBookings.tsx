"use client";

import React, { useEffect, useState } from "react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import {
  List,
  Card,
  Spin,
  Result,
  Alert,
  Tag,
  Dropdown,
  Menu,
  Steps,
  Rate,
  message as antdMessage,
} from "antd";
import {
  DownOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  HistoryOutlined,
  EditOutlined,
} from "@ant-design/icons";
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
  status: string;
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

type TabType = 'ALL' | 'RETURN_IN_TRANSIT' | 'RETURNED';

const BookingList: React.FC = () => {
  const token = Cookies.get("userToken");
  const [fetchBookings, { loading, data, error }] = useLazyQuery(FETCH_BOOKINGS);
  const [addReview] = useMutation(ADD_REVIEW);
  const [dateRange, setDateRange] = useState<[string, string]>(["Aug 20, 2022", "Oct 20, 2022"]);
  const [activeTab, setActiveTab] = useState<TabType>('ALL');
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);

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

  useEffect(() => {
    if (data?.fetchBookings?.data) {
      const bookings = data.fetchBookings.data;
      let filtered;

      switch (activeTab) {
        case 'RETURN_IN_TRANSIT':
          filtered = bookings.filter((booking: Booking) => 
            booking.status === "booked" && new Date(booking.dropoffDate) >= new Date()
          );
          break;
        case 'RETURNED':
          filtered = bookings.filter((booking: Booking) => 
            booking.status === "released"
          );
          break;
        default:
          filtered = bookings;
      }

      setFilteredBookings(filtered);
    }
  }, [data, activeTab]);

  const getTabCounts = () => {
    if (!data?.fetchBookings?.data) return { all: 0, inTransit: 0, received: 0 };
    
    const bookings = data.fetchBookings.data;
    return {
      all: bookings.length,
      inTransit: bookings.filter((booking: Booking) => 
        booking.status === "booked" && new Date(booking.dropoffDate) >= new Date()
      ).length,
      received: bookings.filter((booking: Booking) => 
        booking.status === "released"
      ).length
    };
  };

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
            Authorization: `Bearer ${token}`,
          },
        },
      });
      if (data.addReview.status) {
        antdMessage.success("Review added successfully!");
        closeModal();
      } else {
        antdMessage.error(data.addReview.message || "Failed to add review.");
      }
    } catch (err) {
      antdMessage.error("Error submitting the review.");
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Alert message="Error" description={error.message} type="error" showIcon />
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

  const menu = (
    <Menu>
      <Menu.Item key="1">Last 30 days</Menu.Item>
      <Menu.Item key="2">Last 3 months</Menu.Item>
      <Menu.Item key="3">Last 6 months</Menu.Item>
    </Menu>
  );

  const tabCounts = getTabCounts();

  return (
    <div className={styles.bookingList}>
      <div className={styles.header}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'ALL' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('ALL')}
          >
            ALL ({tabCounts.all})
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'RETURN_IN_TRANSIT' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('RETURN_IN_TRANSIT')}
          >
            RETURN IN TRANSIT ({tabCounts.inTransit})
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'RETURNED' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('RETURNED')}
          >
            RETURNED ({tabCounts.received})
          </button>
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
        dataSource={filteredBookings}
        renderItem={(booking: Booking) => {
          const today = new Date().toISOString().split("T")[0];
          const isDropoffToday = booking.dropoffDate === today;
          let currentStep = 1;
          
          if (booking.status === "released" || isDropoffToday) {
            currentStep = 2;
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
                        <div>No Manufacturer Image</div>
                      )}

                      {booking.rentable?.vehicle?.primaryImageUrl ? (
                        <img
                          src={booking.rentable.vehicle.primaryImageUrl}
                          alt={booking.rentable.vehicle.name}
                          className={styles.vehicleImage}
                        />
                      ) : (
                        <div>No Vehicle Image</div>
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
                                <CheckCircleOutlined style={{ color: "green" }} />
                              ) : (
                                <ExclamationCircleOutlined style={{ color: "red" }} />
                              )
                            }
                            title={`Pickup Date: ${booking.pickupDate}`}
                            style={{ color: "black" }}
                          />
                          <Step
                            className={styles.steps}
                            icon={
                              currentStep >= 2 ? (
                                <CheckCircleOutlined style={{ color: "green" }} />
                              ) : (
                                <ExclamationCircleOutlined style={{ color: "orange" }} />
                              )
                            }
                            title={`Dropoff Date: ${booking.dropoffDate}`}
                            style={{ color: "black" }}
                          />
                        </Steps>
                      </div>

                      <div className={styles.bookingInfoDiv}>
                        <p>Payment Method: {booking?.paymentMethod}</p>
                        <p>Total Price: ₹{booking.totalPrice}</p>
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