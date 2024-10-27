// components/SearchFilterSection/SearchFilterSection.tsx
import React, { useEffect, useState } from "react";
import { Input, Checkbox, Button, Slider } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  CloseOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import styles from "../AvailableCarsDueDates.module.css";

interface SearchFilterProps {
  query: string;
  setQuery: (query: string) => void;
  isFilterOpen: boolean;
  toggleFilter: () => void;
  transmission: string[];
  fuelType: string[];
  seats: number[];
  handleTransmissionChange: (values: string[]) => void;
  handleFuelTypeChange: (values: string[]) => void;
  handleSeatsChange: (values: number[]) => void;
  handlePriceSortChange: (value: "asc" | "desc" | undefined) => void;
  handlePriceRangeChange: (range: [number, number]) => void;
  onSearch: () => void;
}

const SearchFilterSection: React.FC<SearchFilterProps> = ({
  query,
  setQuery,
  isFilterOpen,
  toggleFilter,
  transmission,
  fuelType,
  seats,
  handleTransmissionChange,
  handleFuelTypeChange,
  handleSeatsChange,
  handlePriceSortChange,
  handlePriceRangeChange,
  onSearch,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSort, setCurrentSort] = useState<"asc" | "desc" | undefined>(
    undefined
  );
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([
    500, 10000,
  ]); // Local state for price range
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0); // Check if scrolled down
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSortChange = (value: "asc" | "desc") => {
    setCurrentSort(value);
    handlePriceSortChange(value); // Pass the value to the parent component
  };

  const handlePriceSliderChange = (value: [number, number]) => {
    setLocalPriceRange(value); // Update local price range
  };

  const handleApplyPriceRange = () => {
    handlePriceRangeChange(localPriceRange); // Call parent handler only when user wants to apply
  };

  return (
    <>
      <div
        className={`${styles.filterPanel} ${isFilterOpen ? styles.filterPanelOpen : ""}`}
      >
        {isFilterOpen && (
          <Button
            className={styles.filterButtonPhone}
            icon={isFilterOpen ? <CloseOutlined /> : <FilterOutlined />}
            onClick={toggleFilter}
            type="primary"
          >
            {isFilterOpen ? "" : "Filters"}
          </Button>
        )}
        <div className={styles.filterContent}>
          <div className={styles.filterGroup}>
            <p>Fuel Type</p>
            <Checkbox.Group
             className={styles.checkboxGroup} // Add this line
              options={[
                { label: "Petrol", value: "petrol" },
                { label: "Diesel", value: "diesel" },
                { label: "Hybrid", value: "hybrid" },
              ]}
              onChange={handleFuelTypeChange}
              value={fuelType}
            />
          </div>

          <div className={styles.filterGroup}>
            <p>Seats</p>
            <Checkbox.Group
            className={styles.checkboxGroup} // Add this line
              options={[
                { label: "4 Seats", value: 4 },
                { label: "5 Seats", value: 5 },
                { label: "6 Seats", value: 6 },
                { label: "7 Seats", value: 7 },
              ]}
              onChange={handleSeatsChange}
              value={seats}
            />
          </div>

          <div className={styles.filterGroup}>
            <p>Transmission</p>
            <Checkbox.Group
            className={styles.checkboxGroup} // Add this line
              options={[
                { label: "Automatic", value: "automatic" },
                { label: "Manual", value: "manual" },
              ]}
              onChange={handleTransmissionChange}
              value={transmission}
            />
          </div>

          {/* Price Range Slider */}
          <div className={styles.filterGroup}>
            <p>Price Range (per day)</p>
            <Slider
              range
              min={100} // Set your minimum price range here
              max={10000} // Set your maximum price range here
              step={100}
              value={localPriceRange}
              onChange={
                handlePriceSliderChange as (value: number | number[]) => void
              } // Ensure proper typing
              onAfterChange={handleApplyPriceRange} // Apply changes when user stops dragging the slider
            />
            <div className={styles.priceRangeDisplay}>
              <span>{`₹${localPriceRange[0]}`}</span> -{" "}
              <span>{`₹${localPriceRange[1]}`}</span>
            </div>
          </div>

          <div className={styles.sortingGroup}>
            <div className={styles.sortIcons}>
              <Button
                type={currentSort === "asc" ? "primary" : "default"}
                icon={<SortAscendingOutlined />}
                onClick={() => handleSortChange("asc")}
              />
              <Button
                type={currentSort === "desc" ? "primary" : "default"}
                icon={<SortDescendingOutlined />}
                onClick={() => handleSortChange("desc")}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.topBar} ${isScrolled ? styles.scrolled : ""}`}>
        <div className={styles.searchDiv}>
          <Input
            className={styles.searchField}
            placeholder="Search by car model, manufacturer, or features..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch();
            }}
            prefix={<SearchOutlined />}
          />
          <Button
            className={styles.filterButton}
            icon={isFilterOpen ? <CloseOutlined /> : <FilterOutlined />}
            onClick={toggleFilter}
            type="primary"
          >
            {isFilterOpen ? "Close Filters" : "Filters"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default SearchFilterSection;
