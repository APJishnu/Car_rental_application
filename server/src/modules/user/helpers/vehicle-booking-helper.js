import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

function verifyPaymentSignature(paymentDetails) {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = paymentDetails;

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const generatedSignature = hmac.digest('hex');

    return generatedSignature === razorpaySignature;
}

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


async function fetchPaymentDetails(paymentId) {
    try {
        const payment = await razorpay.payments.fetch(paymentId);
        return payment; // Return the payment details
    } catch (error) {
        console.error("Error fetching payment details:", error);
        throw new Error('Failed to fetch payment details');
    }
}

import VehicleBookingRepo from '../repositories/vehicle-booking-repo.js';

class VehicleBookingHelper {
    static async getAvailableVehicles(pickupDate, dropoffDate) {
        try {
            // Business logic for fetching available vehicles
            const rentableVehicles = await VehicleBookingRepo.getRentableVehicles();

            const availableVehicles = [];

            for (const rentable of rentableVehicles) {
                const isAvailable = await VehicleBookingRepo.checkVehicleAvailability(rentable.vehicleId, pickupDate, dropoffDate);
                console.log(isAvailable)
                if (isAvailable) {
                    availableVehicles.push(rentable);
                }
            }
            console.log("available", availableVehicles)
            return availableVehicles;
        } catch (error) {
            throw new Error('Failed to fetch available vehicles. Please try again later.');
        }
    }

    // Create Razorpay payment order and store booking with status 'pending'
    static async createPaymentOrder(totalPrice, userId, bookingInput) {
        try {


            const isAvailable = await VehicleBookingRepo.checkVehicleAvailability(
                bookingInput.vehicleId,
                new Date(bookingInput.pickupDate),
                new Date(bookingInput.dropoffDate)
            );

            if (!isAvailable) {
                return {
                    status: 'error',
                    message: 'The vehicle is not available for the selected dates.',
                };
            }

            // Create Razorpay order
            const options = {
                amount: totalPrice * 100, // Amount in paise (INR)
                currency: 'INR',
                receipt: `receipt_${Date.now()}`,
            };

            const razorpayOrder = await razorpay.orders.create(options);
            console.log("Razorpay Order Created:", razorpayOrder);

            // Add booking input to database with status "pending"
            const bookingData = {
                userId: userId,
                vehicleId: bookingInput.vehicleId,
                pickupDate: new Date(bookingInput.pickupDate),
                dropoffDate: new Date(bookingInput.dropoffDate),
                totalPrice: totalPrice,
                status: 'pending', // Initially set status to 'pending'
                razorpayOrderId: razorpayOrder.id, // Store Razorpay order ID
                paymentMethod:null,
            };

            const newBooking = await VehicleBookingRepo.createBooking(bookingData);

            // Return the Razorpay order and booking data
            return {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,

            };
        } catch (error) {
            console.error("Error in createPaymentOrder:", error);
            throw new Error('Failed to create payment order.');
        }
    }


    // After payment verification, update booking status to 'booked'
    static async verifyAndCreateBooking(paymentDetails, bookingInput) {
        try {
            const isValidSignature = verifyPaymentSignature(paymentDetails);

            const payment = await fetchPaymentDetails(paymentDetails.razorpayPaymentId);
            console.log("payment methods",payment,payment.method,payment.bank)

            if (!isValidSignature) {
                throw new Error("Payment signature verification failed.");
            }

            // Update the booking status to 'booked'
            const updatedBooking = await VehicleBookingRepo.updateBookingStatus(
              
                paymentDetails.razorpayOrderId,
                'booked' ,// Change status to 'booked' upon successful payment
                payment.method,
                
            );

            return {
                status: "success",
                message: "Payment verified and booking confirmed.",
                data: updatedBooking,
            };
        } catch (error) {
            console.error("Payment verification error:", error);
            return {
                status: "error",
                message: error.message || "Payment verification failed.",
            };
        }
    }



    static async getBookingsByUser(userId) {
        try {
          // Fetch bookings from the repository
          const bookings = await VehicleBookingRepo.fetchBookingsByUserId(userId);
    
          if (!bookings || bookings.length === 0) {
            return {
              status: true,
              statusCode: 200,
              message: "No bookings found for this user.",
              data: [],
            };
          }
    
          return {
            status: true,
            statusCode: 200,
            message: "Bookings fetched successfully",
            data: bookings,
          };
        } catch (error) {
          console.error("Error in BookingHelper:", error);
          return {
            status: false,
            statusCode: 500,
            message: "Failed to fetch bookings",
            data: [],
          };
        }
      }
}

export default VehicleBookingHelper;
