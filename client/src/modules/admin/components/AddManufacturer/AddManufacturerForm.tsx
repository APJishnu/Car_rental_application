"use client";

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_MANUFACTURER } from '@/graphql/admin-mutations/manufacture'; // Adjust the import path as needed
import styles from './AddManufacturerForm.module.css'; // Adjust import path as needed
import CountrySelect from 'react-select-country-list';
import { Alert } from 'antd';

const AddManufacturerForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', country: '' });
  const [image, setImage] = useState<File | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [addManufacturer] = useMutation(ADD_MANUFACTURER);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success'); // State for alert type
  const countryOptions = CountrySelect().getData();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = e.target.value;
    setFormData((prevData) => ({ ...prevData, country: selectedCountry }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedFile = e.target.files[0];
      setFileList([uploadedFile]);
      setImage(uploadedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!image) {
      setAlertType('error');
      setAlertMessage('No image selected');
      return;
    }

    const form = new FormData();
    form.append('name', formData.name);
    form.append('country', formData.country);
    form.append('image', image);

    try {
      await addManufacturer({
        variables: {
          name: formData.name,
          country: formData.country,
          image,
        },
      });
      setAlertType('success');
      setAlertMessage('Manufacturer added successfully!');
      setFormData({ name: '', country: '' });
      setFileList([]);
      setImage(null);
    } catch (error: any) {
      setAlertType('error');
      setAlertMessage(error.message || 'Error adding manufacturer');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Add Manufacturer</h2>
      <p className={styles.message}>Fill in the details below.</p>

      {alertMessage && (
        <Alert
          message={alertMessage}
          type={alertType}
          showIcon
          closable
          onClose={() => setAlertMessage('')} // Close alert on clicking the close button
          className={styles.alert}
        />
      )}

      <div className={styles.fieldGroup}>

      <div className={styles.formGroup}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="country">Country</label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleCountryChange}
          required
          className={styles.select}
        >
          <option value="">Select a country</option>
          {countryOptions.map((country) => (
            <option key={country.value} value={country.value}>
              {country.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="image" className={styles.uploadLabel}>
          Image
          <span className={styles.uploadIcon}>📸</span>
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          className={styles.fileInput}
          hidden // Hide the default file input
        />
        <label htmlFor="image" className={styles.customUpload}>
          {fileList.length > 0 ? fileList[0].name : 'Choose an image'}
        </label>
        {fileList.length > 0 && (
          <div className={styles.preview}>
            <p>Uploaded Image:</p>
            <img
              src={URL.createObjectURL(fileList[0])}
              alt="Preview"
              className={styles.imagePreview}
            />
          </div>
        )}
      </div>

      <button type="submit" className={styles.submitButton}>
        Add Manufacturer
      </button>
      </div>
    </form>
  );
};

export default AddManufacturerForm;
