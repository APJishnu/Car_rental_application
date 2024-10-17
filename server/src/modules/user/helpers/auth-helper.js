// src/helpers/auth-helper.js
import authRepo from "../repositories/auth-repo.js";
import bcrypt from "bcrypt";
import User from "../models/auth-model.js"; // Ensure the path is correct
import twilio from "twilio"; // Make sure to install twilio
import TemporaryOTP from "../models/temp-otp-storage.js"; // Import your model
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
      : `+91${phoneNumber}`;
    // Verify the OTP using Twilio's Verify API
    const verificationCheck = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: `+91${8714804072}`, code: otp });

    // Check if the verification was successful
    if (verificationCheck.status === "approved") {
      return {
        status: "success",
        message: "Phone verification successful",
        data: null,
      };
    } else {
      return {
        status: "error",
        message: "Invalid or expired OTP",
        data: null,
      };
    }
  }

  async registerUser(input) {
    const {
      email,
      password,
      phoneNumber,
      firstName,
      lastName,
      city,
      state,
      country,
      pincode,
    } = input;

    // Check if the user already exists
    const existingUser = await authRepo.findByPhoneNumber(phoneNumber);
    if (existingUser) {
      return { status: "error", message: "User already exists", data: null };
    }

    // Prepare user data for storage
    const userData = {
      firstName,
      lastName,
      phoneNumber,
      email,
      password: await bcrypt.hash(password, 10), // Hash the password
      isPhoneVerified: true, // Set to true since the phone number is verified
      city,
      state,
      country,
      pincode,
      phoneVerifiedAt: new Date(), // Set verification date
    };

    // Save the user data to the database
    const newUser = await authRepo.createUser(userData);

    return {
      status: "success",
      message: "Registration completed successfully.",
      data: newUser,
    };
  }

  async loginUser(email, password) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return {
        status: "fail",
        message: "User not found",
        token: null,
        data: null,
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        status: "fail",
        message: "Invalid password",
        token: null,
        data: null,
      };
    }

    const token = generateToken(user);
    return {
      status: "success",
      message: "Login successful",
      token,
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    };
  }

  // authHelper.js
  async updateUserProfileImage(userId, profileImage) {
    try {
      // Check if the profile image is null (i.e., remove the current image)
      if (!profileImage) {
        // Fetch user data
        const user = await authRepo.findById(userId);
        if (!user) {
          throw new Error("User not found");
        }

        console.log(user);

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

        console.log(imagePath);

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
      console.error("Error updating user profile image:", error.message);
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
      console.error("Error uploading image:", error.message);
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
    } catch (error) {
      console.error("Error removing image from Minio:", error.message);
    }
  }
}

export default new AuthHelper();
