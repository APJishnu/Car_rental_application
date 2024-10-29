"use client";
import React, { useState, useEffect, useRef } from "react";
import { gql, useApolloClient } from "@apollo/client";
import { Card, Typography, Spin, Button, Empty, Tooltip } from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  FireFilled,
  CarFilled,
  TeamOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import styles from "./page.module.css";
import { useAddVehicleToTypesense } from "../../../modules/admin/services/typesenseMutations/rentable-vehicle-typesense";

const { Title } = Typography;

// Unified query for fetching rentable vehicles
const GET_RENTABLE_VEHICLES = gql`
  query GetRentableVehicles($query: String) {
    getRentableVehicles(query: $query) {
      status
      statusCode
      message
      data {
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
  }
`;

const DELETE_RENTABLE_VEHICLE = gql`
  mutation DeleteRentableVehicle($id: ID!) {
    deleteRentableVehicle(id: $id) {
      status
      statusCode
      message
      data
    }
  }
`;
const RentableVehiclesList: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const client = useApolloClient();
  const hasFetchedInitially = useRef(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
          const { data } = await client.mutate({
            mutation: DELETE_RENTABLE_VEHICLE,
            variables: { id },
          });

          const { status, message: deleteMessage } = data.deleteRentableVehicle;

          if (status) {
            Swal.fire({
              title: "Deleted!",
              text: deleteMessage,
              icon: "success",
              confirmButtonText: "OK",
            });
            setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== id));
          } else {
            throw new Error(deleteMessage);
          }
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

  // Fetch rentable vehicles function
  const fetchVehicles = async (searchQuery: string = "") => {
    try {
      setLoading(true);
      const { data } = await client.query({
        query: GET_RENTABLE_VEHICLES,
        variables: { query: searchQuery.trim() || null },
      });

      const {
        status,
        statusCode,
        message: fetchMessage,
        data: vehiclesData,
      } = data.getRentableVehicles;

      if (status === "success") {
        setVehicles(vehiclesData);
        await addVehicles(vehiclesData); // Assuming addVehicles is not called on every fetch, you may want to check this.
      } else {
        throw new Error(`(${statusCode}) ${fetchMessage}`);
      }
    } catch (err) {
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

  // Fetch initial vehicles only once on component mount
  useEffect(() => {
    if (!hasFetchedInitially.current) {
      fetchVehicles();
      hasFetchedInitially.current = true; // Set the flag to true after the initial fetch
    }
  }, []);

  // Handle search input change with debounce
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Only fetch vehicles if the search query length is at least 2
    if (newQuery.length >= 2) {
      debounceTimeoutRef.current = setTimeout(() => {
        fetchVehicles(newQuery);
      }, 300); // 300ms debounce delay
    } else if (newQuery.length === 0) {
      // If the search input is cleared, fetch all vehicles
      fetchVehicles();
    }
  };

  // Cleanup the timeout on component unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  if (loading)
    return <Spin size="large" style={{ display: "block", margin: "50%" }} />;

  return (
    <div className={styles.container}>
      <Title level={2} className={styles.title}>
        Rentable Vehicles List
      </Title>

      <div className={styles.searchSection}>
        <div className={styles.inputContainer}>
          <input
            className={styles.inputField}
            placeholder="Search by model, manufacturer..."
            value={query}
            onChange={handleSearch}
          />
          <Button
            icon={<SearchOutlined />}
            type="primary"
            className={styles.searchIcon}
            loading={loading && query.trim().length > 0} // Loading state while searching
          />
        </div>
      </div>

      {vehicles.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No rentable vehicles available"
          style={{ marginTop: "50px" }}
        />
      ) : (
        <div className={styles.cardContainer}>
          {vehicles.map((vehicleData) => (
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
                    <p>
                      {vehicleData.vehicle.description.length > 50
                        ? `${vehicleData.vehicle.description.substring(0, 60)}...`
                        : vehicleData.vehicle.description}
                    </p>
                    <div className={styles.details}>
                      <strong className={styles.price}>
                        <span>${vehicleData.pricePerDay.toFixed(2)}</span>/Day{" "}
                      </strong>
                      <br />
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
                      <div className={styles.availableQuantity}>
                        Available Quantity: {vehicleData.availableQuantity}
                      </div>
                    </div>
                  </div>
                }
              />
              <Button
                danger
                icon={<DeleteOutlined />}
                type="primary"
                onClick={() => handleDelete(vehicleData.id)}
                loading={isDeleting}
                className={styles.deleteButton}
              ></Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RentableVehiclesList;
