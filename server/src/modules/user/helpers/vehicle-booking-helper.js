// Import necessary modules
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import sequelize from "../../../config/database.js";

dotenv.config();

function verifyPaymentSignature(paymentDetails) {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = paymentDetails;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const generatedSignature = hmac.digest("hex");

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
        throw new Error("Failed to fetch payment details");
    }
}

import VehicleBookingRepo from "../repositories/vehicle-booking-repo.js";
import RentableVehicleHelper from "../../admin/helpers/rentable-vehicle-helper.js";

class VehicleBookingHelper {
    static async getAvailableVehicles(
        pickupDate,
        dropoffDate,
        query,
        transmission,
        fuelType,
        seats,
        priceSort,
        priceRange
    ) {
        try {
            if (query || transmission || fuelType || seats || priceSort || priceRange) {
                const rentableVehicles = await RentableVehicleHelper.searchRentableVehicles({
                    query,
                    transmission,
                    fuelType,
                    seats,
                    priceSort,
                    priceRange,
                });

                console.log(priceSort);
                console.log(priceRange, "priceRange");

                const availableVehicles = [];

                // Step 4: Check availability for each rentable vehicle
                for (const rentable of rentableVehicles) {
                    const isAvailable = await VehicleBookingRepo.checkVehicleAvailability(
                        rentable.vehicleId,
                        pickupDate,
                        dropoffDate
                    );

                    console.log(`Vehicle ID ${rentable.vehicleId} availability:`, isAvailable);

                    if (isAvailable) {
                        availableVehicles.push(rentable);
                    }
                }

                // Sort the available vehicles by pricePerDay based on priceSort parameter
                availableVehicles.sort((a, b) => {
                    if (priceSort === "asc") {
                        return a.pricePerDay - b.pricePerDay; // Ascending order
                    } else if (priceSort === "desc") {
                        return b.pricePerDay - a.pricePerDay; // Descending order
                    }
                    return 0; // No sorting if priceSort is undefined or invalid
                });

                console.log("Available Vehicles after filtering and sorting:", availableVehicles);

                return {
                    status: "success",
                    statusCode: 200,
                    message: "success",
                    data: availableVehicles,
                };
            } else {
                // Business logic for fetching available vehicles
                const rentableVehicles = await VehicleBookingRepo.getRentableVehicles();

                const availableVehicles = [];

                for (const rentable of rentableVehicles) {
                    const isAvailable = await VehicleBookingRepo.checkVehicleAvailability(
                        rentable.vehicleId,
                        pickupDate,
                        dropoffDate
                    );
                    console.log(isAvailable);
                    if (isAvailable) {
                        availableVehicles.push(rentable);
                    }
                }

                return {
                    status: "success",
                    statusCode: 200,
                    message: "success",
                    data: availableVehicles,
                };
            }
        } catch (error) {
            throw new Error(
                "Failed to fetch available vehicles. Please try again later."
            );
        }
    }

    // Create Razorpay payment order and store booking with status 'pending'
    static async createPaymentOrder(totalPrice, userId, bookingInput) {
        const transaction = await sequelize.transaction(); // Start transaction
        console.log(totalPrice, userId, bookingInput, "infhabdslhbckdsh");

        try {
            const isAvailable = await VehicleBookingRepo.checkVehicleAvailability(
                bookingInput.vehicleId,
                new Date(bookingInput.pickupDate),
                new Date(bookingInput.dropoffDate)
            );

            if (!isAvailable) {
                return {
                    status: false,
                    message: "The vehicle is not available for the selected dates.",
                    statusCode: 400, // Bad Request
                    data: null,
                };
            }

            // Create Razorpay order
            const options = {
                amount: totalPrice * 100, // Amount in paise (INR)
                currency: "INR",
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
                status: "pending", // Initially set status to 'pending'
                razorpayOrderId: razorpayOrder.id, // Store Razorpay order ID
                paymentMethod: null,
            };

            const newBooking = await VehicleBookingRepo.createBooking(bookingData);

            await transaction.commit();

            // Return the Razorpay order and booking data
            return {
                status: true,
                message: "Razorpay order created and booking stored successfully.",
                statusCode: 200,
                data: {
                    razorpayOrderId: razorpayOrder.id,
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                },
            };
        } catch (error) {
            await transaction.rollback(); // Rollback on error
            console.error("Error in createPaymentOrder:", error);
            return {
                status: false,
                message:
                    error.message ||
                    "An error occurred while creating the payment order.",
                statusCode: 500, // Internal Server Error
                data: null,
            };
        }
    }

    // After payment verification, update booking status to 'booked'
    static async verifyAndCreateBooking(paymentDetails) {
        try {
            const isValidSignature = verifyPaymentSignature(paymentDetails);

            console.log(paymentDetails);
            const payment = await fetchPaymentDetails(
                paymentDetails.razorpayPaymentId
            );
            console.log("payment methods", payment, payment.method, payment.bank);

            if (!isValidSignature) {
                throw new Error("Payment signature verification failed.");
            }

            // Update the booking status to 'booked'
            const updatedBooking = await VehicleBookingRepo.updateBookingStatus(
                paymentDetails.razorpayOrderId,
                "booked", // Change status to 'booked' upon successful payment
                payment.method
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

            console.log(bookings, "in helper booking fetching");

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

    static async addReview({ bookingId, vehicleId, comment, rating, userId }) {
        // Here we can add any additional business logic if needed
        const result = await VehicleBookingRepo.createReview(
            bookingId,
            vehicleId,
            comment,
            rating,
            userId
        );

        if (result) {
            return {
                status: true,
                message: "Review added successfully.",
            };
        } else {
            return {
                status: false,
                message: "Error adding review.",
            };
        }
    }
}

export default VehicleBookingHelper;
