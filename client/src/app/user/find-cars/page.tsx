"use client"

import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useRouter, useSearchParams } from "next/navigation";
import CarCard from "../../../modules/user/components/CarCardsSection/CarCards";
import styles from "./page.module.css";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Select, message } from "antd";
import CustomSelect from "../../../themes/CustomSelect/CustomSelect"; // Import the custom select
import Modal from "../../../themes/Modal/Modal"; // Import the reusable Modal
import { useAuthMiddleware } from "../../../utils/auth-middleware"; // Adjust the path as needed
import { searchVehicles } from "../../../lib/typesense-client";

const { Option } = Select;

const GET_AVAILABLE_VEHICLES = gql`
  query GetAvailableVehicles($pickupDate: String!, $dropoffDate: String!) {
    getAvailableVehicles(pickupDate: $pickupDate, dropoffDate: $dropoffDate) {
      id
      vehicleId
      pricePerDay
      availableQuantity
      vehicle {
        id
        name
        description
        transmission
        fuelType
        numberOfSeats
        year
        primaryImageUrl
        manufacturer {
          id
          name
          country
          imageUrl
        }
      }
    }
  }
`;

const FindCars: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams(); // Get search params for filtering
    const [modalMessage, setModalMessage] = useState("");
    const [modalStatus, setModalStatus] = useState<"success" | "error" | null>(null);
    const [query, setQuery] = useState(""); // For search query
    const [transmission, setTransmission] = useState<string | undefined>(undefined);
    const [fuelType, setFuelType] = useState<string | undefined>(undefined);
    const [seats, setSeats] = useState<number | undefined>(undefined);
    const [priceSort, setPriceSort] = useState<"asc" | "desc" | undefined>(undefined);
    const [filteredCars, setFilteredCars] = useState<any[]>([]); // Filtered cars
    const [isFiltering, setIsFiltering] = useState(false); // To track if filters are applied

    // Define the `setModal` function that updates the modal's state
    const setModal = (message: string, status: "success" | "error") => {
        setModalMessage(message);
        setModalStatus(status);
    };

    const { checkLogin } = useAuthMiddleware(setModal);

    // Get query params for pickupDate and dropoffDate
    const pickupDate = searchParams.get("pickupDate");
    const dropoffDate = searchParams.get("dropoffDate");

    // Fetch available vehicles from GraphQL query
    const { loading, error, data } = useQuery(GET_AVAILABLE_VEHICLES, {
        variables: {
            pickupDate: pickupDate || "", // Handle null gracefully
            dropoffDate: dropoffDate || "",
        },
        skip: !pickupDate || !dropoffDate, // Skip query if dates are not present
    });

    useEffect(() => {
        const fetchFilteredCars = async () => {
          setIsFiltering(true); // Mark as filtering
      
          try {
            // If there are no available cars, show message and exit early
            if (!data?.getAvailableVehicles || data.getAvailableVehicles.length === 0) {
              setFilteredCars([]);
              message.warning("No cars available for the selected dates.");
              setIsFiltering(false);
              return;
            }
      
            // Extract the available car vehicle IDs
            const availableCarIds = data.getAvailableVehicles.map((car: any) => car.vehicleId);
      
            // Perform Typesense search only on available cars
            const searchResults = await searchVehicles(query, transmission, fuelType, seats, priceSort, availableCarIds);
      
            // If search result is null or empty, show a message
            if (!searchResults || searchResults.length === 0) {
              setFilteredCars([]);
              message.warning("No cars match the search criteria.");
            } else {
              setFilteredCars(searchResults);
            }
          } catch (error) {
            setIsFiltering(false);
            return error; 
          } finally {
            setIsFiltering(false); // Filtering is done
          }
        };
      
        if (!loading && data) {
          fetchFilteredCars();
        }
      }, [query, transmission, fuelType, seats, priceSort, data]);

    // Handle rent action
    const handleRentNow = (carId: string, pickupDate: string, dropoffDate: string) => {
        router.push(`/user/car-booking?carId=${carId}&pickupDate=${pickupDate}&dropoffDate=${dropoffDate}`);
    };

    const handleRentNowWithChecks = (carId: string) => {
        if (checkLogin()) {
            if (pickupDate && dropoffDate) {
                handleRentNow(carId, pickupDate, dropoffDate);
            } else {
                console.error("Pickup date or dropoff date is not set.");
            }
        }
    };

    // Function to calculate total price based on dates and pricePerDay
    const calculateTotalPrice = (pricePerDay: number) => {
        if (!pickupDate || !dropoffDate) return 0;

        const start = new Date(pickupDate);
        const end = new Date(dropoffDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)); // Calculate days

        return pricePerDay * days;
    };


    const handleTransmissionChange = (value: string | undefined) => {
        // Logic for handling the transmission change
        setTransmission(value); // Update the state
    };
    
    const handleFuelTypeChange = (value: string | undefined) => {
        // Logic for handling the fuel type change
        setFuelType(value); // Update the state
    };
    

    const handleSeatsChange = (value: number | undefined) => {
        // Logic for handling the seats change
        setSeats(value); // Update the state
    };

    const handlePriceSortChange = (value: "asc" | "desc" | undefined) => {
        // Logic for handling the price sort change
        setPriceSort(value); // Update the state
    };

    // Function to close the modal
    const closeModal = () => {
        setModalStatus(null);
    };

    // Determine the cars to show based on filtering or default GraphQL query data
    const availableCars = isFiltering || filteredCars.length > 0
        ? filteredCars
        : data?.getAvailableVehicles || [];

    // Show no available cars message if the filteredCars or availableCars is empty
    const noCarsAvailable = availableCars.length === 0;

    if (loading) return <p>Loading available cars...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className={styles.carCollection}>
            <div className={styles.filters}>
                <div className={styles.searchDiv}>

                    <Input
                        className={styles.searchField}
                        placeholder="Search by car model, manufacturer, or features..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        prefix={<SearchOutlined />}

                    />
                </div>
                <div className={styles.filterDiv}>
                <CustomSelect
    placeholder="Transmission"
    options={[
        { value: "", label: "All" },
        { value: "automatic", label: "Automatic" },
        { value: "manual", label: "Manual" },
    ]}
    onChange={handleTransmissionChange}
    value={transmission}
/>
<CustomSelect
    placeholder="Fuel Type"
    options={[
        { value: "", label: "All" },
        { value: "petrol", label: "Petrol" },
        { value: "diesel", label: "Diesel" },
    ]}
    onChange={handleFuelTypeChange}
    value={fuelType}
/>
<CustomSelect
    placeholder="Seats"
    options={[
        { value: 0, label: "All" },
        { value: 4, label: "4 Seats" },
        { value: 5, label: "5 Seats" },
        { value: 7, label: "7 Seats" },
    ]}
    onChange={handleSeatsChange}
    value={seats}
/>
<CustomSelect
    placeholder="Sort by Price"
    options={[
        { value: "asc", label: "Price: Low to High" },
        { value: "desc", label: "Price: High to Low" },
    ]}
    onChange={handlePriceSortChange}
    value={priceSort}
/>

                </div>
            </div>

            <div className={styles.carCollectionSecondDiv}>
                <div className={styles.carsGrid}>
                    {noCarsAvailable ? (
                        <p style={{textAlign:"center"}}>No cars available for the selected dates.</p>
                    ) : (
                        availableCars.map((car: any) => {
                            const totalPrice = calculateTotalPrice(Number(car.pricePerDay));
                            return (
                                <CarCard
                                    key={car.id}
                                    image={car.vehicle.primaryImageUrl}
                                    model={car.vehicle.name}
                                    price={car.pricePerDay}
                                    totalPrice={totalPrice}
                                    features={{
                                        passengers: car.vehicle.numberOfSeats || "",
                                        transmission: car.vehicle.transmission,
                                        fuelType: car.vehicle.fuelType,
                                    }}
                                    onRentNow={() => handleRentNowWithChecks(car.id)}
                                />
                            );
                        })
                    )}
                </div>
            </div>

            {modalStatus && (
                <Modal
                    message={modalMessage}
                    status={modalStatus}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default FindCars;
