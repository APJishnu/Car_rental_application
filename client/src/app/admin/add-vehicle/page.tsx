// pages/add-vehicles/page.tsx

import React from "react";
import AddVehicles from "@/modules/admin/components/AddVehicles/AddVehicles"; // Adjust path if necessary
import styles from './page.module.css'

const AddVehiclesPage = () => {
  return (
    <div className={styles.MainDiv}>
      <h1>Add New Vehicle</h1>
      <AddVehicles />
    </div>
  );
};

export default AddVehiclesPage;
