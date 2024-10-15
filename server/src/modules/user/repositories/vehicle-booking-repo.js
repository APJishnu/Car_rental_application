import { Op } from 'sequelize';
import Rentable from '../../admin/models/rentable-vehicle-model.js';
import Vehicle from '../../admin/models/vehicles-model.js';
import Manufacturer from '../../admin/models/manufacturer-model.js';
import Booking from '../models/booking-model.js';

class VehicleBookingRepo {
    static async getRentableVehicles() {
        const response = await Rentable.findAll({
            where: {
                availableQuantity: {
                    [Op.gt]: 0,  // Only get vehicles with quantity > 0
                },
            },
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
        });

        console.log("rentables in repo", response)

        return response
    }

    static async checkVehicleAvailability(vehicleId, pickupDate, dropoffDate) {
        // Fetch total available quantity for the vehicle
        const rentableVehicle = await Rentable.findOne({
            where: { vehicleId },
        });

        if (!rentableVehicle) {
            throw new Error("Vehicle not found.");
        }

        const totalAvailableQuantity = rentableVehicle.availableQuantity;

        // Find overlapping bookings for the specified vehicle in the requested date range
        const overlappingBookings = await Booking.findAll({
            where: {
                vehicleId,
                status: 'booked', // Only check fully booked vehicles
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
        });

        const bookedCount = overlappingBookings.length;

        // Calculate available quantity
        const availableQuantity = (totalAvailableQuantity) - bookedCount;
        console.log(`Vehiclesss ${totalAvailableQuantity}: Available Quantity = ${bookedCount}`)

        console.log(`Vehicle ${vehicleId}: Available Quantity = ${availableQuantity}`);

        return availableQuantity > 0;
    }

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
            where: { razorpayOrderId }
        });

        if (!booking) {
            throw new Error("Booking not found.");
        }

        booking.status = status; // Update status to 'booked'
        booking.paymentMethod = paymentMethod;
        await booking.save();

        return booking;
    }

    static async fetchBookingsByUserId(userId) {
        try {
          // Fetch all bookings by userId and include Rentable, Vehicle, and Manufacturer
          return await Booking.findAll({
            where: { userId },
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
}

export default VehicleBookingRepo;
