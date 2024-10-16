"use client";

import React, { useEffect, useState } from "react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { List, Spin, Alert, Button, Tag, DatePicker, Modal } from "antd";
import {
  CarOutlined,
  CalendarOutlined,
  UserOutlined,
  TagOutlined,
  CalendarTwoTone,
  CheckCircleOutlined,
} from "@ant-design/icons";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
} from "recharts";
import Cookies from "js-cookie";
import styles from "./page.module.css";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

// Extend dayjs with the isBetween plugin
dayjs.extend(isBetween);

// Define interfaces for the booking data
interface Manufacturer {
  id: string;
  name: string;
  country: string;
  imageUrl: string;
}

interface Vehicle {
  id: string;
  name: string;
  transmission: string;
  fuelType: string;
  numberOfSeats: number;
  year: number;
  primaryImageUrl: string;
  manufacturer: Manufacturer;
}

interface Rentable {
  id: string;
  vehicleId: string;
  pricePerDay: number;
  availableQuantity: number;
  vehicle: Vehicle;
}

interface Booking {
  id: string;
  vehicleId: string;
  userId: string;
  pickupDate: string;
  dropoffDate: string;
  status:string;
  totalPrice: number;
  razorpayOrderId: string;
  paymentMethod: string;
  rentable: Rentable;
}

interface FetchAllBookingsResponse {
  fetchAllBookings: {
    status: boolean;
    statusCode: number;
    message: string;
    data: Booking[];
  };
}

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

const RELEASE_BOOKING = gql`
  mutation ReleaseBooking($id: String!) {
    releaseBooking(id: $id) {
      status
      statusCode
      message
      updatedBooking {
        id
        status
        releaseDate
      }
    }
  }
`;

const Dashboard: React.FC = () => {
  const token = Cookies.get("adminToken");
  const [fetchBookings, { loading, data, error }] =
    useLazyQuery<FetchAllBookingsResponse>(FETCH_ALL_BOOKINGS);
  const [releaseBooking] = useMutation(RELEASE_BOOKING);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [filteredData, setFilteredData] = useState<Booking[]>([]);

  // Set initial date range to the last 7 days
  const today = dayjs();
  const lastWeek = today.subtract(7, "day");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    lastWeek,
    today,
  ]);

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
    if (data) {
      const { status, data: fetchedBookings } = data.fetchAllBookings;
      if (status) {
        setBookings(fetchedBookings);
        setFilteredData(fetchedBookings);
      }
    }
  }, [data]);

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange(dates as [Dayjs | null, Dayjs | null]);
      const [startDate, endDate] = dates;

      const filtered = bookings.filter((booking) => {
        const pickupDate = dayjs(booking.pickupDate);
        const dropoffDate = dayjs(booking.dropoffDate);

        // Check if the pickup date or dropoff date is within the selected range
        return (
          ((pickupDate.isAfter(startDate) || pickupDate.isSame(startDate)) &&
            (pickupDate.isBefore(endDate) || pickupDate.isSame(endDate))) ||
          ((dropoffDate.isAfter(startDate) || dropoffDate.isSame(startDate)) &&
            (dropoffDate.isBefore(endDate) || dropoffDate.isSame(endDate)))
        );
      });

      setFilteredData(filtered);
    } else {
      // Reset to last 7 days if no date is selected
      setDateRange([lastWeek, today]);
      setFilteredData(bookings);
    }
  };

  const handleRelease = async (bookingId: string) => {
    try {
      const response = await releaseBooking({
        variables: { id: bookingId },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      if (response.data.releaseBooking.status) {
        Modal.success({
          content: "Booking released successfully!",
        });

        // Refresh bookings after releasing
        fetchBookings({
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });
      } else {
        Modal.error({
          content: response.data.releaseBooking.message,
        });
      }
    } catch (error) {
      Modal.error({
        content: "An error occurred while releasing the booking.",
      });
    }
  };

  // Function to generate revenue data for the selected date range
  const generateRevenueData = () => {
    const revenueData: Record<string, number> = {};
    const startDate = dateRange[0] ? dayjs(dateRange[0]) : lastWeek; // Use lastWeek if dateRange[0] is null
    const endDate = dateRange[1] ? dayjs(dateRange[1]) : today; // Use today if dateRange[1] is null

    // Initialize the revenue data within the selected range
    for (
      let date = startDate;
      date.isBefore(endDate.add(1, "day"));
      date = date.add(1, "day")
    ) {
      revenueData[date.format("YYYY-MM-DD")] = 0;
    }

    // Sum total revenue for each day within the bookings
    bookings.forEach((booking) => {
      const bookingPickupDate = dayjs(booking.pickupDate);
      const bookingDropoffDate = dayjs(booking.dropoffDate);

      if (
        bookingPickupDate.isBetween(startDate, endDate, null, "[]") ||
        bookingDropoffDate.isBetween(startDate, endDate, null, "[]")
      ) {
        const date = bookingPickupDate.format("YYYY-MM-DD");
        revenueData[date] += booking.totalPrice;
      }
    });

    // Transform revenueData into an array suitable for the line chart
    return Object.entries(revenueData).map(([date, totalRevenue]) => ({
      date,
      totalRevenue,
    }));
  };

  const revenueLineChartData = generateRevenueData();

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

  // Prepare data for the pie chart
  const paymentMethods = bookings.reduce(
    (acc: Record<string, number>, booking: Booking) => {
      acc[booking.paymentMethod] = (acc[booking.paymentMethod] || 0) + 1;
      return acc;
    },
    {}
  );

  const chartData = Object.entries(paymentMethods).map(([key, value]) => ({
    name: key,
    value,
  }));

  const handleShowMore = () => {
    setShowAll(true);
  };

  return (
    <div className={styles.dashboard}>
      <h2>Admin Dashboard</h2>

      {/* Date Range Picker */}
      <DatePicker.RangePicker value={dateRange} onChange={handleDateChange} />

      <div className={styles.dashboardOverflowDiv}>
        {/* Chart Section */}
        <div className={styles.chartSection}>
          <h3>Payment Method Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#82ca9d"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Line Chart Section */}
        <div className={styles.chartSection}>
          <h3>
            Total Revenue Per Day (
            {dateRange[0] && dateRange[1]
              ? `${dateRange[0]?.format("YYYY-MM-DD")} to ${dateRange[1]?.format("YYYY-MM-DD")}`
              : "Last 7 Days"}
            )
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={revenueLineChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" />
              <Brush />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Booking List Section */}
        <div className={styles.bookingList}>
          <h3>Bookings</h3>
          <List
            itemLayout="horizontal"
            dataSource={showAll ? filteredData : filteredData.slice(0, 5)}
            renderItem={(booking) => {
              const dropoffDate = dayjs(booking.dropoffDate);
              const isDropoffDueOrPassed =
                dropoffDate.isSame(today, "day") ||
                dropoffDate.isSame(today.add(3, "day"), "day") ||
                dropoffDate.isBefore(today, "day");

                // Check if the booking status is 'booked'
              const isBookingBooked = booking.status === "booked";

              const date = dropoffDate.isSame(today.add(2, "day"));
              console.log(dropoffDate);
              console.log("haii", date);
              console.log(isDropoffDueOrPassed);
              // Check if dropoff date has passed or is today

              return (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <strong style={{ fontSize: "1.2em", color: "#007bff" }}>
                        Booking ID: {booking.id}
                      </strong>
                    }
                    description={
                      <div style={{ fontWeight: "bold" }}>
                        <span style={{ marginRight: "10px" }}>
                          <UserOutlined style={{ marginRight: "5px" }} />
                          User ID:{" "}
                          <span style={{ color: "#555" }}>
                            {booking.userId}
                          </span>
                        </span>
                        <span style={{ marginRight: "10px" }}>
                          <CalendarOutlined style={{ marginRight: "5px" }} />
                          Pickup:{" "}
                          <span style={{ color: "#555" }}>
                            {booking.pickupDate}
                          </span>
                        </span>
                        <span>
                          <CalendarTwoTone style={{ marginRight: "5px" }} />
                          Dropoff:{" "}
                          <span style={{ color: "#555" }}>
                            {booking.dropoffDate}
                          </span>
                        </span>
                      </div>
                    }
                  />
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={booking.rentable.vehicle.primaryImageUrl}
                      alt={booking.rentable.vehicle.name}
                      style={{
                        width: "100px",
                        height: "auto",
                        marginRight: "15px",
                        borderRadius: "8px",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p>
                        <strong style={{ fontSize: "1.1em", color: "#333" }}>
                          <CarOutlined style={{ marginRight: "5px" }} />
                          Vehicle: {booking.rentable.vehicle.name} /{" "}
                          {booking.rentable.vehicle.year}
                        </strong>
                      </p>
                      <p>
                        <Tag color="blue">{booking.paymentMethod}</Tag>
                      </p>
                      <Tag
                        color="green"
                        style={{ fontSize: "1.1em", fontWeight: "bold" }}
                      >
                        <TagOutlined style={{ marginRight: "5px" }} />
                        Total Price: ${booking.totalPrice.toFixed(2)}
                      </Tag>
                    </div>
                  </div>

                  {isBookingBooked && isDropoffDueOrPassed && (
                    <Button
                      type="primary"
                      onClick={() => handleRelease(booking.id)}
                    >
                      Release
                    </Button>
                  )}
                  {!isBookingBooked &&(
                    <Tag
                    color="blue"
                    style={{ fontSize: "1.1em", fontWeight: "bold" ,padding:"5px"}}
                  >
                    <CheckCircleOutlined style={{ marginRight: "5px" }} />
                    Released..
                  </Tag>
                  )}
                </List.Item>
              );
            }}
          />

          {!showAll && <Button onClick={handleShowMore}>Show More</Button>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
