// page.tsx

import React from "react";
import InventoryManagement from "../../../modules/admin/components/InventoryManagement/InventoryManagement"; // adjust the path as necessary

const InventoryPage: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      <InventoryManagement />
    </div>
  );
};

export default InventoryPage;
