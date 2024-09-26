"use client";

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MANUFACTURERS } from '@/graphql/admin-queries/manufacture';
import { ADD_VEHICLE } from '@/graphql/admin-mutations/vehicles';
import styles from './page.module.css'; // Adjust the path for your styles

const AddVehicleForm: React.FC = () => {
  const { loading, error, data } = useQuery(GET_MANUFACTURERS);
  const [manufacturerId, setManufacturerId] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // For displaying error
  const [addVehicle] = useMutation(ADD_VEHICLE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); // Clear any previous error
    try {
      const response = await addVehicle({
        variables: {
          manufacturerId,
          name: vehicleName,
          year: vehicleYear,
        },
      });
      console.log('Vehicle added:', response.data);
      // Optionally reset the form on success
      setManufacturerId('');
      setVehicleName('');
      setVehicleYear('');
    } catch (error: any) {
      console.error('Error adding vehicle:', error);
      if (error.message.includes('A vehicle with this manufacturer and name already exists')) {
        setErrorMessage('A vehicle with this manufacturer and name already exists.');
      } else {
        setErrorMessage('Error adding vehicle. Please try again.');
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching manufacturers: {error.message}</p>;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>} {/* Display error */}

      <div className={styles.div}>
        <label htmlFor="manufacturer" className={styles.label}>Select Manufacturer</label>
        <select
          id="manufacturer"
          value={manufacturerId}
          onChange={(e) => setManufacturerId(e.target.value)}
          required
          className={styles.select}
        >
          <option value="">Select a manufacturer</option>
          {data.getManufacturers.map((manufacturer: any) => (
            <option key={manufacturer.id} value={manufacturer.id}>
              {manufacturer.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.div}>
        <label htmlFor="vehicleName" className={styles.label}>Vehicle Name</label>
        <input
          type="text"
          id="vehicleName"
          value={vehicleName}
          onChange={(e) => setVehicleName(e.target.value)}
          required
          className={styles.inputText}
        />
      </div>

      <div className={styles.div}>
        <label htmlFor="vehicleYear" className={styles.label}>Year</label>
        <input
          type="text"
          id="vehicleYear"
          value={vehicleYear}
          onChange={(e) => setVehicleYear(e.target.value)}
          required
          className={styles.inputText}
        />
      </div>

      <button type="submit" className={styles.button}>Add Vehicle</button>
    </form>
  );
};

export default AddVehicleForm;
