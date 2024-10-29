// Import necessary modules
"use client";
import React, { useState } from "react";
import { useQuery, useMutation, gql, useLazyQuery } from "@apollo/client";
import {
  Card,
  Button,
  Image,
  Space,
  Modal,
  Tooltip,
  Input,
  Select,
  Empty,
} from "antd"; // Importing Ant Design components
import Swal from "sweetalert2"; // SweetAlert2 for popups
import styles from "./vehicle-list.module.css"; // Your CSS module
import { useRouter } from "next/navigation";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  RightOutlined,
  CarOutlined,
  TeamOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { ADD_VEHICLE_EXCEL } from "@/graphql/admin-mutations/vehicles";
import { FETCH_ALL_INVENTORIES } from "@/graphql/admin-mutations/admin-dashborad";

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
  isRented?: string;
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
      isRented
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
  mutation AddRentable(
    $vehicleId: ID!
    $pricePerDay: Float!
    $availableQuantity: Int!
    $inventoryId: ID!
  ) {
    addRentable(
      vehicleId: $vehicleId
      pricePerDay: $pricePerDay
      availableQuantity: $availableQuantity
      inventoryId: $inventoryId
    ) {
      status
      statusCode
      message
      data {
        id
        vehicleId
        pricePerDay
        availableQuantity
        inventoryId
      }
    }
  }
`;

const VehicleListPage: React.FC = () => {
  const [excelFile, setExcelFile] = useState<File | null>(null); // To store the uploaded file

  const [isProcessingExcel, setIsProcessingExcel] = useState(false); // To indicate processing state
  const [currentExcelRow, setCurrentExcelRow] = useState(0); // To track the current processing row
  const [totalExcelRows, setTotalExcelRows] = useState(0); // To store the total number of rows in the Excel file
  const [showUploadButton, setShowUploadButton] = useState(false); // To control the visibility of the upload button

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelFile(file);
    setShowUploadButton(true); // Show the button to add vehicles
  };

  const handleAddVehicles = async () => {
    if (!excelFile) return;

    try {
      setIsProcessingExcel(true);
      setCurrentExcelRow(0); // Reset row counter for progress tracking

      // Start processing the Excel file
      const response = await addVehicleExcel({
        variables: {
          excelFile: excelFile,
        },
      });


      // Check if response.data is defined and if the operation was successful
      if (response && response.data && response.data.addVehicleExcel.success) {
        const { processedVehiclesCount, message } =
          response.data.addVehicleExcel;

        setTotalExcelRows(processedVehiclesCount); // Ensure this is set if needed

        await Swal.fire({
          title: "Success",
          text: message, // Show the success message from backend
          icon: "success",
        });
      } else {
        // If there's an error message, show it
        const errorMessage =
          response.data.addVehicleExcel.message || "Unknown error occurred";
        await Swal.fire({
          title: "Error",
          text: errorMessage, // Show the error message from backend
          icon: "error",
        });
      }
    } catch (error: any) {
      const errorMessage = error.graphQLErrors?.[0]?.message || error.message;

      await Swal.fire({
        title: "Error",
        text: `Error uploading Excel file: ${errorMessage}`,
        icon: "error",
      });
    } finally {
      setIsProcessingExcel(false);
      setShowUploadButton(false); // Hide the upload button after processing
    }
  };

  // Define the new mutation for uploading the Excel file
  const [addVehicleExcel] = useMutation(ADD_VEHICLE_EXCEL, {
    onCompleted: (data) => {
      Swal.fire("Success!", "Excel file uploaded successfully.", "success");
    },
    onError: (error) => {
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
      });
    },
  });

  const router = useRouter(); // Initialize router
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null); // State to hold selected vehicle for modal
  const [currentImageIndexes, setCurrentImageIndexes] = useState<number[]>([]); // Index for showing current images for each vehicle
  const [filter, setFilter] = useState<"all" | "rented" | "unrented">("all"); // Filter state
  const { loading, error, data, refetch } =
    useQuery<GetVehiclesData>(GET_VEHICLES);
  const [deleteVehicle] = useMutation<DeleteVehicleData>(DELETE_VEHICLE, {
    onCompleted: () => {
      refetch(); // Refetch vehicles after deletion
    },
    onError: (err) => {
      Swal.fire("Error!", err.message, "error"); // Display error message
    },
  });

  const [addRentable] = useMutation<AddRentableData>(ADD_RENTABLE, {
    onCompleted: () => {
      Swal.fire("Success!", "Vehicle added to rentable list.", "success");
      setSelectedRentableVehicle(null); // Close rentable modal
      refetch();
    },
    onError: (err) => {
      Swal.fire("Error!", err.message, "error"); // Display error message
    },
  });

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

  // State for managing rentable modal
  const [selectedRentableVehicle, setSelectedRentableVehicle] =
    useState<Vehicle | null>(null);
  const [pricePerDay, setPricePerDay] = useState<number | null>(null);
  const [availableQuantity, setAvailableQuantity] = useState<number | null>(
    null
  );
  const [inventoryId, setInventoryId] = useState<string | null>(null);
  const { data: inventoriesData, loading: loadingInventories } = useQuery(
    FETCH_ALL_INVENTORIES
  );

  const handleRentableSubmit = () => {
    if (
      pricePerDay !== null &&
      availableQuantity !== null &&
      inventoryId && // Check that inventoryId is provided
      selectedRentableVehicle
    ) {
      addRentable({
        variables: {
          vehicleId: selectedRentableVehicle.id,
          pricePerDay,
          availableQuantity,
          inventoryId: inventoryId, // Pass inventoryId instead of location
        },
      })
        .then((response) => {
          if (response.data && response.data.addRentable) {
            const rentableData = response.data.addRentable;
          } else {
            Swal.fire("Error!", "Rentable data is undefined.", "error");
          }
        })
        .catch((err) => {
          Swal.fire("Error!", err.message, "error");
        });
    } else {
      Swal.fire(
        "Error!",
        "Please provide price per day, available quantity, and inventory location.",
        "error"
      );
    }
  };


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
      newIndexes[index] =
        (newIndexes[index] - 1 + (vehicleCount + 1)) % (vehicleCount + 1); // Decrement index and loop back
      return newIndexes;
    });
  };

  // Reset indexes when data changes
  React.useEffect(() => {
    if (data?.getVehicles) {
      setCurrentImageIndexes(new Array(data.getVehicles.length).fill(0)); // Initialize with 0 for each vehicle
    }
  }, [data]);

  // Filter the vehicles based on selected filter
  const filteredVehicles = data?.getVehicles.filter((vehicle) => {
    if (filter === "rented") return !!vehicle.isRented; // Show rented vehicles
    if (filter === "unrented") return !vehicle.isRented; // Show unrented vehicles
    return true; // Show all vehicles
  });

  if (loading) return <p>Loading vehicles...</p>;
  if (error) return <p>Error loading vehicles: {error.message}</p>;

  const handleAddVehicleClick = () => {
    window.location.href = "/admin/add-vehicle"; // Navigate to the add-vehicle page
  };

  return (
    <div className={styles.mainDiv}>
      <h1 className={styles.title}>VEHICLE LIST</h1>

      {/* Filter Buttons */}
      <div className={styles.buttonsDiv} style={{ textAlign: "center" }}>
        <div className={styles.andButtons}>
          <Button
            onClick={() => setFilter("all")}
            type={filter === "all" ? "primary" : "default"}
          >
            All Vehicles
          </Button>
          <Button
            onClick={() => setFilter("rented")}
            type={filter === "rented" ? "primary" : "default"}
            style={{ marginLeft: "10px" }}
          >
            Rented Vehicles
          </Button>
          <Button
            onClick={() => setFilter("unrented")}
            type={filter === "unrented" ? "primary" : "default"}
            style={{ marginLeft: "10px" }}
          >
            Unrented Vehicles
          </Button>
        </div>

        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Tooltip title="Add vehicles using the uploaded Excel file">
            <div className={styles.excelUploadSection}>
              <div className={styles.excelUploadContainer}>
                {/* Show upload and add icon only if not processing */}
                {!isProcessingExcel ? (
                  <div className={styles.flex}>
                    <label
                      className={styles.customFileUpload}
                      htmlFor="excelUpload"
                    >
                      <div className={styles.iconWithText}>
                        <img
                          className={styles.icon}
                          src="/microsoft-excel.svg"
                          alt="Excel Icon"
                        />
                        <span className={styles.text}>
                          {excelFile ? excelFile.name : "Upload Excel File"}
                        </span>
                      </div>
                    </label>

                    <input
                      type="file"
                      id="excelUpload"
                      accept=".xlsx,.xls"
                      onChange={handleExcelUpload}
                      style={{ display: "none" }}
                    />

                    {/* Show "+" icon to add vehicles if a file is selected */}
                    {excelFile && (
                      <PlusOutlined
                        onClick={handleAddVehicles}
                        className={styles.addIcon} // Custom class for styling
                      />
                    )}
                  </div>
                ) : (
                  // Show progress bar while processing
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${(currentExcelRow / totalExcelRows) * 100}%`,
                      }}
                    />
                    <span>
                      Processing: {currentExcelRow} / {totalExcelRows}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Tooltip>

          <Tooltip title="add Vehicle Manualy">
            <div className={styles.addVehicleDiv} style={{ fontSize: "12px" }}>
              <button onClick={handleAddVehicleClick}>
                Add vehicle
                <PlusOutlined title="Add vehicle" className={styles.addIcon} />
              </button>
            </div>
          </Tooltip>
        </div>
      </div>

      {filteredVehicles?.length === 0 ? (
        <div className={styles.customEmptyContainer}>
          <Empty
            image={Empty.PRESENTED_IMAGE_DEFAULT}
            description="No vehicles available"
            className={styles.animatedEmpty} // Add class to apply animation
          />
        </div>
      ) : (
        <div className={styles.cardContainer}>
          {filteredVehicles?.map((vehicle, index) => (
            <Card key={vehicle.id} hoverable className={styles.vehicleCard}>
              {/* Image Navigation */}
              <div className={styles.imageContainer}>
                <Button
                  className={styles.scrollButton}
                  onClick={() =>
                    handlePrevImage(index, vehicle.otherImageUrls || [])
                  } // Scroll left
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
                  onClick={() =>
                    handleNextImage(index, vehicle.otherImageUrls || [])
                  } // Scroll right
                  icon={<RightOutlined />}
                  disabled={vehicle.otherImageUrls?.length === 0} // Disable if no other images
                />
              </div>
              <Card.Meta
                title={vehicle.name}
                description={`Year: ${vehicle.year}| Rented: ${vehicle.isRented ? "Yes" : "No"}`}
              />

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
                <Space
                  style={{ marginTop: "16px" }}
                  className={styles.cardActions}
                >
                  <Tooltip title="Edit Vehicle">
                    <Button
                      icon={<EditOutlined />}
                      onClick={() =>
                        router.push(`/admin/edit-vehicle?vehicle=${vehicle.id}`)
                      }
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
                  <Tooltip
                    title={vehicle.isRented ? "Rented" : "Add to Rentable"}
                  >
                    <Button
                      icon={<PlusCircleOutlined />}
                      onClick={() => handleAddRentable(vehicle)}
                      shape="circle"
                      size="large"
                      style={{
                        backgroundColor: vehicle.isRented
                          ? "#52c42b"
                          : undefined,
                        color: vehicle.isRented ? "white" : "#52c42b",
                        borderColor: vehicle.isRented ? "#52c42b" : "#52c42b",
                      }} // Green color for rented vehicles
                      disabled={vehicle.isRented ? true : false} // Disable button if rented
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
      )}

      {/* Vehicle Details Modal */}
      <Modal
        title={selectedVehicle?.name}
        open={!!selectedVehicle}
        onCancel={handleModalClose}
        footer={null}
      >
        <Image
          src={selectedVehicle?.primaryImageUrl}
          alt={selectedVehicle?.name}
        />
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
          style={{ width: "100%" }}
          onChange={(value) => setAvailableQuantity(value)}
        >
          {Array.from(
            { length: parseInt(selectedRentableVehicle?.quantity || "0") },
            (_, i) => (
              <Select.Option key={i + 1} value={i + 1}>
                {i + 1}
              </Select.Option>
            )
          )}
        </Select>

        <Input
          type="number"
          placeholder="Price per day"
          style={{ marginTop: "12px" }}
          value={pricePerDay || ""}
          onChange={(e) => setPricePerDay(parseFloat(e.target.value))}
        />

        <Select
          placeholder="Select Inventory Location"
          style={{ marginTop: "12px", width: "100%" }}
          onChange={(value) => setInventoryId(value)} // Set inventoryId on change
        >
          {loadingInventories ? (
            <Select.Option value="" disabled>
              Loading...
            </Select.Option>
          ) : (
            inventoriesData?.fetchAllInventories.data.map((inventory: any) => (
              <Select.Option key={inventory.id} value={inventory.id}>
                {inventory.location} {/* Display inventory location */}
              </Select.Option>
            ))
          )}
        </Select>
      </Modal>
    </div>
  );
};

export default VehicleListPage;
