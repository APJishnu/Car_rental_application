// src/graphql/resolvers.js
import authHelper from "../../helpers/auth-helper.js";
import User from "../../models/auth-model.js";
import { verifyToken } from "../../../../utils/jwt-helper.js";
import { GraphQLUpload } from "graphql-upload";
import {
    additionalDetailsSchema,
    otpValidationSchema,
    sendOtpValidationSchema,
} from "../../../../utils/registration-validation.js";
import { loginSchema } from "../../../../utils/Joi/admin-login-validation.js";

const userAuthResolvers = {
    Upload: GraphQLUpload,

    Query: {
        getUser: async (_, __, { token }) => {
            if (!token) {
                throw new Error("Authorization token is missing");
            }

            const decodedToken = verifyToken(token.replace("Bearer ", "")); // Strip "Bearer "
            const user = await User.findByPk(decodedToken.id);

            console.log(decodedToken);

            if (!user) {
                return {
                    status: "error",
                    message: "User not found",
                    data: null,
                };
            }

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
        },
    },

    Mutation: {
        async sendOTP(_, { firstName, lastName, phoneNumber, email, password, confirmPassword }) {
            try {
                if (phoneNumber && !firstName && !lastName && !email && !password && !confirmPassword) {
                    const response = await authHelper.sendOTP(phoneNumber);
                    // Return the response from sending OTP
                    return { ...response, data: null };
                }

                // Validate inputs
                const { error } = sendOtpValidationSchema.validate(
                    { firstName, lastName, phoneNumber, email, password, confirmPassword },
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

                console.log(validationErrors); // For debugging purposes

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
                console.error("Error in sendOTP:", error); // Log the error for debugging
                return {
                    status: "error",
                    message: "An unexpected error occurred while sending OTP.",
                    errors: [], // No specific errors to return in this case
                    data: null,
                };
            }
        },


        async registerUser(_, { input }) {
            console.log("hai", input);

            // Validate additional details using Joi
            const validationResult = additionalDetailsSchema.validate(input.additionalDetails, { abortEarly: false });

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

                console.log(errors);
                return {
                    status: "error",
                    statusCode: 400,
                    message: "Validation failed",
                    errors,
                };
            }

            const response = await authHelper.verifyOTP(phoneNumber, otp);
            console.log(response);
            return response;
        },


        // User login resolver
        async loginUser(_, { email, password }) {
            console.log(email);

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

                console.log("fieldErrors", fieldErrors); // Log field errors for debugging

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
            console.log(profileImage, "file in update profile");

            try {
                const result = await authHelper.updateUserProfileImage(userId, profileImage);
                return result; // The result will contain status, message, and data
            } catch (error) {
                console.error("Error updating profile image:", error.message);
                return {
                    status: "error",
                    message: "Failed to update profile image",
                    data: null,
                };
            }
        },
    },
};

export default userAuthResolvers;
