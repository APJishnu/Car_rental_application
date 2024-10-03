"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import CarCard from '../CarCardsSection/CarCards';
import styles from './CarCollection.module.css';
import { useRouter } from 'next/navigation'; // For navigation in Next.js
import { Tooltip, Rate, Input, message } from "antd";
import Button from "@/themes/Button/Button"; // Update with the correct path
import { SearchOutlined } from '@ant-design/icons';
import Typesense from 'typesense'; // Typesense client for searching

// GraphQL Query to get rentable vehicles
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

// GraphQL Mutation to add a vehicle to Typesense
const ADD_VEHICLE_TO_TYPESENSE = gql`
  mutation AddVehicleToTypesense($vehicle: VehicleInput!) {
    addVehicleToTypesense(vehicle: $vehicle)
  }
`;

const CarCollection: React.FC = () => {
  const router = useRouter();
  const { loading, error, data } = useQuery(GET_RENTABLE_VEHICLES); // Use Apollo Client to fetch data
  const [searchResults, setIsSearchResults] = useState<any[]>([]);
  const [query, setQuery] = useState(''); // For the search query
  const [isSearching, setIsSearching] = useState(false);

  // Set up the mutation for adding a vehicle to Typesense
  const [addVehicleToTypesense] = useMutation(ADD_VEHICLE_TO_TYPESENSE);

  // Function to handle the search using Typesense
  const handleSearch = async () => {
    if (!query.trim()) return; // Do nothing if search query is empty

    setIsSearching(true);

    const typesense = new Typesense.Client({
      nodes: [
        {
          host: 'e4usi1rjl26dtbacp-1.a1.typesense.net', // Replace with your Typesense host
          port: 443,
          protocol: 'https',
        },
      ],
      apiKey: 'tiRPshalhWslNmaZA3WZVQgw2VJbxWiX', // Replace with your Typesense API key
      connectionTimeoutSeconds: 2,
    });

    try {
      const searchResults = await typesense.collections('cars').documents().search({
        q: query, // The user's search query
        query_by: 'vehicle.name,vehicle.manufacturer.name,vehicle.transmission,vehicle.fuelType', // Adjusted query_by fields to match the document structure
        filter_by: 'pricePerDay:=[1..1000]', // You can filter by pricePerDay using a range
        sort_by: 'pricePerDay:asc', // Optionally, sort results by price (ascending or descending)
      });
    
      setIsSearchResults(searchResults?.hits?.map((hit: any) => hit.document) || []);
    } catch (error) {
      message.error('Search failed. Please try again.');
      console.error('Typesense search error:', error);
    } finally {
      setIsSearching(false);
    }
    
  };

  const handleRentNow = (carId: string) => {
    router.push(`/user/car-booking?carId=${carId}`); // Navigates to dynamic car booking page
  };

  // Inside the useEffect where you're iterating over vehicles
  // useEffect(() => {
  //   if (data && data.getRentableVehicles) {
  //     const vehicles = data.getRentableVehicles;
  //     console.log(data.getRentableVehicles)

  //     vehicles.forEach(async (vehicle: any) => {
  //       // Automatically call the mutation to add each vehicle to Typesense
  //       const document = {
  //         id: vehicle.id,
  //         name: vehicle.vehicle.name,
  //         pricePerDay: vehicle.pricePerDay,
  //         transmission: vehicle.vehicle.transmission,
  //         fuelType: vehicle.vehicle.fuelType,
  //         primaryImageUrl:vehicle.vehicle.primaryImageUrl,
  //         manufacturer: vehicle.vehicle.manufacturer.name,
  //         numberOfSeats: vehicle.vehicle.numberOfSeats || null, // Optional field
  //         quantity: vehicle.availableQuantity.toString() || null,         // Optional field
  //         manufacturerId: vehicle.vehicle.manufacturer.id || null, // Optional field
  //         year: vehicle.vehicle.year || null,       
  //       };

  //       try {
  //         await addVehicleToTypesense({ variables: { vehicle: document } }); // Call the mutation
  //         console.log('Vehicle added to Typesense successfully!');
  //       } catch (error) {
  //         console.error('Error adding vehicle to Typesense:', error);
  //         message.error('Failed to add vehicle to Typesense.');
  //       }
  //     });
  //   }
  // }, [data, addVehicleToTypesense]);



  if (loading) return <p>Loading...</p>; 
  if (error) return <p>Error: {error.message}</p>; 

  // Cars to display, either search results or all data if no search performed
  const carsToDisplay = searchResults.length > 0 ? searchResults : data.getRentableVehicles;
  console.log("search result",searchResults)
  console.log("gai", carsToDisplay)

  return (
    <div className={styles.carCollection}>
      <div className={styles.carCollectionSecondDiv}>
        <h2>Our Impressive Collection of Cars</h2>
        <p className={styles.subheading}>Ranging from elegant sedans to powerful sports cars...</p>

        {/* Search Section */}
        <div className={styles.searchSection}>
          <Input
          className={styles.inputField}
            placeholder="Search by car model, manufacturer, or features..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onPressEnter={handleSearch} // Trigger search on Enter key
            prefix={<SearchOutlined />}
            style={{ width: '300px', marginRight: '10px' }}
          />
          <Button type="submit" onClick={handleSearch} loading={isSearching}>
            Search
          </Button>
        </div>

        <div className={styles.filters}>
          <button className={styles.filterButton}>Popular Car</button>
          <button className={styles.filterButton}>Luxury Car</button>
          <button className={styles.filterButton}>Vintage Car</button>
          <button className={styles.filterButton}>Family Car</button>
          <button className={styles.filterButton}>Off-Road Car</button>
        </div>

        <div className={styles.carsGrid}>
          {carsToDisplay.map((car: any) => (
            <CarCard
              key={car.id}
              image={car.vehicle.primaryImageUrl} // Use the image URL from the vehicle data
              model={car.vehicle.name} // Use the vehicle name
              price={car.pricePerDay} // Use the price per day
              features={{
                passengers: car.vehicle.numberOfSeats || '', // Map available quantity to passengers
                transmission: car.vehicle.transmission,
                fuelType: car.vehicle.fuelType, // Placeholder for fuel type
              }}
              onRentNow={() => handleRentNow(car.id)} // Passing the vehicle's ID
            />
          ))}
        </div>

        <div className={styles.viewMore}>
          <button className={styles.viewMoreButton}>See all Cars &rarr;</button>
        </div>
      </div>
    </div>
  );
};

export default CarCollection;
