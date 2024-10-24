// app/user/find-cars/page.tsx
"use client";

import React from "react";
import FindCars from "../../../modules/user/components/AvailableCarsDueDates/AvailableCarsDueDates"; // Adjust the import path as necessary

const FindCarsPage: React.FC = () => {
  return (
    <div>
      <FindCars />
    </div>
  );
};

export default FindCarsPage;
