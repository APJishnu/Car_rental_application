"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_MANUFACTURERS } from "@/graphql/admin-queries/manufacture";
import { ADD_VEHICLE } from "@/graphql/admin-mutations/vehicles";
import Input from "@/themes/InputField/InputField"; // Update with the correct path
import Button from "@/themes/Button/Button"; // Update with the correct path
import styles from "./AddVehicles.module.css"; // Optional: add your CSS module
import {
  Manufacturer,
  FormData,
  GetManufacturersResponse,
} from "@/interfaces/admin-interfaces/types"; // Adjust path if necessary
import Swal from "sweetalert2";




const AddVehicles = () => {
  const {
    loading: loadingManufacturers,
    error: errorManufacturers,
    data: manufacturersData,
  } = useQuery<GetManufacturersResponse>(GET_MANUFACTURERS);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    transmission: "", // Added transmission to formData
    numberOfSeats: "",
    fuelType: "",
    primaryImage: null,
    otherImages: [],
    quantity: "",
    manufacturerId: "",
    year: "",
  });



  
  const [addVehicle] = useMutation(ADD_VEHICLE, {
    onCompleted: (data) => {
      setFormData({
        name: "",
        description: "",
        transmission: "",
        numberOfSeats: "",
        fuelType: "",
        primaryImage: null,
        otherImages: [],
        quantity: "",
        manufacturerId: "",
        year: "",
      });
      Swal.fire("Success!", "Vehicle added successfully.", "success");
    },
    onError: (error) => {
      Swal.fire({
        title: "Error!",
        text: error.message, // Display specific error message from the backend
        icon: "error",
      });
    },
  });

 
// Updated input section remains the same


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePrimaryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        primaryImage: {
          id: Date.now().toString(),
          file: files[0],
          name: files[0].name,
          preview: URL.createObjectURL(files[0]), // Create preview URL
        },
      }));
    }
  };

  const handleOtherImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      const fileArray = Array.from(files);
      if (fileArray.length > 3) {
        Swal.fire({
          title: "Limit Exceeded",
          text: "You can only upload up to 3 images",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }

      const newImages = fileArray.map((file) => ({
        id: Date.now().toString() + Math.random(),
        file: file,
        name: file.name,
        preview: URL.createObjectURL(file),
      }));

      setFormData((prevData) => ({
        ...prevData,
        otherImages: newImages,
      }));
    }
  };



  const handleRemoveOtherImage = (id: string) => {
    setFormData((prevData) => ({
      ...prevData,
      otherImages: prevData.otherImages.filter((image) => image.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Validate primary image
    if (!formData.primaryImage) {
      Swal.fire({
        title: "Primary Image Required",
        text: "Please upload a primary image.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (
      formData.otherImages.filter((image) => image.file !== null).length === 0
    ) {
      Swal.fire({
        title: "No Other Image",
        text: "Please add at least one other image.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const { primaryImage, otherImages, ...vehicleInput } = formData;


    try {
      const response = await addVehicle({
        variables: {
          name: vehicleInput.name,
          description: vehicleInput.description,
          transmission: vehicleInput.transmission,
          fuelType: vehicleInput.fuelType,
          numberOfSeats: vehicleInput.numberOfSeats,
          quantity: vehicleInput.quantity,
          manufacturerId: vehicleInput.manufacturerId,
          year: vehicleInput.year,
          primaryImage: primaryImage.file, // single file for the primary image
          otherImages: otherImages
            .map((img) => img.file)
            .filter((file) => file !== null), // array of additional image files
        },
      });
    } finally {
      setLoading(false); // Reset loading state
    }
    
  };


  if (loadingManufacturers) return <p>Loading manufacturers...</p>;
  if (errorManufacturers)
    return <p>Error fetching manufacturers: {errorManufacturers.message}</p>;

  const manufacturers = manufacturersData?.getManufacturers || [];


  return (

    <> 
  

    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.selectDiv}>
        <select
          name="manufacturerId"
          id="manufacturerId"
          value={formData.manufacturerId}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select Manufacturer
          </option>
          {manufacturers.length > 0 ? (
            manufacturers.map((manufacturer: Manufacturer) => (
              <option key={manufacturer.id} value={manufacturer.id}>
                {manufacturer.name}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No manufacturers available
            </option>
          )}
        </select>

        <select
          name="year"
          id="vehicleYear"
          value={formData.year}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select Year
          </option>
          {Array.from({ length: 30 }, (_, index) => {
            const year = new Date().getFullYear() - index;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

      <Input
        type="text"
        name="name"
        id="vehicleName"
        value={formData.name}
        onChange={handleChange}
        placeholder="Vehicle Name"
        required
      />
      <Input
        type="text"
        name="description"
        id="vehicleDescription"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />
      <Input
        type="number"
        name="quantity"
        id="vehicleQuantity"
        value={formData.quantity}
        onChange={handleChange}
        placeholder="Available Quantity"
        required
      />

      <div className={styles.radioGroup}>
        <label>Transmission:</label>
        <label>
          <input
            type="radio"
            name="transmission"
            value="Automatic"
            onChange={handleChange}
          />{" "}
          Automatic
        </label>
        <label>
          <input
            type="radio"
            name="transmission"
            value="Manual"
            onChange={handleChange}
          />{" "}
          Manual
        </label>
      </div>

      <div className={styles.selectDiv}>
        {/* Number of Seats */}
        <div className={styles.selectDiv}>
          <select
            name="numberOfSeats"
            value={formData.numberOfSeats}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Number of Seats
            </option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="7">7</option>
            <option value="7">8</option>
          </select>
        </div>

        <div className={styles.selectDiv}>
          <select
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select the vehicle fuel type
            </option>
            <option value="Petrol">petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
          </select>
        </div>
      </div>

 {/* Primary Image Upload */}
 <label className={styles.custumFileUpload} htmlFor="primaryImage">
        <div className={styles.iconWithText}>
          <div className={styles.icon}>
            {formData.primaryImage && formData.primaryImage.preview ? (
              <img
                src={formData.primaryImage.preview}
                alt="Primary Preview"
                className={styles.imagePreview}
              />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24">
                {/* SVG path remains the same */}
              </svg>
            )}
          </div>
          <span className={styles.text}>
            {formData.primaryImage
              ? formData.primaryImage.name
              : "Upload Primary Image"}
          </span>
        </div>
      </label>
      <input
        type="file"
        id="primaryImage"
        accept="image/*"
        onChange={handlePrimaryImageChange}
        style={{ display: "none" }}
      />

      {/* Other Images Upload */}
      <label className={styles.custumFileUpload} htmlFor="otherImages">
        <div className={styles.iconWithText}>
          <div className={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24">
              {/* SVG path remains the same */}
            </svg>
          </div>
          <span className={styles.text}>
            Upload Other Images (Max 3)
          </span>
        </div>
      </label>
      <input
        type="file"
        id="otherImages"
        accept="image/*"
        onChange={handleOtherImagesChange}
        multiple
        style={{ display: "none" }}
      />

      {/* Other Images Preview */}
      {formData.otherImages.length > 0 && (
        <div className={styles.imageGrid}>
          {formData.otherImages.map((image) => (
            <div key={image.id} className={styles.otherImageContainer}>
              <div className={styles.imagePreviewContainer}>
                <img
                  src={image.preview}
                  alt={`Preview ${image.name}`}
                  className={styles.imagePreview}
                />
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemoveOtherImage(image.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className={styles.crossIcon}
                  >
                    <path
                      d="M19 6L6 19M6 6l13 13"
                      stroke="red"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
              <span className={styles.imageName}>{image.name}</span>
            </div>
          ))}
        </div>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </form>

    </>
  );
};


export default AddVehicles;
