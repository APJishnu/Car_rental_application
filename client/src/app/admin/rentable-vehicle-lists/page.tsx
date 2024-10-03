"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, gql, useMutation, useApolloClient } from '@apollo/client'; // Import useApolloClient
import { Card, Typography, Spin, Button, Empty } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2'; // Import SweetAlert2
import styles from './page.module.css'; // Import your CSS module

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

// Mutation to delete a vehicle
const DELETE_RENTABLE_VEHICLE = gql`
  mutation DeleteRentableVehicle($id: ID!) {
    deleteRentableVehicle(id: $id) {
      id
    }
  }
`;

const RentableVehiclesList: React.FC = () => {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteRentableVehicle] = useMutation(DELETE_RENTABLE_VEHICLE);
    const [isDeleting, setIsDeleting] = useState(false); // Local state for deletion
    const client = useApolloClient(); // Get the Apollo Client instance

    // Fetch rentable vehicles data using useEffect
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                setLoading(true);
                const { data } = await client.query({ query: GET_RENTABLE_VEHICLES }); // Use Apollo Client instance
                setVehicles(data.getRentableVehicles);
            } catch (err) {
                setError('Error fetching vehicles. Please try again later.');
                Swal.fire({
                    title: 'Error!',
                    text: 'Error fetching vehicles. Please try again later.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, [client]); // Include client in the dependency array

    const handleDelete = (id: string) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsDeleting(true); // Set deleting state to true
                try {
                    await deleteRentableVehicle({ variables: { id } });
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Vehicle deleted successfully.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    // Refresh vehicles list after deletion
                    setVehicles((prev) => prev.filter(vehicle => vehicle.id !== id));
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Error deleting vehicle. Please try again.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                } finally {
                    setIsDeleting(false); // Reset deleting state
                }
            }
        });
    };

    if (loading) return <Spin size="large" style={{ display: 'block', margin: '50%' }} />;

    return (
        <div className={styles.container}>
            <Title level={2} className={styles.title}>Rentable Vehicles List</Title>
            {vehicles.length === 0 ? (
                <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No rentable vehicles available"
                    style={{ marginTop: '50px' }} // Center the empty state vertically
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
                                title={vehicleData.vehicle.name}
                                description={
                                    <div className={styles.description}>
                                        <p>{vehicleData.vehicle.description.length > 50
                                            ? `${vehicleData.vehicle.description.substring(0, 60)}...`
                                            : vehicleData.vehicle.description}
                                        </p>
                                        <div className={styles.details}>
                                            <strong>Year:</strong> {vehicleData.vehicle.year} <br />
                                            <strong className={styles.price}><span>${vehicleData.pricePerDay.toFixed(2)}</span>,Price/Day </strong> <br />
                                            <strong>Available Quantity:</strong> {vehicleData.availableQuantity}
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
            {isDeleting && <Spin size="large" style={{ display: 'block', margin: '50%' }} />} {/* Show loading spinner only during deletion */}
        </div>
    );
};

export default RentableVehiclesList;
