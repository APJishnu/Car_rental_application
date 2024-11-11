"use client";

import { useQuery, gql } from "@apollo/client";
import CarCard from "../CarCardsSection/CarCards";
import styles from "./CarCollection.module.css";
import { useRouter } from "next/navigation";

// GraphQL Query to get rentable vehicles
const GET_RENTABLE_VEHICLES = gql`
  query GetRentableVehicles {
    getRentableVehiclesUser {
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
  }
`;

interface CarCollectionProps {
  onViewMore: () => void; // Function to handle scrolling
}

const CarCollection: React.FC<CarCollectionProps> = ({ onViewMore }) => {
  const router = useRouter();
  const { loading, error, data } = useQuery(GET_RENTABLE_VEHICLES); // Use Apollo Client to fetch data

  const handleRentNow = (carId: string) => {
    router.push(`/user/car-booking?carId=${carId}`); // Navigates to dynamic car booking page
  };

  if (loading) return <p>Loading...</p>; // Loading state
  if (error) return <p>Error: {error.message}</p>; // Error handling

  // Cars to display, either search results or all data if no search performed
  const carsToDisplay = data.getRentableVehiclesUser.data;

  return (
    <div className={styles.carCollection}>
      <div className={styles.carCollectionSecondDiv}>
        <h2>Our Impressive Collection of Cars</h2>
        <p className={styles.subheading}>
          Ranging from elegant sedans to powerful sports cars...
        </p>

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
              image={car.vehicle.primaryImageUrl}
              model={car.vehicle.name}
              price={car.pricePerDay}
              totalPrice={0}
              features={{
                passengers: car.vehicle.numberOfSeats || "",
                transmission: car.vehicle.transmission,
                fuelType: car.vehicle.fuelType,
              }}
              onRentNow={() => handleRentNow(car.id)}
            />
          ))}
        </div>

        <div className={styles.viewMore}>
          <button className={styles.viewMoreButton} onClick={onViewMore}>
            Rent a Cars &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCollection;
