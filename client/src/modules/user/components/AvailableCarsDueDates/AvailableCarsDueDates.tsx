// app/user/components/FindCars.tsx
"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Modal from "../../../../themes/Modal/Modal";
import { useAuthMiddleware } from "../../../../utils/auth-middleware";
import SearchFilterSection from "./components/SearchFilterSection";
import CarListSection from "./components/FindCarCollection";
import styles from "./AvailableCarsDueDates.module.css";

const AvailableCarsDueDates: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [modalMessage, setModalMessage] = useState("");
  const [modalStatus, setModalStatus] = useState<"success" | "error" | null>(null);
  const [query, setQuery] = useState("");
  const [transmission, setTransmission] = useState<string[]>([]);
  const [fuelType, setFuelType] = useState<string[]>([]);
  const [seats, setSeats] = useState<number[]>([]);
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | undefined>(undefined);
  const [priceRange, setPriceRange] = useState<[number, number]>([500, 10000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  const { checkLogin } = useAuthMiddleware((message: string, status: "success" | "error") => {
    setModalMessage(message);
    setModalStatus(status);
  });

  const pickupDate = searchParams.get("pickupDate");
  const dropoffDate = searchParams.get("dropoffDate");
  const inventoryId = searchParams.get("inventoryId");

  const handleRentNow = (carId: string) => {
    if (checkLogin()) {
      if (pickupDate && dropoffDate) {
        router.push(
          `/user/car-booking?carId=${carId}&pickupDate=${pickupDate}&dropoffDate=${dropoffDate}`
        );
      } else {
      }
    }
  };

  return (
    <div className={styles.mainDiv}>
      <SearchFilterSection
        query={query}
        setQuery={setQuery}
        isFilterOpen={isFilterOpen}
        toggleFilter={toggleFilter}
        transmission={transmission}
        fuelType={fuelType}
        seats={seats}
        handleTransmissionChange={setTransmission}
        handleFuelTypeChange={setFuelType}
        handleSeatsChange={setSeats}
        handlePriceSortChange={setPriceSort}
        handlePriceRangeChange={setPriceRange} // New handler for price range
        onSearch={() => {}} // This will trigger the CarListSection to refetch
      />

      <div className={styles.carCollection}>
        <CarListSection
          pickupDate={pickupDate}
          dropoffDate={dropoffDate}
          inventoryId={inventoryId}
          query={query}
          transmission={transmission}
          fuelType={fuelType}
          seats={seats}
          priceSort={priceSort}
            priceRange={priceRange}
          onRentNow={handleRentNow}
        />
      </div>

      {modalStatus && (
        <Modal
          message={modalMessage}
          status={modalStatus}
          onClose={() => setModalStatus(null)}
        />
      )}
    </div>
  );
};

export default AvailableCarsDueDates;
