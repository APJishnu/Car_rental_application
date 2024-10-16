import BookingsRepo from "../repositories/bookings-repo.js";

class BookingsHelper {
  // New method to fetch all bookings for the admin
  static async getAllBookings() {
    try {
      const bookings = await BookingsRepo.fetchAllBookings(); // Fetch all bookings

      if (!bookings || bookings.length === 0) {
        return {
          status: true,
          statusCode: 200,
          message: "No bookings found.",
          data: [],
        };
      }

      return {
        status: true,
        statusCode: 200,
        message: "All bookings fetched successfully.",
        data: bookings,
      };
    } catch (error) {
      console.error("Error in BookingHelper:", error);
      return {
        status: false,
        statusCode: 500,
        message: "Failed to fetch all bookings.",
        data: [],
      };
    }
  }

  static async releaseBooking(bookingId) {
    try {
      // Fetch booking data from the repository
      const booking = await BookingsRepo.findById(bookingId);

      if (!booking) {
        return {
          status: false,
          statusCode: 404,
          message: 'Booking not found',
        };
      }

      // Update release date
      booking.releaseDate = new Date();
      booking.status = "released"

      // Save the updated booking in the repository
      const updatedBooking = await BookingsRepo.save(booking);

      return {
        status: true,
        statusCode: 200,
        message: 'Booking released successfully',
        updatedBooking,
      };
    } catch (error) {
      console.error(error);
      return {
        status: false,
        statusCode: 500,
        message: 'Internal server error',
      };
    }
  }
}

export default BookingsHelper;
