"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery, gql, useMutation, useApolloClient } from "@apollo/client";
import { Card, Typography, Spin, Button, Empty, message, Tooltip } from "antd";
import { DeleteOutlined, SearchOutlined, FireFilled, CarFilled, TeamOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import styles from "./page.module.css";
import { searchVehicles } from "../../../lib/typesense-client";
import { useAddVehicleToTypesense } from "../../../modules/admin/services/typesenseMutations/rentable-vehicle-typesense";

const { Title } = Typography;

const GET_RENTABLE_VEHICLES = gql`
  query GetRentableVehicles {
    getRentableVehicles {
      id
      vehicleId
      pricePerDay
      availableQuantity
      vehicle {           
        id
        name
        description
        year
        transmission
        fuelType
        numberOfSeats
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

const DELETE_RENTABLE_VEHICLE = gql`
  mutation DeleteRentableVehicle($id: ID!) {
    deleteRentableVehicle(id: $id) {
      id
    }
  }
`;


const RentableVehiclesList: React.FC = () => {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const client = useApolloClient();

    const hasFetched = useRef(false); // To track if the data has already been fetched

    const { addVehicles } = useAddVehicleToTypesense();


    const handleDelete = (id: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsDeleting(true);
                try {
                    await client.mutate({ mutation: DELETE_RENTABLE_VEHICLE, variables: { id } });
                    Swal.fire({
                        title: "Deleted!",
                        text: "Vehicle deleted successfully.",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                    setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== id));
                } catch (error) {
                    Swal.fire({
                        title: "Error!",
                        text: "Error deleting vehicle. Please try again.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                } finally {
                    setIsDeleting(false);
                }
            }
        });
    };

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                setLoading(true);
                const { data } = await client.query({ query: GET_RENTABLE_VEHICLES });
                setVehicles(data.getRentableVehicles);

                // Add all vehicles to Typesense (only if it hasn't been done already)
                await addVehicles(data.getRentableVehicles);
            } catch (err) {
                setError("Error fetching vehicles. Please try again later.");
                Swal.fire({
                    title: "Error!",
                    text: "Error fetching vehicles. Please try again later.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            } finally {
                setLoading(false);
            }
        };
        if (!hasFetched.current) {
            fetchVehicles();
            hasFetched.current = true; // Set to true after fetching the data
        }
    }, [client, addVehicles]); // Ensure the useEffect runs only once

    useEffect(() => {
        const handleSearch = async () => {
            if (!query.trim()) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const results = await searchVehicles(query);
                console.log('Search Results:', results); // Log search results
                setSearchResults(results);
            } catch (error) {
                console.error("Search error:", error); // Log any errors during the search
                message.error("Search failed. Please try again.");
            } finally {
                setIsSearching(false);
            }
        };


        const delayDebounceFn = setTimeout(() => {
            handleSearch();
        }, 300); // Wait 300ms before executing the search

        return () => clearTimeout(delayDebounceFn); // Cleanup function
    }, [query]);

    const carsToDisplay = searchResults.length > 0 ? searchResults : vehicles;

    if (loading) return <Spin size="large" style={{ display: "block", margin: "50%" }} />;

    return (
        <div className={styles.container}>
            <Title level={2} className={styles.title}>Rentable Vehicles List</Title>

            <div className={styles.searchSection}>
                <div className={styles.inputContainer}>
                    <input
                        className={styles.inputField}
                        placeholder="Search by model, manufacturer..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button icon={<SearchOutlined />} type="primary" className={styles.searchIcon} loading={isSearching}>
                    </Button>
                </div>
            </div>

            {carsToDisplay.length === 0 ? (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No rentable vehicles available"
                    style={{ marginTop: "50px" }}
                />
            ) : (
                <div className={styles.cardContainer}>
                    {carsToDisplay.map((vehicleData) => (
                        <Card
                            key={vehicleData.id}
                            className={styles.vehicleCard}
                            hoverable
                            cover={
                                <img
                                    alt="Primary"
                                    src={vehicleData.vehicle.primaryImageUrl}
                                    className={styles.vehicleImage}
                                />
                            }
                        >
                            <div className={styles.manufacturerLogoContainer}>
                                <img
                                    src={vehicleData.vehicle.manufacturer.imageUrl}
                                    alt="Manufacturer"
                                    className={styles.manufacturerLogo}
                                />
                            </div>
                            <Card.Meta
                                title={`${vehicleData.vehicle.name}/${vehicleData.vehicle.year}`}
                                description={
                                    <div className={styles.description}>
                                        <p>{vehicleData.vehicle.description.length > 50
                                            ? `${vehicleData.vehicle.description.substring(0, 60)}...`
                                            : vehicleData.vehicle.description}
                                        </p>
                                        <div className={styles.details}>
                                            <strong className={styles.price}><span>${vehicleData.pricePerDay.toFixed(2)}</span>/Day </strong> <br />

                                            <div className={styles.specifications}>
                                                <div className={styles.detailItem}>
                                                    <Tooltip title="Transmission">
                                                        <CarFilled /> {vehicleData.vehicle.transmission}
                                                    </Tooltip>
                                                </div>
                                                <div className={styles.detailItem}>
                                                    <Tooltip title="Fuel Type">
                                                        <FireFilled /> {vehicleData.vehicle.fuelType}
                                                    </Tooltip>
                                                </div>
                                                <div className={styles.detailItem}>
                                                    <Tooltip title="Number of Seats">
                                                        <TeamOutlined /> {vehicleData.vehicle.numberOfSeats}
                                                    </Tooltip>
                                                </div>
                                            </div>

                                            <div className={styles.availableQuantity}>Available Quantity:{vehicleData.availableQuantity}</div>
                                        </div>
                                    </div>
                                }
                            />
                            <Button
                                type="default"
                                icon={<DeleteOutlined />}
                                className={styles.deleteButton}
                                onClick={() => handleDelete(vehicleData.id)}
                            />
                        </Card>
                    ))}
                </div>
            )}
            {isDeleting && <Spin size="large" style={{ display: "block", margin: "50%" }} />}
        </div>
    );
};

export default RentableVehiclesList;

