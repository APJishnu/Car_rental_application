import Booking from "../../user/models/booking-model.js";
import Manufacturer from "../models/manufacturer-model.js";
import Rentable from "../models/rentable-vehicle-model.js";
import Vehicle from "../models/vehicles-model.js";
import { Op } from "sequelize"; // Import Op from sequelize

class BookingsRepo {
  // New method to fetch all bookings (without userId filter)
  static async fetchAllBookings(inventoryId) {
    try {
      const queryOptions = {
        where: {
          status: {
            [Op.or]: ["booked", "released"],
          },
        },
        include: [
          {
            model: Rentable,
            as: "rentable",
            paranoid: false,
            include: [
              {
                model: Vehicle,
                as: "vehicle",
                paranoid: false,
                include: [
                  {
                    model: Manufacturer,
                    as: "manufacturer",
                    paranoid: false,
                  },
                ],
              },
            ],
          },
        ],
      };
  
      if (inventoryId === "") {
        return await Booking.findAll(queryOptions);
      }
      if (inventoryId) {
        queryOptions.include[0].where = {
          ...queryOptions.include[0].where,
          inventoryId: {
            [Op.eq]: inventoryId,
          },
        };
      }
  
      return await Booking.findAll(queryOptions);
    } catch (error) {
    
      throw new Error("Database query failed");
    }
  }

  static async findById(bookingId) {
    try {
      return await Booking.findByPk(bookingId);
    } catch (error) {
      throw new Error("Error fetching booking");
    }
  }

  static async save(booking) {
    try {
      return await booking.save();
    } catch (error) {
      throw new Error("Error saving booking");
    }
  }
}

export default BookingsRepo;
