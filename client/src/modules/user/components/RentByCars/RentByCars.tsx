"use client";
import React, { useState } from 'react';
import styles from './RentByCars.module.css';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { DatePicker } from 'antd';
import { GET_MANUFACTURERS } from '@/graphql/admin-queries/manufacture';
import moment from 'moment';
import Modal from '../../../../themes/Modal/Modal'; // Import the modal
import { FaCar, FaArrowRight } from 'react-icons/fa'; // Import car icon


const { RangePicker } = DatePicker;

const FilterOptions: React.FC = () => {
  const router = useRouter();
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalStatus, setModalStatus] = useState<'success' | 'error'>('success');

  // Function to show the modal with a message and status
  const showModal = (message: string, status: 'success' | 'error') => {
      setModalMessage(message);
      setModalStatus(status);
      setModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
      setModalVisible(false);
  };


  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    if (dates) {
      const [pickup, dropoff] = dateStrings;
      if (pickup === dropoff) {
        showModal("Pick-up and Drop-off dates cannot be the same. Please select different dates.",'error');
        return;
      }
      setPickupDate(pickup); // Set the pickup date
      setDropoffDate(dropoff); // Set the dropoff date
    } else {
      setPickupDate(''); // Clear dates if none are selected
      setDropoffDate('');
    }
  };

    // Disable past dates
    const disabledDate = (current: any) => {
      return current && current < moment().startOf('day');
    };
  

  const handleFindVehicle = () => {
    if (pickupDate && dropoffDate) {
      if (pickupDate === dropoffDate) {
        showModal("Pick-up and Drop-off dates cannot be the same. Please select different dates.",'error');
        return;
      }
      // Redirect to the find cars page with selected dates as query params
      router.push(`/user/find-cars?pickupDate=${pickupDate}&dropoffDate=${dropoffDate}`);
    } else {
      showModal('Please select both pickup and dropoff dates','error');
    }
  };

  return (
    <div className={styles.filterSection}>
      <div className={styles.filterWrapper}>
        <div className={styles.filterItem}>
          <label htmlFor="pickup-date">Pick-up and Drop-off Date</label>
          <RangePicker
            format="YYYY-MM-DD" // Set the date format
            onChange={handleDateChange} // Handle date changes
            disabledDate={disabledDate} // Disable past dates
            style={{ width: '100%' }} // Style to make it full width
            className={styles.DatePicker}
          />
        </div>

        <div className={styles.arrowIcon}>
          <FaArrowRight size={24} />
        </div>
        <button className={styles.findVehicleBtn} onClick={handleFindVehicle}><FaCar className={styles.carIcon} /> Find a Vehicle</button>
      </div>
      {isModalVisible && (
                <Modal
                    message={modalMessage}
                    status={modalStatus}
                    onClose={closeModal} // Close modal when the close button is clicked
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
            <img src={manufacturer.imageUrl} alt={manufacturer.name} className={styles.brandLogo} />
            <p>{manufacturer.name}</p>
          </div>
        ))}
      </div>
      <a href="/user/all-manufacturers" className={styles.viewAll}>View all &rarr;</a>
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
