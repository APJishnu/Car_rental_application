"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_MANUFACTURERS } from "@/graphql/admin-queries/manufacture";
import { ADD_VEHICLE } from "@/graphql/admin-mutations/vehicles";
import Input from "@/themes/InputField/InputField"; // Update with the correct path
import Button from "@/themes/Button/Button"; // Update with the correct path
import styles from "./AddVehicles.module.css"; // Optional: add your CSS module
import { Manufacturer, FormData, GetManufacturersResponse } from "@/interfaces/admin-interfaces/types"; // Adjust path if necessary
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";

const AddVehicles = () => {
    const { loading: loadingManufacturers, error: errorManufacturers, data: manufacturersData } = useQuery<GetManufacturersResponse>(GET_MANUFACTURERS);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        transmission: '', // Added transmission to formData
        numberOfSeats: '',
        fuelType: '',
        primaryImage: null,
        otherImages: [],
        quantity: '',
        manufacturerId: '',
        year: '',
    });

    const [addVehicle] = useMutation(ADD_VEHICLE, {
        onCompleted: (data) => {
            console.log("Vehicle added:", data);
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
            console.error("Error adding vehicle:", error);
            Swal.fire({
                title: "Error!",
                text: error.message, // Display specific error message from the backend
                icon: "error",
            });
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    const handleOtherImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { files } = e.target;
        if (files) {
            const updatedOtherImages = [...formData.otherImages];
            updatedOtherImages[index] = {
                id: updatedOtherImages[index].id,
                file: files[0],
                name: files[0].name,
                preview: URL.createObjectURL(files[0]), // Create preview URL
            };
            setFormData((prevData) => ({
                ...prevData,
                otherImages: updatedOtherImages,
            }));
        }
    };

    const handleAddOtherImage = () => {
        if (formData.otherImages.length < 3) {
            setFormData((prevData) => ({
                ...prevData,
                otherImages: [
                    ...prevData.otherImages,
                    { id: uuidv4(), file: null, name: null, preview: null }, // Add preview field
                ],
            }));
        } else {
            Swal.fire({
                title: "Limit Reached",
                text: "You can only add up to 3 images.",
                icon: "warning",
                confirmButtonText: "OK",
            });
        }
    };

    const handleRemoveImage = (id: string) => {
        setFormData((prevData) => ({
            ...prevData,
            otherImages: prevData.otherImages.filter(image => image.id !== id),
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

        if (formData.otherImages.filter((image) => image.file !== null).length === 0) {
            Swal.fire({
                title: "No Other Image",
                text: "Please add at least one other image.",
                icon: "warning",
                confirmButtonText: "OK",
            });
            return;
        }

        const { primaryImage, otherImages, ...vehicleInput } = formData;
        console.log("formDaaaaata", formData);

        console.log("vgfjsdvfva", primaryImage.file)


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
                    primaryImage: primaryImage.file,  // single file for the primary image
                    otherImages: otherImages.map(img => img.file).filter(file => file !== null),  // array of additional image files
                },
            });
            console.log(response);
            console.log("formDaaaaata", formData);
        } finally {
            setLoading(false); // Reset loading state
        }
        console.log("Submitting vehicle data:", {
            name: vehicleInput.name,
            description: vehicleInput.description,
            transmission: vehicleInput.transmission,
            fuelType: vehicleInput.fuelType,
            numberOfSeats: vehicleInput.numberOfSeats,
            quantity: vehicleInput.quantity,
            manufacturerId: vehicleInput.manufacturerId,
            year: vehicleInput.year,
            primaryImage: primaryImage?.file,
            otherImages: otherImages.map(img => img.file).filter(file => file !== null),
        });
    };

    if (loadingManufacturers) return <p>Loading manufacturers...</p>;
    if (errorManufacturers) return <p>Error fetching manufacturers: {errorManufacturers.message}</p>;

    const manufacturers = manufacturersData?.getManufacturers || [];

    return (
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
                    <input type="radio" name="transmission" value="Automatic" onChange={handleChange} /> Automatic
                </label>
                <label>
                    <input type="radio" name="transmission" value="Manual" onChange={handleChange} /> Manual
                </label>
            </div>

            <div className={styles.selectDiv}>
                {/* Number of Seats */}
                <div className={styles.selectDiv}>
                    <select name="numberOfSeats" value={formData.numberOfSeats} onChange={handleChange} required>
                        <option value="" disabled>Select Number of Seats</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="7">7</option>
                        <option value="7">8</option>
                    </select>
                </div>


                <div className={styles.selectDiv}>
                    <select name="fuelType" value={formData.fuelType} onChange={handleChange} required>
                        <option value="" disabled>Select the vehicle fuel type</option>
                        <option value="Petrol">petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>

                    </select>
                </div>
            </div>

            {/* Custom file input for primary image */}
            <label className={styles.custumFileUpload} htmlFor="primaryImage">
                <div className={styles.iconWithText}>
                    <div className={styles.icon}>
                        {formData.primaryImage && formData.primaryImage.preview ? (
                            <img src={formData.primaryImage.preview} alt="Primary Preview" className={styles.imagePreview} />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24"><g id="SVGRepo_bgCarrier"></g><g id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path fill="" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" ></path> </g></svg>

                        )}
                    </div>
                    <span className={styles.text}>
                        {formData.primaryImage ? formData.primaryImage.name : "Upload Primary Image"}
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

            {/* Map through other images */}
            <div className={styles.imageGrid}>
                {formData.otherImages.map((image, index) => (
                    <div key={image.id} className={styles.otherImageContainer}>
                        <label className={styles.custumFileUpload} htmlFor={`otherImage${index}`}>
                            <div className={styles.iconWithText}>
                                <div className={styles.iconOther}>
                                    {image.preview ? (
                                        <img src={image.preview} alt={`Other Image Preview ${index}`} className={styles.icon} />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24"><g id="SVGRepo_bgCarrier"></g><g id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path fill="" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" ></path> </g></svg>
                                    )}

                                </div>
                                <span className={styles.textOther}>
                                    {image.file ? image.name : "Upload Other Image"}
                                </span>
                                <button type="button" className={styles.removeButton} onClick={() => handleRemoveImage(image.id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={styles.crossIcon}>
                                        <path d="M19 6L6 19M6 6l13 13" stroke="red" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>

                        </label>
                        <input
                            type="file"
                            id={`otherImage${index}`}
                            accept="image/*"
                            onChange={(e) => handleOtherImageChange(e, index)}
                            style={{ display: "none" }}
                            multiple // Allow multiple image selection
                        />
                    </div>
                ))}
            </div>

            <Button className={styles.addImageButton} onClick={handleAddOtherImage}>Add Another Image</Button>
            <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
            </Button>
        </form>
    );
};

export default AddVehicles;
