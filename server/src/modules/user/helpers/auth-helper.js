// src/helpers/auth-helper.js
import authRepo from '../repositories/auth-repo.js';
import bcrypt from 'bcrypt';
import User from '../models/auth-model.js'; // Ensure the path is correct
import twilio from 'twilio'; // Make sure to install twilio
import TemporaryOTP from '../models/temp-otp-storage.js'; // Import your model
import { generateToken } from '../../../utils/jwt-helper.js'; // Import the token utility

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN); // Replace with your Twilio credentials

class AuthHelper {
    async sendOTP(phoneNumber) {

        // Check if the user already exists with this phone number
        const existingUser = await authRepo.findByPhoneNumber(phoneNumber);
        if (existingUser) {
            return { status: 'error', message: 'User with this phone number already exists', data: null };
        }


        // Check if an OTP already exists for this phone number
        const existingOTP = await TemporaryOTP.findOne({ where: { phoneNumber } });

        // If OTP exists, delete the old one
        if (existingOTP) {
            await TemporaryOTP.destroy({ where: { phoneNumber } });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit OTP

        // Store OTP in database with an expiry time
        await TemporaryOTP.upsert({
            phoneNumber,
            otp,
            isVerified: false,
        });


        console.log(" otp in send otp ", otp);

        const formatPhoneNumber = (phoneNumber) => {
            if (!phoneNumber.startsWith('+')) {
                return `+91${phoneNumber.replace(/^0+/, '')}`; // Remove leading zeros and add country code
            }
            return phoneNumber;
        };



        const formattedNumber = formatPhoneNumber(phoneNumber);

        // await twilioClient.messages.create({
        //     body: `Your verification code is ${otp}`,
        //     from: process.env.TWILIO_PHONE_NUMBER,
        //     to: formattedNumber,
        // });

        return { status: 'success', message: 'OTP sent successfully', data: null };
    }

    async verifyOTP(phoneNumber, otp) {
        const tempOTP = await TemporaryOTP.findOne({ where: { phoneNumber } });

        // Check if OTP and phone number exist in database
        if (!tempOTP || tempOTP.isVerified) {
            return { status: 'error', message: 'OTP not sent or has expired', data: null };
        }
        // Verify the OTP
        if (tempOTP.otp === otp) {
            // OTP is correct
            await tempOTP.update({ isVerified: true }); // Mark OTP as verified

            return { status: 'success', message: 'Phone verification successful', data: null };
        } else {
            return { status: 'error', message: 'Invalid OTP', data: null };
        }
    }

    async registerUser(input) {
        const { email, password, phoneNumber, firstName, lastName, city, state, country, pincode } = input;


        // Check if the phone number is verified in the TemporaryOTP table
        const tempOTP = await TemporaryOTP.findOne({ where: { phoneNumber } });
        if (!tempOTP || !tempOTP.isVerified) {
            return { status: 'error', message: 'Phone number must be verified before registration', data: null };
        }

        console.log("haii", tempOTP)

        // Check if user already exists
        const existingUser = await authRepo.findByPhoneNumber(phoneNumber);
        if (existingUser) {
            return { status: 'error', message: 'User already exists', data: null };
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

        await TemporaryOTP.destroy({ where: { phoneNumber } });

        return { status: 'success', message: 'Registration completed successfully.', data: newUser };
    }






    async loginUser(email, password) {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return { status: 'fail', message: 'User not found', token: null, data: null };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return { status: 'fail', message: 'Invalid password', token: null, data: null };
        }

        const token = generateToken(user);
        return {
            status: 'success',
            message: 'Login successful',
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


}

export default new AuthHelper();
