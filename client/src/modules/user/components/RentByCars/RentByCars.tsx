"use client";
import React, { useState } from "react";
import styles from "./RentByCars.module.css";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { DatePicker, Input, Button, Checkbox, Select } from "antd";
import { EnvironmentOutlined, CalendarOutlined } from "@ant-design/icons";
import { GET_MANUFACTURERS } from "@/graphql/admin-queries/manufacture";
import { FETCH_ALL_INVENTORIES } from "../../../../graphql/admin-mutations/admin-dashborad";
import moment from "moment";
import Modal from "../../../../themes/Modal/Modal"; // Import the modal

const { RangePicker } = DatePicker;
const { Option } = Select;

const FilterOptions: React.FC = () => {
  const router = useRouter();
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [inventoryId, setInventoryId] = useState<string | undefined>(undefined); // Store selected inventory ID
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalStatus, setModalStatus] = useState<"success" | "error">(
    "success"
  );
  const [activeInput, setActiveInput] = useState<"pickup" | null>(null); // Track which input is active

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
    if (pickupDate && dropoffDate && inventoryId) {
      const query = `pickupDate=${pickupDate}&dropoffDate=${dropoffDate}&inventoryId=${inventoryId}`;
      router.push(`/user/find-cars?${query}`);
    } else {
      showModal(
        "Please select both pickup and drop-off dates and an inventory.",
        "error"
      );
    }
  };

  const handleInventoryChange = (value: string) => {
    setInventoryId(value); // Set selected inventory ID
    setActiveInput("pickup");
  };

  const { data, loading, error } = useQuery(FETCH_ALL_INVENTORIES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching inventories</p>;

  return (
    <div className={styles.filterSection}>
      <div className={styles.filterWrapper}>
        <div className={styles.filteringSection}>
          {/* Pick-Up Location Input */}
          <div className={styles.filterItem}>
            <div>Inventory Location</div>
            <Select
              value={inventoryId}
              onChange={handleInventoryChange}
              placeholder="Select Inventory Location"
              className={styles.locationSelect}
              suffixIcon={<EnvironmentOutlined />}
            >
              {data.fetchAllInventories.data.map((inventory: any) => (
                <Option key={inventory.id} value={inventory.id}>
                  {inventory.name} ({inventory.location})
                </Option>
              ))}
            </Select>
          </div>

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
