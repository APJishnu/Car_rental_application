"use client"

import React, { useState } from 'react';
import { useMutation} from '@apollo/client';
import { ADD_VEHICLE } from '@/graphql/admin-mutations/vehicles'; // Ensure this is the correct path
// import { ADD_VEHICLE, GET_MANUFACTURERS } from '@/graphql/admin-mutations/vehicles';
import Input from '@/themes/InputField/InputField'; // Update with the correct path
import Button from '@/themes/Button/Button'; // Update with the correct path
import styles from './AddVehicle.module.css'; // Optional: add your CSS module

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    primaryImage: '',
    otherImages: '',
    quantity: '',
    manufacturerId: '',
  });



  const [addVehicle] = useMutation(ADD_VEHICLE, {
    onCompleted: (data) => {
      console.log('Vehicle added:', data);
      setFormData({
        name: '',
        description: '',
        price: '',
        primaryImage: '',
        otherImages: '',
        quantity: '',
        manufacturerId: '',
      });
    },
    onError: (error) => {
      console.error('Error adding vehicle:', error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      const fileArray = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData((prevData) => ({
        ...prevData,
        [name]: fileArray,
      }));
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVehicle({ variables: { input: formData } });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        type="text"
        name="name"
        id="vehicleName"
        value={formData.name}
        onChange={handleChange}
        placeholder="Vehicle Name"
        required
      />
      <Input
        type="text"
        name="description"
        id="vehicleDescription"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />
      <Input
        type="number"
        name="price"
        id="vehiclePrice"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        required
      />
      
      {/* File input for primary image */}
      <input
        type="file"
        name="primaryImage"
        id="primaryImage"
        onChange={handleFileChange}
        accept="image/*"
        required
      />

      {/* File input for other images */}
      <input
        type="file"
        name="otherImages"
        id="otherImages"
        onChange={handleFileChange}
        accept="image/*"
        multiple
      />

      <Input
        type="number"
        name="quantity"
        id="vehicleQuantity"
        value={formData.quantity}
        onChange={handleChange}
        placeholder="Available Quantity"
        required
      />
      
      {/* Manufacturer Dropdown */}
      {/* <select
        name="manufacturerId"
        id="manufacturerId"
        value={formData.manufacturerId}
        onChange={handleChange}
        required
      >
        <option value="" disabled>Select Manufacturer</option>
        {manufacturersData?.manufacturers.map((manufacturer) => (
          <option key={manufacturer.id} value={manufacturer.id}>
            {manufacturer.name}
          </option>
        ))}
      </select> */}


       
      {/* Manufacturer Dropdown with Temporary Options */}
      <select
        name="manufacturerId"
        id="manufacturerId"
        value={formData.manufacturerId}
        onChange={handleChange}
        required
      >
        <option value="" disabled>Select Manufacturer</option>
        <option value="1">Toyota</option>
        <option value="2">Honda</option>
        <option value="3">Ford</option>
        <option value="4">Chevrolet</option>
        <option value="5">Tesla</option>
      </select>

      <Button type="submit">Add Vehicle</Button>
    </form>
  );
};

export default AddVehicle;
