// pages/all-manufacturers.tsx
"use client";

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_MANUFACTURERS } from '@/graphql/admin-queries/manufacture';
import styles from './page.module.css'; // Reuse styles

const AllManufacturers: React.FC = () => {
  const { loading, error, data } = useQuery(GET_MANUFACTURERS);

  if (loading) return <p>Loading all manufacturers...</p>;
  if (error) return <p>Error fetching manufacturers: {error.message}</p>;

  return (
    <div className={styles.rentSection}>
      <h1 className={styles.title}>All Manufacturers</h1>
      <div className={styles.brandGrid}>
        {data.getManufacturers.map((manufacturer: any) => (
          <div key={manufacturer.id} className={styles.brandCard}>
            <img src={manufacturer.imageUrl} alt={manufacturer.name} className={styles.brandLogo} />
            <p>{manufacturer.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllManufacturers;
