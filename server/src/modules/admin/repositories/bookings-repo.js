import Booking from "../../user/models/booking-model.js";
import Manufacturer from "../models/manufacturer-model.js";
import Rentable from "../models/rentable-vehicle-model.js";
import Vehicle from "../models/vehicles-model.js";

class BookingsRepo {
  
    // New method to fetch all bookings (without userId filter)
    static async fetchAllBookings() {
      try {
        return await Booking.findAll({
          include: [
            {
              model: Rentable,
              as: 'rentable',
              include: [
                {
                  model: Vehicle,
                  as: 'vehicle',
                  include: [
                    {
                      model: Manufacturer,
                      as: 'manufacturer',
                    },
                  ],
                },
              ],
            },
          ],
        });
      } catch (error) {
        console.error("Error in BookingRepo:", error);
        throw new Error("Database query failed");
      }
    }

    static async findById(bookingId) {
      try {
        return await Booking.findByPk(bookingId);
      } catch (error) {
        throw new Error('Error fetching booking');
      }
    }
  
   static async save(booking) {
      try {
        return await booking.save();
      } catch (error) {
        throw new Error('Error saving booking');
      }
    }
  }
  

  export default BookingsRepo;