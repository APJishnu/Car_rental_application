import { verifyToken } from "../../../../utils/jwt-helper.js";
import BookingsHelper from "../../helpers/bookings-helper.js";

const BookingsResolvers = {
  Query: {
    // New resolver for fetching all bookings (Admin only)
    fetchAllBookings: async (_, { inventoryId }, { token }) => {
      
      if (!token) {
          return {
              status: false,
              statusCode: 401,
              message: "Authorization token is missing.",
              data: [],
          };
      }
  
      try {
          const decodedToken = verifyToken(token.replace('Bearer ', ''));
  
          // Check if the user is an admin
          if (decodedToken.role !== "admin") {
              return {
                  status: false,
                  statusCode: 403,
                  message: "You are not authorized to view all bookings.",
                  data: [],
              };
          }
  
          return await BookingsHelper.getAllBookings(inventoryId); // Pass inventoryLocation to helper
      } catch (error) {
          return {
              status: false,
              statusCode: 500,
              message: "Failed to fetch all bookings.",
              data: [],
          };
      }
  }
  },

  Mutation: {
    releaseBooking: async (_, { id }, { dataSources }) => {
      try {
        // Call the helper class to handle business logic
    
        const result = await BookingsHelper.releaseBooking(id);

        // Return the result from the helper
        return result;
      } catch (error) {
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
