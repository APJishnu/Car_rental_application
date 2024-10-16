"use client"

import React, { useEffect, useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { List, Card, Image, Spin, Result, Alert, Button, Tag, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import styles from "./page.module.css";

// GraphQL Query to fetch all bookings
const FETCH_ALL_BOOKINGS = gql`
  query FetchAllBookings {
    fetchAllBookings {
      status
      statusCode
      message
      data {
        id
        vehicleId
        userId
        pickupDate
        dropoffDate
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

// Component to list bookings
const BookingList: React.FC = () => {
  const token = Cookies.get("adminToken");
  const [fetchBookings, { loading, data, error }] = useLazyQuery(FETCH_ALL_BOOKINGS);
  const [dateRange, setDateRange] = useState<[string, string]>(["Aug 20, 2022", "Oct 20, 2022"]);

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
        <Alert message="Error" description={error.message} type="error" showIcon />
      </div>
    );
  }

  const { status, statusCode, message, data: bookings } = data?.fetchAllBookings || {};

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

  return (
    <div className={styles.bookingList}>
      <div className={styles.header}>
        <div className={styles.tabs}>
          <Button type="primary">ALL ({bookings?.length || 0})</Button>
          <Button>RETURN IN TRANSIT (2)</Button>
          <Button>RETURNS RECEIVED (0)</Button>
        </div>
        <div className={styles.actions}>
          <Dropdown overlay={menu}>
            <Button>
              {dateRange[0]} - {dateRange[1]} <DownOutlined />
            </Button>
          </Dropdown>
          <Button type="primary">Request RTO</Button>
        </div>
      </div>
      <List
        dataSource={bookings}
        renderItem={(booking: any) => (
          <List.Item>
            <Card className={styles.bookingCard}>
              <div className={styles.cardContent}>
                <div className={styles.imageSection}>
                  <div className={styles.imageWrapper}>
                    {/* Vehicle Primary Image */}
                    <Image
                      src={booking.rentable.vehicle.primaryImageUrl}
                      alt={booking.rentable.vehicle.name}
                      className={styles.vehicleImage}
                    />
                    {/* Manufacturer Image (Top left of vehicle image) */}
                    <Image
                      src={booking.rentable.vehicle.manufacturer.imageUrl}
                      alt={booking.rentable.vehicle.manufacturer.name}
                      className={styles.manufacturerLogo}
                      style={{ position: "absolute", top: 0, left: 0, width: "30px" }}
                    />
                  </div>
                </div>
                <div className={styles.detailsSection}>
                  <h3>{booking.rentable.vehicle.name}</h3>
                  <p>Pickup Date: {new Date(booking.pickupDate).toLocaleDateString()}</p>
                  <p>Dropoff Date: {new Date(booking.dropoffDate).toLocaleDateString()}</p>
                  <p>Payment Method: {booking.paymentMethod}</p>
                  <p>Total Price: ₹{booking.totalPrice}</p>
                </div>
                <div className={styles.actionButtons}>
                  <Tag color="green">Return Bag Delivered</Tag>
                  <Button>Report an Issue</Button>
                  <Button>View History</Button>
                  <Button type="primary">Return Accepted</Button>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default BookingList;
