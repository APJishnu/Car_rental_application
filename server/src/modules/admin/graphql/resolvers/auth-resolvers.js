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
      console.log('Attempting to log in admin with email:', email);
      try {
        // Find admin by email
        const admin = await AdminHelper.findAdminByEmail(email);
      
        // If admin is not found, throw an error
        if (!admin) {
          throw new Error('Invalid credentials');
        }

        // Validate password
        const isPasswordValid = await AdminHelper.validatePassword(password, admin.password);
        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        // Generate JWT token
        const token = AdminHelper.generateToken(admin.dataValues);


        return {
          token,
          admin: {
            id: admin.dataValues.id,
            name: admin.dataValues.name, // Include name
            email: admin.dataValues.email,
            role: admin.dataValues.role,
            createdAt: admin.dataValues.createdAt,
            updatedAt: admin.dataValues.updatedAt,
          },
        };
      } catch (error) {
        // Log the error for debugging
        console.error('Login error:', error.message);
        throw new Error('Login failed: ' + error.message);
      }
    },
  },
};

export default authResolvers;
