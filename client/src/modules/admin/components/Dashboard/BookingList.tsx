// components/BookingList.tsx
import React from "react";
import { List, Button, Tag } from "antd";
import {
  CarOutlined,
  CalendarOutlined,
  UserOutlined,
  TagOutlined,
  CalendarTwoTone,
  CheckCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Booking } from "../../../../interfaces/admin/admin-dashboard";
import styles from "./Dashboard.module.css"; // Importing the CSS module

interface BookingListProps {
  filteredData: Booking[];
  showAll: boolean;
  handleShowMore: () => void;
  handleRelease: (bookingId: string) => void;
}

export const BookingList: React.FC<BookingListProps> = ({
  filteredData,
  showAll,
  handleShowMore,
  handleRelease,
}) => {
  const today = dayjs();


  return (
    <div className={styles.bookingList}>
      {" "}
      {/* Use CSS module class name */}
      <h3>Bookings</h3>
      <List
        itemLayout="horizontal"
        dataSource={showAll ? filteredData : filteredData.slice(0, 5)}
        renderItem={(booking) => {
          // const dropoffDate = dayjs(booking.dropoffDate);
          const dropoffDate = today.subtract(5, "day");

          const isDropoffDueOrPassed =
            dropoffDate.isSame(today, "day") ||
            dropoffDate.isBefore(today, "day");
          const isBookingBooked = booking.status === "booked";

          return (
            <List.Item>
              <div className={styles.listItem}>
                <div className={styles.bookingId}> 
                  Booking ID: <strong>{booking.id}</strong>
                </div>
                <div className={styles.bookingDetails}>
                 
                  <div className={styles.userInfo}>
                    <UserOutlined /> User ID: {booking.userId}
                  </div>
                  <div className={styles.dateInfo}>
                    <CalendarOutlined /> Pickup: {booking.pickupDate}
                  </div>
                  <div className={styles.dateInfo}>
                    <CalendarTwoTone /> Dropoff: {booking.dropoffDate}
                  </div>
                  
                </div>
                <div className={styles.vehicleDetails}>
                  {" "}
                  <img
                    src={
                      booking.rentable?.vehicle?.primaryImageUrl ||
                      "/empty-car.svg"
                    }
                    alt={
                      booking.rentable?.vehicle?.name || "Default vehicle name"
                    }
                    className={styles.vehicleImage} // Use CSS module class name
                    onError={(e) => {
                      const target = e.target as HTMLImageElement; // Cast e.target to HTMLImageElement
                      target.onerror = null; // Prevents infinite loop if default image fails
                      target.src = "/empty-car.svg"; // Path to your default image
                    }}
                  />
                </div>
                <div className={styles.paymentDetails}>
                  {" "}
                  <p className={styles.vehicleName}>
                    {/* Use CSS module class name */}
                    <CarOutlined /> {booking.rentable?.vehicle.name} /{" "}
                    {booking.rentable?.vehicle.year}
                  </p>
                  {/* Use CSS module class name */}
                  <Tag color="blue">{booking.paymentMethod}</Tag>
                  <Tag color="green">
                    <TagOutlined /> Total Price: $
                    {booking.totalPrice.toFixed(2)}
                  </Tag>
                </div>
                <div className={styles.returnNotification}>
                {isBookingBooked && isDropoffDueOrPassed && (
                  <Button type="link" onClick={() => handleRelease(booking.id)}>
                    Release
                  </Button>
                )}
                {!isBookingBooked && (
                  <Tag color="cyan">
                    <CheckCircleOutlined />
                  </Tag>
                )}
                </div>
                
              </div>
            </List.Item>
          );
        }}
      />
      {!showAll && <Button onClick={handleShowMore}>Show More</Button>}
    </div>
  );
};
