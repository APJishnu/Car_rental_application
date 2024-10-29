import { Op } from "sequelize";
import Review from "../models/review-model.js";
import Booking from "../models/booking-model.js";
import sequelize from "../../../config/database.js";
import Vehicle from "../../admin/models/vehicles-model.js";
import Rentable from "../../admin/models/rentable-vehicle-model.js";
import Manufacturer from "../../admin/models/manufacturer-model.js";

class VehicleBookingRepo {
  static async getRentableVehicles() {
    const response = await Rentable.findAll({
      where: {
        availableQuantity: {
          [Op.gt]: 0, // Only get vehicles with quantity > 0
        },
      },
      include: [
        {
          model: Vehicle,
          as: "vehicle",
          include: [
            {
              model: Manufacturer,
              as: "manufacturer",
            },
          ],
        },
      ],
    });
    return response;
  }

  static async checkVehicleAvailability(
    rentableId,
    pickupDate,
    dropoffDate,
    inventoryId
) {
    const transaction = await sequelize.transaction();

    try {
        // Fetch total available quantity for the vehicle, optionally filtering by inventory location
        const whereClause = {
            id: rentableId,
            ...(inventoryId && { inventoryId: inventoryId }), // Apply location filter if provided
        };

        const rentableVehicle = await Rentable.findOne({
            where: whereClause,
            lock: transaction.LOCK.UPDATE,
            transaction,
        });

        // If no vehicle is found that matches the vehicle ID (and location if specified), return false (not available)
        if (!rentableVehicle) {
            await transaction.commit(); // Commit here if no vehicle is found
            return false;
        }

        const totalAvailableQuantity = rentableVehicle.availableQuantity;

        // Find overlapping bookings for the specified vehicle in the requested date range
        const overlappingBookings = await Booking.findAll({
            where: {
                rentableId,
                status: ["booked", "pending"], // Only check fully booked vehicles
                [Op.or]: [
                    {
                        pickupDate: {
                            [Op.between]: [pickupDate, dropoffDate],
                        },
                    },
                    {
                        dropoffDate: {
                            [Op.between]: [pickupDate, dropoffDate],
                        },
                    },
                    {
                        [Op.and]: [
                            { pickupDate: { [Op.lte]: pickupDate } },
                            { dropoffDate: { [Op.gte]: dropoffDate } },
                        ],
                    },
                ],
            },
            transaction,
        });

        const bookedCount = overlappingBookings.length;

        // Calculate available quantity
        const availableQuantity = totalAvailableQuantity - bookedCount;

        await transaction.commit(); // Commit only after everything is done
        return availableQuantity > 0; // Return true if available, false otherwise
    } catch (error) {
        await transaction.rollback(); // Rollback only if there is an error
        throw new Error(
            "Failed to check vehicle availability. Please try again later."
        );
    }
}


  // Get existing booking for a user
  static async getExistingBooking(userId, vehicleId, pickupDate, dropoffDate) {
    return await Booking.findOne({
      where: {
        userId,
        vehicleId,
        pickupDate: new Date(pickupDate),
        dropoffDate: new Date(dropoffDate),
      },
    });
  }

  // Create a new booking
  static async createBooking(bookingData) {
    return await Booking.create(bookingData);
  }

  // Update booking status (e.g., from 'pending' to 'booked')
  static async updateBookingStatus(razorpayOrderId, status, paymentMethod) {
    const booking = await Booking.findOne({
      where: { razorpayOrderId },
    });

    if (!booking) {
      throw new Error("Booking not found.");
    }

    booking.status = status; // Update status to 'booked'
    booking.paymentMethod = paymentMethod;
    await booking.save();

    return booking;
  }

  // Fetch all bookings by userId
  static async fetchBookingsByUserId(userId) {
    try {
      // Fetch all bookings by userId and include Rentable, Vehicle, and Manufacturer
      return await Booking.findAll({
        where: {
          userId,
          status: ["booked","released"], // Filter to only get bookings with 'Booked' status
        },
        include: [
          {
            model: Rentable,
            as: "rentable",
            required: false, // Ensure the join does not filter out soft-deleted records
            paranoid: false, // Include soft-deleted records
            include: [
              {
                model: Vehicle,
                as: "vehicle",
                required: false, // Ensure the join does not filter out soft-deleted records
                paranoid: false, // Include soft-deleted records
                include: [
                  {
                    model: Manufacturer,
                    as: "manufacturer",
                    required: false, // Ensure the join does not filter out soft-deleted records
                    paranoid: false, // Include soft-deleted records
                  },
                ],
              },
            ],
          },
        ],
        logging: console.log,
      });
    } catch (error) {
      throw new Error("Database query failed");
    }
  }

  // Create a review for a booking
  static async createReview(bookingId, vehicleId, comment, rating, userId) {
    try {
      // Validate booking exists and is associated with the user
      const booking = await Booking.findOne({
        where: { id: bookingId, userId },
      });
      if (!booking) {
        throw new Error("Booking not found or not associated with the user.");
      }

      // Create the review
      const review = await Review.create({
        bookingId,
        vehicleId,
        userId,
        comment,
        rating,
      });

      return review;
    } catch (error) {
      return null;
    }
  }
}

export default VehicleBookingRepo;
