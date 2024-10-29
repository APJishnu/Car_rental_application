// src/graphql/resolvers.js
import authHelper from "../../helpers/auth-helper.js";
import authenticateUser from "../../middlewares/auth-middleware.js";
import { GraphQLUpload } from "graphql-upload";
import {
  additionalDetailsSchema,
  otpValidationSchema,
  passwordSchema,
  sendOtpValidationSchema,
  validateUpdateUserInfo,
} from "../../../../utils/Joi/user-validation.js";
import { loginSchema } from "../../../../utils/Joi/admin-login-validation.js";

const userAuthResolvers = {
  Upload: GraphQLUpload,

  Query: {
    getUser: async (_, __, { token }) => {
      try {
        const user = await authenticateUser(token);

        return {
          status: "success",
          message: "User fetched successfully",
          data: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            email: user.email,
            city: user.city,
            state: user.state,
            country: user.country,
            pincode: user.pincode,
            profileImage: user.profileImage || null, // Include profileImage if available
          },
        };
      } catch (error) {
        return {
          status: "error",
          message: error.message,
          data: null,
        };
      }
    },
  },

  Mutation: {
    async sendOTP(
      _,
      { firstName, lastName, phoneNumber, email, password, confirmPassword }
    ) {
      try {
        if (
          phoneNumber &&
          !firstName &&
          !lastName &&
          !email &&
          !password &&
          !confirmPassword
        ) {
          const response = await authHelper.sendOTP(phoneNumber);
          // Return the response from sending OTP
          return { ...response, data: null };
        }

        // Validate inputs
        const { error } = sendOtpValidationSchema.validate(
          {
            firstName,
            lastName,
            phoneNumber,
            email,
            password,
            confirmPassword,
          },
          { abortEarly: false }
        );

        // Function to remove quotes from error messages
        const removeQuotes = (message) => message.replace(/['"]/g, "");

        // Map the validation errors to the desired output format
        const validationErrors = error
          ? error.details.map((err) => ({
              field: err.path[0], // The field name
              message: removeQuotes(err.message), // Remove quotes from the message
            }))
          : [];

        // If there are validation errors, return them
        if (validationErrors.length > 0) {
          return {
            status: "error",
            message: "Validation error",
            errors: validationErrors,
            data: null,
          };
        }

        // Send OTP logic
        const response = await authHelper.sendOTP(phoneNumber);
        return { ...response, data: null };
      } catch (error) {
        return {
          status: "error",
          message: "An unexpected error occurred while sending OTP.",
          errors: [], // No specific errors to return in this case
          data: null,
        };
      }
    },

    async registerUser(_, { input }) {
      // Validate additional details using Joi
      const validationResult = additionalDetailsSchema.validate(
        input.additionalDetails,
        { abortEarly: false }
      );

      if (validationResult.error) {
        const errors = validationResult.error.details.map((error) => ({
          field: error.path[0],
          message: error.message,
        }));

        return {
          status: "error",
          statusCode: 400,
          message: "Validation failed",
          errors,
        };
      }

      const response = await authHelper.registerUser(input);
      return response;
    },

    async verifyOTP(_, { phoneNumber, otp }) {
      // Validate input
      const validationResult = otpValidationSchema.validate(
        { phoneNumber, otp },
        { abortEarly: false }
      );

      const removeQuotes = (message) => message.replace(/['"]/g, "");

      if (validationResult.error) {
        // Map over the errors and return the custom messages
        const errors = validationResult.error.details.map((error) => ({
          field: error.path[0], // The name of the field that failed validation
          message: removeQuotes(error.message), // Custom message defined in the Joi schema
        }));

        return {
          status: "error",
          statusCode: 400,
          message: "Validation failed",
          errors,
        };
      }

      const response = await authHelper.verifyOTP(phoneNumber, otp);
      return response;
    },

    // User login resolver
    async loginUser(_, { email, password }) {
      // Validate input
      const { error, value } = loginSchema.validate(
        { email, password },
        { abortEarly: false }
      );

      const fieldErrors = {};

      // Check for validation errors
      if (error) {
        error.details.forEach((curr) => {
          const fieldName = curr.path[0];
          fieldErrors[fieldName] = curr.message;
        });

        return {
          status: false,
          statusCode: 400,
          message: "Validation failed",
          fieldErrors, // Return field-specific errors
          token: null,
          data: null,
        };
      }

      // Authenticate the user
      const response = await authHelper.loginUser(email, password);
      return response;
    },

    async updateProfileImage(_, { userId, profileImage }) {
      try {
        const result = await authHelper.updateUserProfileImage(
          userId,
          profileImage
        );
        return result; // The result will contain status, message, and data
      } catch (error) {
        return {
          status: "error",
          message: "Failed to update profile image",
          data: null,
        };
      }
    },

    updateUserInfo: async (_, args) => {
      const { error, value } = validateUpdateUserInfo.validate(args, {
        abortEarly: false,
      });
      if (error) {
        // Create an array of field errors based on Joi validation
        const fieldErrors = error.details.map((err) => ({
          field: err.context.key,
          message: err.message,
        }));

        return {
          status: false,
          statusCode: 400,
          message: "Validation failed.",
          data: null,
          fieldErrors,
        };
      }

      return await authHelper.updateUserInfoHelper(args);
    },

    updatePassword: async (_, { userId, currentPassword, newPassword }) => {
      const { error } = passwordSchema.validate(
        { currentPassword, newPassword },
        { abortEarly: false }
      );
      if (error) {
        const fieldErrors = error.details.map((err) => ({
          field: err.context.key,
          message: err.message,
        }));

        return {
          status: false,
          statusCode: 400,
          message: "Validation failed",
          fieldErrors,
        };
      }

      return await authHelper.updatePassword(
        userId,
        currentPassword,
        newPassword
      );
    },
  },
};

export default userAuthResolvers;
