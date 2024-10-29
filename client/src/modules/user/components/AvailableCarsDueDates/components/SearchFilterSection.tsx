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
  const [currentSort, setCurrentSort] = useState<"asc" | "desc" | undefined>(undefined);
  const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>([500, 10000]);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const handleSortChange = (value: "asc" | "desc") => {
    setCurrentSort(value);
    handlePriceSortChange(value);
  };

  // Handle price range changes with debouncing
  const handlePriceChange = (value: number[]) => {
    // Ensure the value is treated as a tuple of two numbers
    const priceRange: [number, number] = [value[0], value[1]];
    setCurrentPriceRange(priceRange);

    // Clear any existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set a new timer to update the price range after a short delay
    const timer = setTimeout(() => {
      handlePriceRangeChange(priceRange);
    }, 300);

    setDebounceTimer(timer);
  };

  return (
    <>
      <div className={`${styles.filterPanel} ${isFilterOpen ? styles.filterPanelOpen : ""}`}>
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
              className={styles.checkboxGroup}
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
              className={styles.checkboxGroup}
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
              className={styles.checkboxGroup}
              options={[
                { label: "Automatic", value: "automatic" },
                { label: "Manual", value: "manual" },
              ]}
              onChange={handleTransmissionChange}
              value={transmission}
            />
          </div>

          {/* Price Range Slider with continuous updates */}
          <div className={styles.filterGroup}>
            <p>Price Range (per day)</p>
            <Slider
              range
              min={100}
              max={10000}
              step={100}
              value={currentPriceRange}
              onChange={handlePriceChange}
            />
            <div className={styles.priceRangeDisplay}>
              <span>₹{currentPriceRange[0]}</span> - <span>₹{currentPriceRange[1]}</span>
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