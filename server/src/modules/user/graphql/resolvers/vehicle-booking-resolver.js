import { verifyToken } from '../../../../utils/jwt-helper.js';
import VehicleBookingHelper from '../../helpers/vehicle-booking-helper.js';
import User from '../../models/auth-model.js';
import Booking from '../../models/booking-model.js';
import Review from '../../models/review-model.js';

const VehicleBookingResolver = {
  Query: {
    getAvailableVehicles: async (_, { pickupDate, dropoffDate }) => {
      return await VehicleBookingHelper.getAvailableVehicles(pickupDate, dropoffDate);
    },
    fetchBookings: async (_, __, { token }) => {

      try {
        if (!token) {
          console.log("Authorization token is missing.");
          return {
            status: false,
            statusCode: 401,
            message: "Authorization token is missing.",
            data: [],
          };
        }

        // Verify and decode the JWT token to get user details
        const decodedToken = verifyToken(token.replace('Bearer ', ''));
        const userId = decodedToken.id;

        // Use helper to get bookings for the user
        return await VehicleBookingHelper.getBookingsByUser(userId);
      } catch (error) {
        console.error("Error fetching bookings:", error);
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
              as: 'booking', // Include Booking details
            },
            {
              model: User,
              as: 'user', // Include User details to fetch firstName, lastName, email, and profilePicture
              attributes: ['id', 'firstName', 'lastName', 'email', 'profileImage'], // Select necessary fields
            },
          ],
        });
        return reviews;
      } catch (error) {
        console.error("Error fetching reviews:", error);
        throw new Error("Failed to fetch reviews");
      }
    },
  },

  Mutation: {
    // Mutation for creating a Razorpay payment order along with booking details
    createPaymentOrder: async (_, { totalPrice, bookingInput }, { token }) => {
      console.log("Total price in payment order:", totalPrice);
      try {
        if (!token) {
          console.log("Authorization token is missing.");
          return {
            status: "error",
            message: 'Authorization token is missing.',
          };
        }

        // Verify and decode the JWT token to get user details
        const decodedToken = verifyToken(token.replace('Bearer ', ''));
        const user = await User.findByPk(decodedToken.id);


        if (!user) {
          return {
            status: "error",
            message: "User not found.Please Login First",
          };
        }

        // Create Razorpay order using the total price and booking details
        const razorpayOrder = await VehicleBookingHelper.createPaymentOrder(totalPrice, user.id, bookingInput);
        console.log("Razorpay order created:", razorpayOrder);

        return {
          status: "success",
          message: "Payment order created successfully.",
          userName: user.name,
          userEmail: user.email, // Ensure the field is correctly referenced
          razorpayOrderId: razorpayOrder.id, // Ensure this is not null
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
        };
      } catch (error) {
        console.error("Error creating payment order:", error);
        return {
          status: "error",
          message: "Failed to create payment order.",
        };
      }
    },

    // Mutation for verifying the payment and creating the booking
    verifyPaymentAndCreateBooking: async (_, { paymentDetails, bookingInput }, { token }) => {
      console.log("Payment details and booking inputs:", paymentDetails, bookingInput);
      try {
        if (!token) {
          return {
            status: "error",
            message: 'Authorization token is missing.',
          };
        }

        // Verify and decode the JWT token to get user details
        const decodedToken = verifyToken(token.replace('Bearer ', ''));
        const userId = decodedToken.id;

        // Add userId to the booking input for the booking creation process
        bookingInput.userId = userId;

        // Verify the payment with Razorpay and create the booking
        const bookingResponse = await VehicleBookingHelper.verifyAndCreateBooking(paymentDetails, bookingInput);

        return {
          status: bookingResponse.status,
          message: bookingResponse.message,
          data: bookingResponse.data, // Ensure that the booking data is returned correctly
        };
      } catch (error) {
        console.error("Error verifying payment and creating booking:", error);
        return {
          status: "error",
          message: "Payment verification and booking creation failed.",
        };
      }
    },

    addReview: async (_, { bookingId,vehicleId, comment, rating }, { token }) => {
      try {
        if (!token) {
          return {
            status: false,
            message: 'Authorization token is missing.',
          };
        }

        // Verify and decode the JWT token to get user details
        const decodedToken = verifyToken(token.replace('Bearer ', ''));
        const userId = decodedToken.id;

  

        
        const response = await VehicleBookingHelper.addReview({ bookingId,vehicleId, comment, rating, userId: userId });
        return response;
      } catch (err) {
        console.error(err);
        return {
          status: false,
          message: 'Failed to add review.',
        };
      }
    },
  },
};

export default VehicleBookingResolver;
