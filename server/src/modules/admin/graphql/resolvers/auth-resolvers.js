import { loginSchema } from '../../../../utils/Joi/admin-login-validation.js';
import AdminHelper from '../../helpers/auth-helper.js';
import Admin from '../../models/admin-models.js'; // Make sure to import your Admin model

const authResolvers = {
  Query: {
    getAdmin: async (_, { id }) => {
      try {
        const admin = await Admin.findByPk(id);
        if (!admin) {
          throw new Error('Admin not found');
        }
        return admin;
      } catch (err) {
        throw new Error('Admin not found');
      }
    },
  },

  Mutation: {
    adminLogin: async (_, { email, password }) => {
      try {
        // Validate input with Joi
        const { error, value } = loginSchema.validate({ email, password }, { abortEarly: false });
    
        console.log(email,password)
        const fieldErrors = {}; // Initialize an object to hold field-specific errors
    
        // Check for validation errors
        if (error) {
          // Extract the error details for the specific fields
          error.details.forEach((curr) => {
            const fieldName = curr.path[0]; // Assuming the field name is in the path
            fieldErrors[fieldName] = curr.message;
          });
        }
    
        console.log(fieldErrors); // This will log all field errors
    
        // If there are field errors, return them immediately
        if (Object.keys(fieldErrors).length > 0) {
          return {
            status: false,
            statusCode: 400,
            message: "Validation failed",
            fieldErrors, // This will contain the specific field errors
            token: null,
            data: null,
          };
        }
    
        // Proceed with actual login logic via AdminHelper
        return await AdminHelper.login(email, password);
      } catch (err) {
        return {
          status: false,
          statusCode: 500,
          message: err.message || "Internal Server Error",
          fieldErrors: null,
          token: null,
          data: null,
        };
      }
    },
  },
};

export default authResolvers;
