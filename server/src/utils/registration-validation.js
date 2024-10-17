import Joi from 'joi';

// Define the validation schema for the registration form
export const sendOtpValidationSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.base': 'First name must be a string.',
      'string.empty': 'First name is required.',
      'string.min': 'First name must be at least 1 character long.',
      'string.max': 'First name must be less than or equal to 50 characters long.',
    }),
  
  lastName: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.base': 'Last name must be a string.',
      'string.empty': 'Last name is required.',
      'string.min': 'Last name must be at least 1 character long.',
      'string.max': 'Last name must be less than or equal to 50 characters long.',
    }),

  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10}$/) // Regex for a 10-digit phone number
    .required()
    .messages({
      'string.base': 'Phone number must be a string.',
      'string.empty': 'Phone number is required.',
      'string.pattern.base': 'Phone number must be a valid 10-digit number.',
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'Email must be a string.',
      'string.empty': 'Email is required.',
      'string.email': 'Email must be a valid email address.',
    }),

  password: Joi.string()
    .min(6) // Minimum length for the password
    .max(100)
    .required()
    .messages({
      'string.base': 'Password must be a string.',
      'string.empty': 'Password is required.',
      'string.min': 'Password must be at least 6 characters long.',
      'string.max': 'Password must be less than or equal to 100 characters long.',
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref('password')) // Ensure this matches the password
    .required()
    .messages({
      'any.only': 'Confirm password must match the password.',
      'string.empty': 'Confirm password is required.',
    }),
});