// Import necessary modules
"use client";
import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Card, Button, Image, Space, Modal, Tooltip, Input, Select } from "antd"; // Importing Ant Design components
import Swal from "sweetalert2"; // SweetAlert2 for popups
import styles from "./vehicle-list.module.css"; // Your CSS module
import { useRouter } from 'next/navigation';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined, InfoCircleOutlined, LeftOutlined, RightOutlined, CarOutlined, ToolOutlined, TeamOutlined, FireOutlined } from '@ant-design/icons';

// Define the Vehicle type
type Vehicle = {
  id: string;
  name: string;
  description?: string;
  transmission: string;
  fuelType: string;
  numberOfSeats: string;
  quantity: string;
  year: string;
  primaryImageUrl?: string;
  otherImageUrls?: string[];
};

// Define Rentable input type
type RentableInput = {
  vehicleId: string;
  pricePerDay: number;
  availableQuantity: number;
};

// GraphQL queries
type GetVehiclesData = {
  getVehicles: Vehicle[];
};

type DeleteVehicleData = {
  deleteVehicle: Vehicle;
};

type AddRentableData = {
  addRentable: {
    id: string;
    vehicleId: string;
    pricePerDay: number;
    availableQuantity: number;
  };
};

const GET_VEHICLES = gql`
  query GetVehicles {
    getVehicles {
      id
      name
      description
      transmission
      fuelType
      numberOfSeats
      quantity
      year
      primaryImageUrl
      otherImageUrls
    }
  }
`;

const DELETE_VEHICLE = gql`
  mutation DeleteVehicle($id: String!) {
    deleteVehicle(id: $id) {
      id
    }
  }
`;


const ADD_RENTABLE = gql`
  mutation AddRentable($vehicleId: ID!, $pricePerDay: Float!, $availableQuantity: Int!) {
    addRentable(vehicleId: $vehicleId, pricePerDay: $pricePerDay, availableQuantity: $availableQuantity) {
      id
      vehicleId
      pricePerDay
      availableQuantity
    }
  }
`;


const VehicleListPage: React.FC = () => {
  const router = useRouter(); // Initialize router
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null); // State to hold selected vehicle for modal
  const [currentImageIndexes, setCurrentImageIndexes] = useState<number[]>([]); // Index for showing current images for each vehicle
  const { loading, error, data, refetch } = useQuery<GetVehiclesData>(GET_VEHICLES);
  const [deleteVehicle] = useMutation<DeleteVehicleData>(DELETE_VEHICLE, {
    onCompleted: () => {
      refetch(); // Refetch vehicles after deletion
    },
    onError: (err) => {
      console.error("Error deleting vehicle:", err);
      Swal.fire("Error!", err.message, "error"); // Display error message
    },
  });

  const [addRentable] = useMutation<AddRentableData>(ADD_RENTABLE, {
    onCompleted: () => {
      Swal.fire("Success!", "Vehicle added to rentable list.", "success");
      setSelectedRentableVehicle(null); // Close rentable modal
    },
    onError: (err) => {
      console.error("Error adding to rentable:", err);
      Swal.fire("Error!", err.message, "error"); // Display error message
    },
  });

  // State for managing rentable modal
  const [selectedRentableVehicle, setSelectedRentableVehicle] = useState<Vehicle | null>(null);
  const [pricePerDay, setPricePerDay] = useState<number | null>(null);
  const [availableQuantity, setAvailableQuantity] = useState<number | null>(null);

  // Handle delete action with confirmation popup
  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteVehicle({ variables: { id } });
        Swal.fire("Deleted!", "Your vehicle has been deleted.", "success");
      }
    });
  };

  // Handle more details modal
  const showDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleModalClose = () => {
    setSelectedVehicle(null);
  };

  const handleRentableModalClose = () => {
    setSelectedRentableVehicle(null);
    setPricePerDay(null);
    setAvailableQuantity(null);
  };

  // Handle Add to Rentable
  const handleAddRentable = (vehicle: Vehicle) => {
    setSelectedRentableVehicle(vehicle);
  };

  const handleRentableSubmit = () => {
    if (pricePerDay !== null && availableQuantity !== null && selectedRentableVehicle) {
      addRentable({
        variables: {
          vehicleId: selectedRentableVehicle.id,  // Ensure this is the correct ID type
          pricePerDay,
          availableQuantity,
        },
      }).catch(err => {
        console.error("Error adding to rentable:", err);
        Swal.fire("Error!", err.message, "error"); // Display error message
      });
    } else {
      Swal.fire("Error!", "Please provide both price per day and available quantity.", "error");
    }
  };


  console.log(selectedRentableVehicle)

  // Handle next image for a specific vehicle
  const handleNextImage = (index: number, otherImageUrls: string[]) => {
    setCurrentImageIndexes((prevIndexes) => {
      const newIndexes = [...prevIndexes];
      const vehicleCount = otherImageUrls.length;
      newIndexes[index] = (newIndexes[index] + 1) % (vehicleCount + 1); // Increment index and loop back
      return newIndexes;
    });
  };

  // Handle previous image for a specific vehicle
  const handlePrevImage = (index: number, otherImageUrls: string[]) => {
    setCurrentImageIndexes((prevIndexes) => {
      const newIndexes = [...prevIndexes];
      const vehicleCount = otherImageUrls.length;
      newIndexes[index] = (newIndexes[index] - 1 + (vehicleCount + 1)) % (vehicleCount + 1); // Decrement index and loop back
      return newIndexes;
    });
  };

  // Reset indexes when data changes
  React.useEffect(() => {
    if (data?.getVehicles) {
      setCurrentImageIndexes(new Array(data.getVehicles.length).fill(0)); // Initialize with 0 for each vehicle
    }
  }, [data]);

  if (loading) return <p>Loading vehicles...</p>;
  if (error) return <p>Error loading vehicles: {error.message}</p>;

  return (
    <div className={styles.mainDiv}>
      <h1 className={styles.title}>Vehicle List</h1>
      <div className={styles.cardContainer}>
        {data?.getVehicles.map((vehicle, index) => (
          <Card
            key={vehicle.id}
            hoverable
            className={styles.vehicleCard}
          >
            {/* Image Navigation */}
            <div className={styles.imageContainer}>
              <Button
                className={styles.scrollButton}
                onClick={() => handlePrevImage(index, vehicle.otherImageUrls || [])} // Scroll left
                icon={<LeftOutlined />}
                disabled={currentImageIndexes[index] === 0} // Disable if showing primary image
              />
              <Image
                src={
                  currentImageIndexes[index] === 0
                    ? vehicle.primaryImageUrl
                    : vehicle.otherImageUrls?.[currentImageIndexes[index] - 1] // Show other image if index is greater than 0
                }
                alt="Vehicle Image"
                className={styles.displayImage}
              />
              <Button
                className={styles.scrollButton}
                onClick={() => handleNextImage(index, vehicle.otherImageUrls || [])} // Scroll right
                icon={<RightOutlined />}
                disabled={vehicle.otherImageUrls?.length === 0} // Disable if no other images
              />
            </div>
            <Card.Meta title={vehicle.name} description={`Year: ${vehicle.year}`} />


            {/* Vehicle Info (Transmission, Fuel Type, Number of Seats) */}
            <div className={styles.vehicleInfo}>
              <div className={styles.detailItem}>
                <Tooltip title="Transmission">
                  <CarOutlined /> {vehicle.transmission}
                </Tooltip>
              </div>
              <div className={styles.detailItem}>
                <Tooltip title="Fuel Type">
                  <FireOutlined /> {vehicle.fuelType}
                </Tooltip>
              </div>
              <div className={styles.detailItem}>
                <Tooltip title="Number of Seats">
                  <TeamOutlined /> {vehicle.numberOfSeats}
                </Tooltip>
              </div>
            </div>


            <div className={styles.cardActions}>
              <Space style={{ marginTop: '16px' }} className={styles.cardActions}>
                <Tooltip title="Edit Vehicle">
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => router.push(`/admin/edit-vehicle?vehicle=${vehicle.id}`)}
                    shape="circle"
                    size="large"
                  />
                </Tooltip>
                <Tooltip title="Delete Vehicle">
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(vehicle.id)}
                    danger
                    shape="circle"
                    size="large"
                  />
                </Tooltip>
                <Tooltip title="Add to Rentable">
                  <Button
                    icon={<PlusCircleOutlined />}
                    onClick={() => handleAddRentable(vehicle)} // Open Rentable modal
                    shape="circle"
                    size="large"
                  />
                </Tooltip>
                <Tooltip title="More Details">
                  <Button
                    icon={<InfoCircleOutlined />}
                    onClick={() => showDetails(vehicle)} // Show details in modal
                    shape="circle"
                    size="large"
                  />
                </Tooltip>
              </Space>
            </div>
          </Card>
        ))}
      </div>

      {/* Vehicle Details Modal */}
      <Modal
        title={selectedVehicle?.name}
        open={!!selectedVehicle}
        onCancel={handleModalClose}
        footer={null}
      >
        <Image src={selectedVehicle?.primaryImageUrl} alt={selectedVehicle?.name} />
        <p>{selectedVehicle?.description}</p>
        <p>Quantity: {selectedVehicle?.quantity}</p>
        <p>Year: {selectedVehicle?.year}</p>
      </Modal>

      {/* Rentable Modal */}
      <Modal
        title={`Add ${selectedRentableVehicle?.name} to Rentable`}
        open={!!selectedRentableVehicle}
        onCancel={handleRentableModalClose}
        onOk={handleRentableSubmit}
      >
        <Select
          placeholder="Select available quantity"
          style={{ width: '100%' }}
          onChange={(value) => setAvailableQuantity(value)}
        >
          {Array.from({ length: parseInt(selectedRentableVehicle?.quantity || '0') }, (_, i) => (
            <Select.Option key={i + 1} value={i + 1}>
              {i + 1}
            </Select.Option>
          ))}
        </Select>
        <Input
          type="number"
          placeholder="Price per day"
          style={{ marginTop: '12px' }}
          value={pricePerDay || ''}
          onChange={(e) => setPricePerDay(parseFloat(e.target.value))}
        />
      </Modal>
    </div>
  );
};

export default VehicleListPage;
