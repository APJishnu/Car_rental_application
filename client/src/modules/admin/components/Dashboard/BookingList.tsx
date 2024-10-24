// components/BookingList.tsx
import React from 'react';
import { List, Button, Tag } from 'antd';
import { CarOutlined, CalendarOutlined, UserOutlined, TagOutlined, CalendarTwoTone, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Booking } from '../../../../interfaces/admin/admin-dashboard';
import styles from './Dashboard.module.css'; // Importing the CSS module

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
    <div className={styles.bookingList}> {/* Use CSS module class name */}
      <h3>Bookings</h3>
      <List
        itemLayout="horizontal"
        dataSource={showAll ? filteredData : filteredData.slice(0, 5)}
        renderItem={(booking) => {
          const dropoffDate = dayjs(booking.dropoffDate);
          const isDropoffDueOrPassed = dropoffDate.isSame(today, "day") || dropoffDate.isBefore(today, "day");
          const isBookingBooked = booking.status === "booked";

          return (
            <List.Item>
              <div className={styles.listItem}> {/* Use CSS module class name */}
                <div className={styles.bookingId}> {/* Use CSS module class name */}
                  Booking ID: <strong>{booking.id}</strong>
                </div>
                <div className={styles.bookingDetails}> {/* Use CSS module class name */}
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
                <div className={styles.vehicleDetails}> {/* Use CSS module class name */}
                  <img
                    src={booking.rentable.vehicle.primaryImageUrl}
                    alt={booking.rentable.vehicle.name}
                    className={styles.vehicleImage} // Use CSS module class name
                  />
                  <p className={styles.vehicleName}> {/* Use CSS module class name */}
                    <CarOutlined /> {booking.rentable.vehicle.name} / {booking.rentable.vehicle.year}
                  </p>
                </div>
                <div className={styles.paymentDetails}> {/* Use CSS module class name */}
                  <Tag color="blue">{booking.paymentMethod}</Tag>
                  <Tag color="green">
                    <TagOutlined /> Total Price: ${booking.totalPrice.toFixed(2)}
                  </Tag>
                </div>
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
            </List.Item>
          );
        }}
      />
      {!showAll && <Button onClick={handleShowMore}>Show More</Button>}
    </div>
  );
};
