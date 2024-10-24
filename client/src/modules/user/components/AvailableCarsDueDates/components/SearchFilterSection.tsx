// components/SearchFilterSection/SearchFilterSection.tsx
import React from 'react';
import { Input, Checkbox, Button } from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import styles from '../AvailableCarsDueDates.module.css';

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
  onSearch,
}) => {
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
              options={[
                { label: "4 Seats", value: 4 },
                { label: "5 Seats", value: 5 },
                { label: "7 Seats", value: 7 },
              ]}
              onChange={handleSeatsChange}
              value={seats}
            />
          </div>

          <div className={styles.filterGroup}>
            <p>Transmission</p>
            <Checkbox.Group
              options={[
                { label: "Automatic", value: "automatic" },
                { label: "Manual", value: "manual" },
              ]}
              onChange={handleTransmissionChange}
              value={transmission}
            />
          </div>

          <div className={styles.filterGroup}>
            <p>Sort by Price</p>
            <select
              name="priceSort"
              value="priceSort"
              id="priceSort"
              className={styles.customSelect}
              onChange={(e) => handlePriceSortChange(e.target.value as "asc" | "desc")}
            >
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.topBar}>
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