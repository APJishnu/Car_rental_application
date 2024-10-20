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
  LabelList,
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
  status: string;
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
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const SECONDCOLORS = ["#7B68EE", "#ADD8E6", "#4B0082", "#5F9EA0", "#00CED1"];

  // Prepare data for manufacturer distribution
  const manufacturerData = bookings.reduce(
    (acc: Record<string, number>, booking: Booking) => {
      const manufacturer = booking.rentable.vehicle.manufacturer.name;
      acc[manufacturer] = (acc[manufacturer] || 0) + 1;
      return acc;
    },
    {}
  );

  const manufacturerChartData = Object.entries(manufacturerData).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  // Prepare data for vehicle revenue distribution
  const vehicleRevenueData = bookings.reduce(
    (acc: Record<string, number>, booking: Booking) => {
      const vehicleName = booking.rentable.vehicle.name;
      acc[vehicleName] = (acc[vehicleName] || 0) + booking.totalPrice;
      return acc;
    },
    {}
  );

  const vehicleRevenueChartData = Object.entries(vehicleRevenueData)
    .map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className={styles.dashboard}>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <h2>ADMIN DASHBOARD</h2>

        {/* Date Range Picker */}
        <DatePicker.RangePicker
          className={styles.DatePicker}
          value={dateRange}
          onChange={handleDateChange}
        />
      </div>

      <div className={styles.dashboardOverflowDiv}>
        {/* Chart Section */}

        <div className={styles.chartsDiv}>
          <div className={styles.chartSection}>
            <h3>Payment Method Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart width={400} height={400}>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                >
                  <LabelList
                    className={styles.lablePie}
                    dataKey="name"
                    position="outside"
                    fontSize={10}
                    fill="#FF5733"
                  />{" "}
                  {/* Adds the payment method name as labels */}
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Line Chart Section */}
          <div className={styles.chartSection2}>
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
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                {/* Customized Grid */}
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />

                {/* X and Y Axes */}
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#8884d8", fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#8884d8", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />

                {/* Tooltip */}
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f5f5f5",
                    borderColor: "#8884d8",
                  }}
                />

                {/* Legend */}
                <Legend verticalAlign="top" height={36} iconType="circle" />

                {/* Adding a gradient to the line */}
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>

                {/* Line with smoothed shape and stroke */}
                <Line
                  type="monotone"
                  dataKey="totalRevenue"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{
                    r: 4,
                    stroke: "#8884d8",
                    strokeWidth: 2,
                    fill: "#fff",
                  }} // Custom dots
                  activeDot={{ r: 6 }}
                />

                {/* Adding Brush for better navigation */}
                <Brush
                  height={30}
                  stroke="#8884d8"
                  startIndex={0}
                  endIndex={revenueLineChartData.length - 1}
                  travellerWidth={12}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.secondChartsDiv}>
          {/* New Manufacturer Distribution Chart */}
          <div className={styles.chartSection3}>
            <h3>Manufacturer Booking Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart width={240} height={240}>
                <Pie
                  data={manufacturerChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  innerRadius={30}
                >
                  <LabelList
                    className={styles.lablePie}
                    dataKey="name"
                    position="outside"
                    fontSize={10}
                    fill="#FF5733"
                  />
                  {manufacturerChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={SECONDCOLORS[index % SECONDCOLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.line}></div>
          {/* New Vehicle Revenue Distribution Chart */}
          <div className={styles.chartSection4}>
            <h3>Top 5 Vehicles by Revenue</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart width={300} height={300}>
                <Pie
                  data={vehicleRevenueChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={40}
                >
                  <LabelList
                    className={styles.lablePie}
                    dataKey="name"
                    position="outside"
                    fontSize={10}
                    fill="#FF5733"
                  />
                  {vehicleRevenueChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={SECONDCOLORS[index % SECONDCOLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
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
                dropoffDate.isBefore(today, "day");
            const isBookingBooked = booking.status === "booked";

            return (
                <List.Item>
                    <div className={styles.listItem}>
                        <div className={styles.bookingId}>
                            Booking ID:{" "}
                            <strong className={styles.bookingIdValue}>
                                {booking.id}
                            </strong>
                        </div>
                        <div className={styles.bookingDetails}>
                            <div className={styles.userInfo}>
                                <UserOutlined style={{ marginRight: "5px" }} />
                                User ID:{" "}
                                <span className={styles.userId}>
                                    {booking.userId}
                                </span>
                            </div>
                            <div className={styles.dateInfo}>
                                <CalendarOutlined style={{ marginRight: "5px" }} />
                                Pickup:{" "}
                                <span className={styles.dateValue}>
                                    {booking.pickupDate}
                                </span>
                            </div>
                            <div className={styles.dateInfo}>
                                <CalendarTwoTone style={{ marginRight: "5px" }} />
                                Dropoff:{" "}
                                <span className={styles.dateValue}>
                                    {booking.dropoffDate}
                                </span>
                            </div>
                        </div>
                        <div className={styles.BookingVehicleDetails}>
                            <img
                                src={booking.rentable.vehicle.primaryImageUrl}
                                alt={booking.rentable.vehicle.name}
                                className={styles.vehicleImage}
                            />
                            <p className={styles.vehicleName}>
                                <strong>
                                    <CarOutlined style={{ marginRight: "5px" }} />
                                    {booking.rentable.vehicle.name} /{" "}
                                    {booking.rentable.vehicle.year}
                                </strong>
                            </p>
                        </div>
                        <div className={styles.paymentDetails}>
                            <p>
                                <Tag color="blue">{booking.paymentMethod}</Tag>
                            </p>
                            <Tag
                                color="green"
                                className={styles.totalPriceTag}
                            >
                                <TagOutlined style={{ marginRight: "5px" }} />
                                Total Price: ${booking.totalPrice.toFixed(2)}
                            </Tag>
                        </div>
                        {isBookingBooked && isDropoffDueOrPassed && (
                            <Button
                                type="link"
                                className={styles.button}
                                onClick={() => handleRelease(booking.id)}
                            >
                                Release
                            </Button>
                        )}
                        {!isBookingBooked && (
                            <Tag
                                color="cyan"
                                className={styles.pendingTag}
                            >
                                <CheckCircleOutlined style={{ marginRight: "0px" }} />
                            </Tag>
                        )}
                    </div>
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
