"use client"

// components/AddManufacturerForm.tsx
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import styles from './AddManufacturerForm.module.css'; // Adjust the path for your styles
import { ADD_MANUFACTURER } from '@/graphql/admin-mutations/manufacture';

const AddManufacturerForm: React.FC = () => {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [addManufacturer] = useMutation(ADD_MANUFACTURER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      console.error('No image selected');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('country', country);
    formData.append('image', image);

    try {
      const response = await addManufacturer({
        variables: {
          name,
          country,
          image,
        },
        context: {
          fetchOptions: {
            formData,
          },
        },
      });
      console.log('Manufacturer added:', response.data);
      // Optionally reset the form
      setName('');
      setCountry('');
      setImage(null);
    } catch (error) {
      console.error('Error adding manufacturer:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.div}>
        <label htmlFor="name" className={styles.label}>Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={styles.inputText}
        />
      </div>
      <div className={styles.div}>
        <label htmlFor="country" className={styles.label}>Country</label>
        <input
          type="text"
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className={styles.inputText}
        />
      </div>
      <div className={styles.div}>
        <label htmlFor="image" className={styles.label}>Image</label>
        <input
          type="file"
          id="image"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          className={styles.inputFile}
          required
        />
      </div>
      <button type="submit" className={styles.button}>Add Manufacturer</button>
    </form>
  );
};

export default AddManufacturerForm;
