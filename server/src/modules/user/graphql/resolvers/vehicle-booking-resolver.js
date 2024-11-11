import { verifyToken } from "../../../../utils/jwt-helper.js";
import VehicleBookingHelper from "../../helpers/vehicle-booking-helper.js";
import User from "../../models/auth-model.js";
import Booking from "../../models/booking-model.js";
import Review from "../../models/review-model.js";


const VehicleBookingResolver = {
  Query: {
    getAvailableVehicles: async (
      _,
      {
        pickupDate,
        dropoffDate,
        inventoryId,      // New parameter
        query,
        transmission,
        fuelType,
        seats,
        priceSort,
        priceRange,
      }
    ) => {

      // Ensure arrays are only passed if they contain values
      const transmissionArray =
        Array.isArray(transmission) && transmission.length > 0
          ? transmission
          : undefined;
      const fuelTypeArray =
        Array.isArray(fuelType) && fuelType.length > 0 ? fuelType : undefined;
      const seatsArray =
        Array.isArray(seats) && seats.length > 0 ? seats : undefined;
    
      // Ensure priceRange is defined and has exactly two elements
      const priceRangeArray =
        Array.isArray(priceRange) && priceRange.length === 2
          ? priceRange
          : undefined;
    
      // Pass all parameters, including the optional pickupLocation
      return await VehicleBookingHelper.getAvailableVehicles(
        pickupDate,
        dropoffDate,
        inventoryId,     // New argument passed to the helper function
        query,
        transmissionArray,
        fuelTypeArray,
        seatsArray,
        priceSort,
        priceRangeArray
      );
    },

    fetchBookings: async (_, __, { token }) => {
      try {
        if (!token) {
          return {
            status: false,
            statusCode: 401,
            message: "Authorization token is missing.",
            data: [],
          };
        }

        // Verify and decode the JWT token to get user details
        const decodedToken = verifyToken(token.replace("Bearer ", ""));
        const userId = decodedToken.id;

        // Use helper to get bookings for the user
        return await VehicleBookingHelper.getBookingsByUser(userId);
      } catch (error) {
        return {
          status: false,
          statusCode: 500,
          message: "Failed to fetch bookings.",
          data: [],
        };
      }
    },

    fetchReviews: async (_, { vehicleId }) => {
      try {
        const reviews = await Review.findAll({
          where: { vehicleId }, // Filter by vehicleId
          include: [
            {
              model: Booking,
              as: "booking", // Include Booking details
            },
            {
              model: User,
              as: "user", // Include User details to fetch firstName, lastName, email, and profilePicture
              attributes: [
                "id",
                "firstName",
                "lastName",
                "email",
                "profileImage",
              ], // Select necessary fields
            },
          ],
        });


        return reviews;
      } catch (error) {
        return {
          status: "error",
          message: error.message,
          id: null,
        };
      }
    },
  },

  Mutation: {
    // Mutation for creating a Razorpay payment order along with booking details
    createPaymentOrder: async (_, { totalPrice, bookingInput }, { token }) => {
      try {
        if (!token) {
          return {
            status: false,
            message:
              "Oops! You need to log in to book your ride. Let's get you logged in so you can complete your booking!",
            statusCode: 401, // Unauthorized
            data: null,
          };
        }

        // Verify and decode the JWT token to get user details
        const decodedToken = verifyToken(token.replace("Bearer ", ""));
        const user = await User.findByPk(decodedToken.id);

        if (!user) {
          return {
            status: false,
            message: "User not found. Please login first.",
            statusCode: 404, // Not Found
            data: null,
          };
        }
        // Create Razorpay order using the total price and booking details
        const paymentResponse = await VehicleBookingHelper.createPaymentOrder(
          totalPrice,
          user.id,
          bookingInput
        );

        return paymentResponse;
      } catch (error) {
        return {
          status: false,
          message: "Failed to create payment order.",
          statusCode: 500, // Internal Server Error
          data: {
            error: error.message || "An unknown error occurred.",
          },
        };
      }
    },

    // Mutation for verifying the payment and creating the booking
    verifyPaymentAndCreateBooking: async (
      _,
      { paymentDetails, bookingInput },
      { token }
    ) => {
     
      try {
        if (!token) {
          return {
            status: "error",
            message: "Authorization token is missing.",
          };
        }

        // Verify and decode the JWT token to get user details
        const decodedToken = verifyToken(token.replace("Bearer ", ""));
        const userId = decodedToken.id;

        // Add userId to the booking input for the booking creation process
        bookingInput.userId = userId;

        // Verify the payment with Razorpay and create the booking
        const bookingResponse =
          await VehicleBookingHelper.verifyAndCreateBooking(
            paymentDetails,
            bookingInput
          );

        return {
          status: bookingResponse.status,
          message: bookingResponse.message,
          data: bookingResponse.data, // Ensure that the booking data is returned correctly
        };
      } catch (error) {
        return {
          status: "error",
          message: "Payment verification and booking creation failed.",
        };
      }
    },

    addReview: async (
      _,
      { bookingId, vehicleId, comment, rating },
      { token }
    ) => {
      try {
        if (!token) {
          return {
            status: false,
            message: "Authorization token is missing.",
          };
        }

        // Verify and decode the JWT token to get user details
        const decodedToken = verifyToken(token.replace("Bearer ", ""));
        const userId = decodedToken.id;

        const response = await VehicleBookingHelper.addReview({
          bookingId,
          vehicleId,
          comment,
          rating,
          userId: userId,
        });
        return response;
      } catch (err) {
        return {
          status: false,
          message: "Failed to add review.",
        };
      }
    },
    generateBookingInvoice: async (_, { bookingId }) => {
      try {
        return await VehicleBookingHelper.generateInvoice(bookingId);
      } catch (error) {
        console.error('Resolver error:', error);
        return {
          status: false,
          message: error.message,
          data: null
        };
      }
    },
  },
};

export default VehicleBookingResolver;
