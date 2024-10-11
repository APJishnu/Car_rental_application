// src/graphql/resolvers.js
import authHelper from '../../helpers/auth-helper.js';
import User from '../../models/auth-model.js';
import { verifyToken } from '../../../../utils/jwt-helper.js';
import { GraphQLUpload } from 'graphql-upload';

const userAuthResolvers = {
  Upload: GraphQLUpload,

  Query: {
    getUser: async (_, __, { token }) => {
      if (!token) {
        throw new Error('Authorization token is missing');
      }
      
      const decodedToken = verifyToken(token.replace('Bearer ', '')); // Strip "Bearer "

      // Fetch the user based on the token payload
      const user = await User.findByPk(decodedToken.id);

      console.log(decodedToken)

      if (!user) {
        return {
          status: 'error',
          message: 'User not found',
          data: null,
        };
      }

      return {
        status: 'success',
        message: 'User fetched successfully',
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
    async sendOTP(_, { phoneNumber }) {
      const response = await authHelper.sendOTP(phoneNumber);
      return { ...response, data: null }; // Return data as null since no user is created yet
    },

    async registerUser(_, { input }) {
      const response = await authHelper.registerUser(input);
      return response;
    },

    async verifyOTP(_, { phoneNumber, otp }) {
      const response = await authHelper.verifyOTP(phoneNumber, otp);
      return response;
    },


    //user login 
    async loginUser(_, { email, password }) {
      const response = await authHelper.loginUser(email, password);
      return response;
    },


    async updateProfileImage(_, { userId, profileImage }) {
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
