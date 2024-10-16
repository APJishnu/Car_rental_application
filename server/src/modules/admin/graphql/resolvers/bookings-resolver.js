import { verifyToken } from "../../../../utils/jwt-helper.js";
import BookingsHelper from "../../helpers/bookings-helper.js";

const BookingsResolvers = {
  Query: {
    // New resolver for fetching all bookings (Admin only)
    fetchAllBookings: async (_, __, { token }) => {

        
        console.log(token)
        const decodedToken = verifyToken(token.replace('Bearer ', ''));
        console.log(decodedToken)
        try {
        if (!token) {
          return {
            status: false,
            statusCode: 401,
            message: "Authorization token is missing.",
            data: [],
          };
        }

        const decodedToken = verifyToken(token.replace('Bearer ', ''));

        // Assuming that admin's role is verified via token
        if (decodedToken.role !== "admin") {
          return {
            status: false,
            statusCode: 403,
            message: "You are not authorized to view all bookings.",
            data: [],
          };
        }

        return await BookingsHelper.getAllBookings(); // Fetch all bookings for admin
      } catch (error) {
        console.error("Error fetching all bookings:", error);
        return {
          status: false,
          statusCode: 500,
          message: "Failed to fetch all bookings.",
          data: [],
        };
      }
    },
  },

  Mutation: {
    releaseBooking: async (_, { id }, { dataSources }) => {
      try {
        // Call the helper class to handle business logic
    
        const result = await BookingsHelper.releaseBooking(id);

        // Return the result from the helper
        return result;
      } catch (error) {
        console.error(error);
        return {
          status: false,
          statusCode: 500,
          message: 'Internal server error',
        };
      }
    },
  },
};

export default BookingsResolvers;
