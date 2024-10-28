"use client";
import React, { useState } from "react";
import styles from "./RentByCars.module.css";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { DatePicker, Input, Button, Checkbox } from "antd";
import { EnvironmentOutlined, CalendarOutlined } from "@ant-design/icons";
import axios from "axios";
import { GET_MANUFACTURERS } from "@/graphql/admin-queries/manufacture";
import moment from "moment";
import Modal from "../../../../themes/Modal/Modal"; // Import the modal

const { RangePicker } = DatePicker;

const FilterOptions: React.FC = () => {
  const router = useRouter();
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [isDifferentLocation, setIsDifferentLocation] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<string[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalStatus, setModalStatus] = useState<"success" | "error">(
    "success"
  );
  const [activeInput, setActiveInput] = useState<"pickup" | "dropoff" | null>(
    null
  ); // Track which input is active

  const showModal = (message: string, status: "success" | "error") => {
    setModalMessage(message);
    setModalStatus(status);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    if (dates) {
      const [pickup, dropoff] = dateStrings;
      if (pickup === dropoff) {
        showModal(
          "Pick-up and Drop-off dates cannot be the same. Please select different dates.",
          "error"
        );
        return;
      }
      setPickupDate(pickup);
      setDropoffDate(dropoff);
    } else {
      setPickupDate("");
      setDropoffDate("");
    }
  };

  const disabledDate = (current: any) => {
    return current && current < moment().startOf("day");
  };

  const handleFindVehicle = () => {
    if (pickupDate && dropoffDate && pickupLocation) {
      if (pickupDate === dropoffDate) {
        showModal(
          "Pick-up and Drop-off dates cannot be the same. Please select different dates.",
          "error"
        );
        return;
      }
      const query = `pickupDate=${pickupDate}&dropoffDate=${dropoffDate}&pickupLocation=${pickupLocation}`;
      const finalQuery = isDifferentLocation
        ? `${query}&dropoffLocation=${dropoffLocation}`
        : query;
      router.push(`/user/find-cars?${finalQuery}`);
    } else {
      showModal(
        "Please select both pickup and dropoff dates and enter a pick-up location",
        "error"
      );
    }
  };

  // Fetch location suggestions from Nominatim
  const fetchSuggestions = async (
    input: string,
    type: "pickup" | "dropoff"
  ) => {
    if (input) {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${input}&format=json&addressdetails=1&limit=5`
        );
        const results = response.data;
        if (type === "pickup") {
          setPickupSuggestions(
            results.map((result: any) => result.display_name)
          );
          setDropoffSuggestions([]); // Clear dropoff suggestions if pickup is active
        } else {
          setDropoffSuggestions(
            results.map((result: any) => result.display_name)
          );
          setPickupSuggestions([]); // Clear pickup suggestions if dropoff is active
        }
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    } else {
      if (type === "pickup") {
        setPickupSuggestions([]);
      } else {
        setDropoffSuggestions([]);
      }
    }
  };

  const handlePickupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPickupLocation(value);
    setActiveInput("pickup"); // Set active input to pickup
    fetchSuggestions(value, "pickup");
  };

  const handlePickupSelect = (location: string) => {
    setPickupLocation(location);
    setPickupSuggestions([]);
  };

  const handleDropoffChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDropoffLocation(value);
    setActiveInput("dropoff"); // Set active input to dropoff
    fetchSuggestions(value, "dropoff");
  };

  const handleDropoffSelect = (location: string) => {
    setDropoffLocation(location);
    setDropoffSuggestions([]);
  };

  return (
    <div className={styles.filterSection}>
      <div className={styles.filterWrapper}>
        <div className={styles.filteringSection}>
          {/* Pick-Up Location Input */}
          <div className={styles.filterItem}>
            <label htmlFor="pickup-location">Pick-Up Location</label>
            <Input
              value={pickupLocation}
              onChange={handlePickupChange}
              placeholder="Enter Pick-Up Location"
              className={styles.locationInput}
              prefix={<EnvironmentOutlined />}
            />
            {activeInput === "pickup" && pickupSuggestions.length > 0 && (
              <div className={styles.autocompleteDropdown}>
                {pickupSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handlePickupSelect(suggestion)}
                    className={styles.suggestion}
                  >
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Conditionally Render Drop-Off Location Input */}
          {isDifferentLocation && (
            <div className={styles.filterItem}>
              <label htmlFor="dropoff-location">Drop-Off Location</label>
              <Input
                value={dropoffLocation}
                onChange={handleDropoffChange}
                placeholder="Enter Drop-Off Location"
                className={styles.locationInput}
                prefix={<EnvironmentOutlined />}
              />
              {activeInput === "dropoff" && dropoffSuggestions.length > 0 && (
                <div className={styles.autocompleteDropdown}>
                  {dropoffSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleDropoffSelect(suggestion)}
                      className={styles.suggestion}
                    >
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pick-Up and Drop-Off Date */}
          <div className={styles.filterItem}>
            <label htmlFor="dates">Pick-Up and Drop-Off Date</label>
            <RangePicker
              format="YYYY-MM-DD"
              onChange={handleDateChange}
              disabledDate={disabledDate}
              className={styles.datePicker}
              suffixIcon={<CalendarOutlined />}
            />
          </div>

          {/* Search Button */}
          <Button
            type="primary"
            className={styles.findVehicleBtn}
            onClick={handleFindVehicle}
          >
            Search
          </Button>
        </div>

        {/* Checkboxes */}
        <div className={`${styles.filterItem} ${styles.checkboxContainer}`}>
          <Checkbox
            id="differentLocation"
            checked={isDifferentLocation}
            onChange={(e) => setIsDifferentLocation(e.target.checked)}
          >
            Return to Different Location
          </Checkbox>
          <Checkbox id="priceAlert">Alert me when prices change</Checkbox>
        </div>
      </div>

      {isModalVisible && (
        <Modal
          message={modalMessage}
          status={modalStatus}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

const Brands: React.FC = () => {
  const { loading, error, data } = useQuery(GET_MANUFACTURERS);

  if (loading) return <p>Loading manufacturers...</p>;
  if (error) return <p>Error fetching manufacturers: {error.message}</p>;

  // Limit to the first 12 manufacturers
  const limitedManufacturers = data.getManufacturers.slice(0, 8);

  return (
    <div className={styles.rentSection}>
      <div className={styles.rentHeader}>
        <h2>Rent by Manufacturers</h2>
      </div>
      <div className={styles.brandGrid}>
        {limitedManufacturers.map((manufacturer: any) => (
          <div key={manufacturer.id} className={styles.brandCard}>
            <img
              src={manufacturer.imageUrl}
              alt={manufacturer.name}
              className={styles.brandLogo}
            />
            <p>{manufacturer.name}</p>
          </div>
        ))}
      </div>
      <a href="/user/all-manufacturers" className={styles.viewAll}>
        View all &rarr;
      </a>
    </div>
  );
};

const RentByBrands: React.FC = () => {
  return (
    <>
      <FilterOptions />
      <Brands />
    </>
  );
};

export default RentByBrands;
