// Import necessary modules
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import VehicleBookingRepo from "../repositories/vehicle-booking-repo.js";
import RentableVehicleHelper from "../../admin/helpers/rentable-vehicle-helper.js";
import sequelize from "../../../config/database.js";
import { join } from "path";
import { readFile } from "fs/promises";
import handlebars from "handlebars";
import puppeteer from "puppeteer";
import authRepo from "../repositories/auth-repo.js";
dotenv.config();

function verifyPaymentSignature(paymentDetails) {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
    paymentDetails;

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
    throw new Error("Failed to fetch payment details");
  }
}

class VehicleBookingHelper {
  static async getAvailableVehicles(
    pickupDate,
    dropoffDate,
    inventoryId,
    query,
    transmission,
    fuelType,
    seats,
    priceSort,
    priceRange
  ) {
    try {
      const availableVehicles = [];

      if (
        query ||
        transmission ||
        fuelType ||
        seats ||
        priceSort ||
        priceRange
      ) {
        const rentableVehicles =
          await RentableVehicleHelper.searchRentableVehicles({
            query,
            transmission,
            fuelType,
            seats,
            priceSort,
            priceRange,
          });

        console.log(
          rentableVehicles,
          query,
          transmission,
          fuelType,
          seats,
          priceSort,
          priceRange
        );

        // Check availability for each rentable vehicle
        for (const rentable of rentableVehicles) {
          const isAvailable = await VehicleBookingRepo.checkVehicleAvailability(
            rentable.dataValues.vehicleId, // Ensure you access the right property
            pickupDate,
            dropoffDate,
            inventoryId
          );

          if (isAvailable) {
            availableVehicles.push(rentable);
          }
        }

        if (priceSort) {
          availableVehicles.sort((a, b) => {
            if (priceSort === "asc") {
              return a.dataValues.pricePerDay - b.dataValues.pricePerDay; // Ascending order
            } else if (priceSort === "desc") {
              return b.dataValues.pricePerDay - a.dataValues.pricePerDay; // Descending order
            }
            return 0; // No sorting if priceSort is undefined or invalid
          });
        }

        return {
          status: "success",
          statusCode: 200,
          message: "success",
          data: availableVehicles,
        };
      } else {
        // Business logic for fetching available vehicles
        const rentableVehicles = await VehicleBookingRepo.getRentableVehicles();

        for (const rentable of rentableVehicles) {
          const isAvailable = await VehicleBookingRepo.checkVehicleAvailability(
            rentable.dataValues.vehicleId,
            pickupDate,
            dropoffDate,
            inventoryId
          );

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

    try {
      const isAvailable = await VehicleBookingRepo.checkVehicleAvailability(
        bookingInput.rentableId,
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
        amount: Math.round(totalPrice * 100), // Amount in paise (INR)
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };

      const razorpayOrder = await razorpay.orders.create(options);

      // Add booking input to database with status "pending"
      const bookingData = {
        userId: userId,
        rentableId: bookingInput.rentableId,
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

      const payment = await fetchPaymentDetails(
        paymentDetails.razorpayPaymentId
      );

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

  static async generateInvoice(bookingId) {
    try {
      const bookingData = await VehicleBookingRepo.getBookingWithDetails(
        bookingId
      );
      const userData = await authRepo.findById(bookingData.userId);
      const invoiceData = await this.prepareInvoiceData(bookingData, userData);

      // Generate PDF binary data
      const pdfBuffer = await this.generatePDF(invoiceData);

      // Convert the buffer to a Base64 string
      const pdfBase64 = pdfBuffer.toString("base64");

      return {
        status: true,
        message: "Invoice generated successfully",
        data: Array.from(new Uint8Array(pdfBuffer)), // Return as Base64 string
      };
    } catch (error) {
      throw error;
    }
  }

  static async prepareInvoiceData(booking, user) {
    const pickupDate = new Date(booking.pickupDate);
    const dropoffDate = new Date(booking.dropoffDate);
    const days = Math.ceil((dropoffDate - pickupDate) / (1000 * 60 * 60 * 24));

    return {
      invoiceNumber: `INV-${booking.id}`,
      date: new Date().toLocaleDateString(),
      customerName: user.firstName + user.lastName,
      customerEmail: user.email,
      vehicleName: booking.rentable.vehicle.name,
      manufacturer: booking.rentable.vehicle.manufacturer.name,
      year: booking.rentable.vehicle.year,
      pickupDate: pickupDate.toLocaleDateString(),
      dropoffDate: dropoffDate.toLocaleDateString(),
      days,
      pricePerDay: booking.rentable.pricePerDay,
      totalPrice: booking.totalPrice,
      paymentMethod: booking.paymentMethod,
      bookingStatus: booking.status,
    };
  }

  static async generatePDF(invoiceData) {
    try {
      // Get and compile template
      const templateContent = await this.getTemplate();
      const template = handlebars.compile(templateContent);
      const html = template(invoiceData);

      // Generate PDF using puppeteer
      // Generate PDF using puppeteer
      const pdfBuffer = await this.createPDFFromHTML(html);
      console.log(pdfBuffer);
      // Return raw binary buffer instead of Base64
      return pdfBuffer; // Remove the toString('base64') conversion
    } catch (error) {
      throw new Error("PDF generation failed: " + error.message);
    }
  }

  static async getTemplate() {
    try {
      const templatePath = join(
        process.cwd(),
        "src",
        "templates",
        "invoice.html"
      );
      return await readFile(templatePath, "utf-8");
    } catch (error) {
      throw new Error("Template reading failed: " + error.message);
    }
  }

  static async createPDFFromHTML(html) {
    const browser = await puppeteer.launch({ headless: "new" });
    try {
      const page = await browser.newPage();
      await page.setContent(html);

      return await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "20px",
          right: "20px",
          bottom: "20px",
          left: "20px",
        },
      });
    } finally {
      await browser.close();
    }
  }
}

export default VehicleBookingHelper;
