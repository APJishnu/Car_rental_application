// pages/admin/manufacture-list/page.tsx
"use client";

import React from 'react';
import Manufacturer from '../../../modules/admin/components/ManuFacturerList/ManuFacturer'; // Adjust the import path as necessary

const ManufactureList: React.FC = () => {
  return (
    <div style={{ padding: '20px 10px' }}>
      <Manufacturer /> {/* Call the Manufacturer component here */}
    </div>
  );
};

export default ManufactureList;
