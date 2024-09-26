// pages/admin/manufacture-list.tsx
"use client";

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_MANUFACTURERS } from '@/graphql/admin-queries/manufacture'; // Adjust the path if necessary
import styles from './page.module.css'; // Import your CSS module
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const ManufactureList: React.FC = () => {
  const { loading, error, data } = useQuery(GET_MANUFACTURERS);

  const handleEdit = (manufacturerId: string) => {
    // Implement edit logic here
    console.log(`Edit manufacturer with ID: ${manufacturerId}`);
  };

  const handleDelete = (manufacturerId: string) => {
    // Implement delete logic here
    console.log(`Delete manufacturer with ID: ${manufacturerId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching manufacturers: {error.message}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manufacturer List</h1>
      <ul className={styles.list}>
        {data.getManufacturers.map((manufacturer: any) => (
          <li key={manufacturer.id} className={styles.listItem}>
            <div className={styles.manufacturerDetails}>
              <img 
                src={manufacturer.imageUrl} 
                alt={manufacturer.name} 
                width={100} // Adjust width as needed
                className={styles.image} // Optional: Apply any additional styling
              />
              <div className={styles.text}>
                <p className={styles.name}>{manufacturer.name}</p>
                <p className={styles.country}>{manufacturer.country}</p>
              </div>
            </div>
            <div className={styles.actions}>
              <button onClick={() => handleEdit(manufacturer.id)} className={styles.actionButton}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button onClick={() => handleDelete(manufacturer.id)} className={styles.actionButton}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManufactureList;
