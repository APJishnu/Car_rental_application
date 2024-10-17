import Booking from "../../user/models/booking-model.js";
import Manufacturer from "../models/manufacturer-model.js";
import Rentable from "../models/rentable-vehicle-model.js";
import Vehicle from "../models/vehicles-model.js";
import { Op } from 'sequelize'; // Import Op from sequelize

class BookingsRepo {
  
    // New method to fetch all bookings (without userId filter)
    static async fetchAllBookings() {
      try {
        return await Booking.findAll({
          where: {
            status: {
              [Op.or]: ['booked', 'released'], // Filter for booked or released status
            },
          },
          include: [
            {
              model: Rentable,
              as: 'rentable',
              paranoid: false, // Include soft-deleted Rentable records
              include: [
                {
                  model: Vehicle,
                  as: 'vehicle',
                  paranoid: false, // Include soft-deleted Vehicle records
                  include: [
                    {
                      model: Manufacturer,
                      as: 'manufacturer',
                      paranoid: false, // Include soft-deleted Manufacturer records
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