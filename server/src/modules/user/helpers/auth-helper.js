// src/helpers/auth-helper.js
import authRepo from "../repositories/auth-repo.js";
import bcrypt from "bcryptjs";
import User from "../models/auth-model.js"; // Ensure the path is correct
import twilio from "twilio"; // Make sure to install twilio
import { generateToken } from "../../../utils/jwt-helper.js"; // Import the token utility
import mime from "mime-types";
import minioClient from "../../../config/minio.js";

import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
); // Replace with your Twilio credentials

class AuthHelper {
  async sendOTP(phoneNumber) {
    // Check if the user already exists with this phone number
    const existingUser = await authRepo.findByPhoneNumber(phoneNumber);
    if (existingUser) {
      return {
        status: "error",
        statusCode: 400,
        message: "User with this phone number already exists",
        data: null,
      };
    }

    // Twilio's API for sending OTP (no need to generate manually)
    const formattedNumber = phoneNumber.startsWith("+")
      ? phoneNumber
      : `+91${phoneNumber}`;

    // Send OTP using Twilio's Verify API
    await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: `+91${8714804072}`, channel: "sms" });

    return { status: "success", message: "OTP sent successfully", data: null };
  }

  async verifyOTP(phoneNumber, otp) {
    const formattedNumber = phoneNumber.startsWith("+")
      ? phoneNumber
      : `+91${phoneNumber}`; // Ensure the phone number is in the correct format

    try {
      // Verify the OTP using Twilio's Verify API
      const verificationCheck = await twilioClient.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks.create({ to: `+91${8714804072}`, code: otp });

      // Check if the verification was successful
      if (verificationCheck.status === "approved") {
        return {
          status: "success",
          statusCode: 200,
          message: "Phone number verified successfully",
          data: {
            isPhoneVerified: true,
            phoneVerifiedAt: new Date().toISOString(),
          },
        };
      } else {
        return {
          status: "error",
          statusCode: 400,
          message: "OTP verification failed",
          errors: [
            {
              field: "otp",
              message: "Invalid OTP. Please try again.",
            },
          ],
        };
      }
    } catch (error) {
      // Check for specific Twilio error codes
      if (error.code === 20404) {
        return {
          status: "error",
          statusCode: 404,
          message: "The requested verification service was not found.",
        };
      }

      // Handle other errors that may occur
      return {
        status: "error",
        statusCode: 500,
        message: "An unexpected error occurred during OTP verification.",
        errors: [
          {
            field: "otp",
            message: "An error occurred. Please try again later.",
          },
        ],
      };
    }
  }

  async registerUser(input) {
    const {
      email,
      password,
      phoneNumber,
      isPhoneVerified,
      phoneVerifiedAt,
      firstName,
      lastName,
      confirmPassword, // Extract confirmPassword for validation if needed
      additionalDetails, // Destructure additionalDetails
    } = input;

    // Destructure properties from additionalDetails
    const { city, state, country, pincode } = additionalDetails;

    // Check if the user already exists
    const existingUser = await authRepo.findByPhoneNumber(phoneNumber);
    if (existingUser) {
      return {
        status: "error",
        statusCode: 400, // Set appropriate status code for user already exists
        message: "User already exists",
        errors: null, // No field-specific errors in this case
        data: null,
      };
    }

    // Validate password and confirmPassword
    if (password !== confirmPassword) {
      return {
        status: "error",
        statusCode: 400,
        message: "Passwords do not match",
        errors: [
          { field: "confirmPassword", message: "Passwords do not match" },
        ], // Return specific error
        data: null,
      };
    }

    // Prepare user data for storage
    const userData = {
      firstName,
      lastName,
      phoneNumber,
      email,
      password: await bcrypt.hash(password, 10), // Hash the password
      isPhoneVerified: isPhoneVerified, // Set to true since the phone number is verified
      city,
      state,
      country,
      pincode,
      phoneVerifiedAt: phoneVerifiedAt, // Set verification date
    };

    // Save the user data to the database
    const newUser = await authRepo.createUser(userData);

    return {
      status: "success",
      statusCode: 201, // Use a 201 status code for successful creation
      message: "Registration completed successfully.",
      errors: null, // No errors, as the operation was successful
      data: newUser,
    };
  }

  async loginUser(email, password) {
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return {
          status: false,
          statusCode: 404,
          message: "User not found",
          token: null,
          data: null,
          fieldErrors: { email: "The email address is not registered." },
        };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return {
          status: false,
          statusCode: 401,
          message: "Invalid password",
          token: null,
          data: null,
          fieldErrors: { password: "Incorrect Password" },
        };
      }

      const token = generateToken(user);
      return {
        status: true,
        statusCode: 200,
        message: "Login successful",
        token,
        data: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
        },
        fieldErrors: null,
      };
    } catch (err) {
      return {
        status: false,
        statusCode: 500,
        message: "An internal server error occurred.",
        token: null,
        data: null,
        fieldErrors: null,
      };
    }
  }

  // authHelper.js
  async updateUserProfileImage(userId, profileImage) {
    try {
      // Check if the profile image is null (i.e., remove the current image)
      if (!profileImage) {
        const user = await authRepo.findById(userId);
        if (!user) {
          throw new Error("User not found");
        }

        const existingImageUrl = user.profileImage;

        // Function to extract the image path
        const getImagePath = (url) => {
          const baseUrl = url.split("?")[0]; // Get the part before the '?'
          const urlParts = baseUrl.split("/");
          // Join the last parts excluding the query parameters
          const imagePath = urlParts.slice(4).join("/"); // Adjust the slice indices based on your URL structure
          return imagePath;
        };

        const imagePath = getImagePath(existingImageUrl);
        // If there is an existing image, remove it from Minio
        if (imagePath) {
          await this.removeFromMinio(imagePath);
        }

        // Update user profile image in the database (set to null)
        const updatedUser = await authRepo.updateProfileImage(userId, null);

        return {
          status: "success",
          message: "Profile image removed successfully",
          data: updatedUser,
        };
      }

      // If a new image is provided, upload it to Minio
      const imageUrl = await this.uploadToMinio(
        profileImage,
        "profile-pictures"
      );

      // Update the user in the database with the new image URL
      const updatedUser = await authRepo.updateProfileImage(userId, imageUrl);

      return {
        status: "success",
        message: "Profile image updated successfully",
        data: updatedUser,
      };
    } catch (error) {
      throw new Error("Failed to update profile image");
    }
  }

  // Upload image to Minio
  async uploadToMinio(file, folder) {
    try {
      const { createReadStream, filename } = await file;
      const stream = createReadStream();
      const uniqueFilename = `${folder}/${filename}`; // Use timestamp for uniqueness
      const contentType = mime.lookup(filename) || "application/octet-stream";

      await new Promise((resolve, reject) => {
        minioClient.putObject(
          process.env.MINIO_BUCKET_NAME_PRIVATE,
          uniqueFilename,
          stream,
          { "Content-Type": contentType },
          (error) => {
            if (error) {
              return reject(new Error("MinIO upload failed"));
            }
            resolve();
          }
        );
      });

      // Minio file URL (for private bucket, you might need a signed URL instead)
      const imageUrl = await minioClient.presignedGetObject(
        process.env.MINIO_BUCKET_NAME_PRIVATE,
        uniqueFilename
      );

      return imageUrl;
    } catch (error) {
      throw new Error("Image upload failed");
    }
  }

  // Remove image from Minio (if needed)
  async removeFromMinio(imagePath) {
    try {
      await minioClient.removeObject(
        process.env.MINIO_BUCKET_NAME_PRIVATE,
        imagePath
      );
    } catch (error) {}
  }

  async updateUserInfoHelper({
    userId,
    firstName,
    lastName,
    email,
    city,
    state,
    country,
    pincode,
  }) {
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (city) updateData.city = city;
    if (state) updateData.state = state;
    if (country) updateData.country = country;
    if (pincode) updateData.pincode = pincode;

    try {
      const updatedUser = await authRepo.updateUserInfo(userId, updateData);
      return {
        status: true,
        statusCode: 200,
        message: "User information updated successfully",
        data: updatedUser,
      };
    } catch (error) {
      return {
        status: false,
        statusCode: 500,
        message: error.message,
        data: null,
      };
    }
  }

  async updatePassword(userId, currentPassword, newPassword) {
    // Validate the current password
    const isCurrentPasswordValid = await authRepo.validatePassword(
      userId,
      currentPassword
    );
    if (!isCurrentPasswordValid) {
      return {
        status: false,
        statusCode: 404,
        message: "Current password is incorrect",
        fieldErrors: [
          {
            field: "currentPassword",
            message: "Current password is incorrect",
          },
        ],
      };
    }

    // Proceed to update the password
    const result = await authRepo.updatePassword(userId, newPassword);
    if (result) {
      return {
        status: true,
        statusCode: 200,
        message: "Password updated successfully",
      };
    } else {
      return {
        status: false,
        statusCode: 404,
        message: "Failed to update password",
      };
    }
  }
}

export default new AuthHelper();
