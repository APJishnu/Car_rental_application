// src/components/CarBooking/hooks/useCarBooking.ts
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_RENTABLE_VEHICLE_BY_ID,
  FETCH_REVIEWS,
} from "../../../graphql/user/car-booking";
import {
  RentableVehicle,
  Review,
} from "../../../interfaces/user-interfaces/types";

export const useCarBooking = (carId: string) => {
  const [car, setCar] = useState<RentableVehicle | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [gstPerDay, setGstPerDay] = useState(0);

  const {
    loading: carLoading,
    error: carError,
    data: carData,
  } = useQuery(GET_RENTABLE_VEHICLE_BY_ID, {
    variables: { id: carId },
    skip: !carId,
  });

  const {
    loading: reviewsLoading,
    error: reviewsError,
    data: reviewsData,
  } = useQuery(FETCH_REVIEWS, {
    variables: { vehicleId: car?.vehicleId },
    skip: !car?.vehicleId,
  });

  useEffect(() => {
    if (carData) {
      setCar(carData.rentableVehicleWithId);
    }
  }, [carData]);

  useEffect(() => {
    if (reviewsData) {
      const formattedReviews = reviewsData.fetchReviews.map((review: any) => ({
        ...review,
        user: {
          ...review.user,
          fullName: `${review.user.firstName} ${review.user.lastName}`,
        },
      }));
      setReviews(formattedReviews);
    }
  }, [reviewsData]);

  return {
    car,
    reviews,
    carLoading,
    carError,
    reviewsLoading,
    reviewsError,
    currentImageIndex,
    setCurrentImageIndex,
    totalPrice,
    setTotalPrice,
    numberOfDays,
    setNumberOfDays,
    gstPerDay,
    setGstPerDay,
  };
};
