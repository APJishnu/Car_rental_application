"use client";

// Dashboard.tsx
import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Spin, Alert, DatePicker, Modal, Select } from "antd";
import Cookies from "js-cookie";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { PaymentMethodChart } from "./PaymentMethodChart";
import { RevenueChart } from "./RevenueChart";
import { BookingList } from "./BookingList";
import {
  FETCH_ALL_BOOKINGS,
  RELEASE_BOOKING,
  FETCH_ALL_INVENTORIES,
} from "../../../../graphql/admin-mutations/admin-dashborad";
import { Booking } from "../../../../interfaces/admin/admin-dashboard";
import styles from "./Dashboard.module.css";

import { PieChart, Pie, Cell, LabelList, ResponsiveContainer } from "recharts";

// Extend dayjs with the isBetween plugin
dayjs.extend(isBetween);

const Dashboard: React.FC = () => {
  const token = Cookies.get("adminToken");

  const { Option } = Select;

  // Apollo hooks
  const [fetchBookings, { loading, data, error }] =
    useLazyQuery(FETCH_ALL_BOOKINGS);
  const [releaseBooking] = useMutation(RELEASE_BOOKING);
  const [fetchInventories, { data: inventoryData }] = useLazyQuery(
    FETCH_ALL_INVENTORIES
  );

  // State management
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [filteredData, setFilteredData] = useState<Booking[]>([]);
  const [selectedInventoryId, setSelectedInventoryId] = useState<
    string | undefined
  >(undefined);

  // Date range state
  const today = dayjs();
  const lastWeek = today.subtract(7, "day");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    lastWeek,
    today,
  ]);

  useEffect(() => {
    fetchInventories({
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
  }, [token]);

  // Fetch bookings on component mount
  useEffect(() => {
    if (token) {
      fetchBookings({
        variables: { inventoryId: selectedInventoryId }, // Change to use inventoryId
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
    }
  }, [token, selectedInventoryId, fetchBookings]);

  // Update bookings when data changes
  useEffect(() => {
    if (data) {
      const { status, data: fetchedBookings } = data.fetchAllBookings;
      if (status) {
        setBookings(fetchedBookings);

        // Adjust the filtering logic to use inventoryId
        const filtered =
          selectedInventoryId && selectedInventoryId !== "All"
            ? fetchedBookings.filter(
                (booking: any) =>
                  booking.rentable?.inventoryId === selectedInventoryId // Filter based on inventoryId
              )
            : fetchedBookings;

        setFilteredData(filtered);
      }
    }
  }, [data, selectedInventoryId]);

  // Handle date range change
  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange(dates);
      const [startDate, endDate] = dates;

      const filtered = bookings.filter((booking) => {
        const pickupDate = dayjs(booking.pickupDate);
        const dropoffDate = dayjs(booking.dropoffDate);

        return (
          ((pickupDate.isAfter(startDate) || pickupDate.isSame(startDate)) &&
            (pickupDate.isBefore(endDate) || pickupDate.isSame(endDate))) ||
          ((dropoffDate.isAfter(startDate) || dropoffDate.isSame(startDate)) &&
            (dropoffDate.isBefore(endDate) || dropoffDate.isSame(endDate)))
        );
      });

      setFilteredData(filtered);
    } else {
      setDateRange([lastWeek, today]);
      setFilteredData(bookings);
    }
  };

  // Handle location change

  const handleLocationChange = (value: string) => {
    const inventoryId = value === "All" ? undefined : value; // Set undefined for "All" to fetch all inventories
    setSelectedInventoryId(inventoryId);
    fetchBookings({
      variables: { inventoryId }, // Pass `undefined` to fetch all
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
  };

  // Handle booking release
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

        // Re-fetch bookings after release
        const variables =
          selectedInventoryId !== "All"
            ? { inventoryId: selectedInventoryId }
            : {};
        fetchBookings({
          variables,
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

  // Generate revenue data for the selected date range
  const generateRevenueData = () => {
    const revenueData: Record<string, number> = {};
    const startDate = dateRange[0] ? dayjs(dateRange[0]) : lastWeek;
    const endDate = dateRange[1] ? dayjs(dateRange[1]) : today;

    // Initialize revenue data for each day in the range
    for (
      let date = startDate;
      date.isBefore(endDate.add(1, "day"));
      date = date.add(1, "day")
    ) {
      revenueData[date.format("YYYY-MM-DD")] = 0;
    }

    // Calculate daily revenue
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

    // Transform to array format for charts
    return Object.entries(revenueData).map(([date, totalRevenue]) => ({
      date,
      totalRevenue,
    }));
  };

  // Handle show more button click
  const handleShowMore = () => {
    setShowAll(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.dashboard}>
        <Spin size="large" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <Alert
          message="Error"
          description={error.message}
          type="error"
          showIcon
        />
      </div>
    );
  }

  // Prepare manufacturer data
  const manufacturerData = bookings.reduce(
    (acc: Record<string, number>, booking: Booking) => {
      const manufacturer = booking.rentable?.vehicle?.manufacturer.name;
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

  // Prepare vehicle revenue data
  const vehicleRevenueData = bookings.reduce(
    (acc: Record<string, number>, booking: Booking) => {
      const vehicleName = booking.rentable?.vehicle.name;
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

  const SECONDCOLORS = ["#7B68EE", "#ADD8E6", "#4B0082", "#5F9EA0", "#00CED1"];

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <h2>ADMIN DASHBOARD</h2>
        <div className={styles.dashBoardHeadingDiv}>
          <Select
            defaultValue="All"
            onChange={handleLocationChange}
            className={styles.selectOption}
          >
            <Option value="">All</Option>
            {inventoryData?.fetchAllInventories.data.map((inventory: any) => (
              <Option key={inventory.id} value={inventory.id}>
                {inventory.name} - {inventory.location}
              </Option>
            ))}
          </Select>

          <DatePicker.RangePicker
            value={dateRange}
            onChange={handleDateChange}
            className={styles.datePicker}
          />
        </div>
      </div>

      <div className={styles.dashboardOverflowDiv}>
        <div className={styles.chartsDiv}>
          <PaymentMethodChart bookings={bookings} />

          <RevenueChart
            bookings={bookings}
            dateRange={dateRange}
            generateRevenueData={generateRevenueData}
          />
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
                    className={styles.labelPie}
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
                    className={styles.labelPie}
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

        <BookingList
          filteredData={filteredData}
          showAll={showAll}
          handleShowMore={handleShowMore}
          handleRelease={handleRelease}
        />
      </div>
    </div>
  );
};

export default Dashboard;
