import AdminHelper from '../../helper/admin-helpers/auth-helper.js';

const authResolvers = {
  Query: {
    getAdmin: async (_, { id }) => {
      try {
        return await Admin.findByPk(id);
      } catch (err) {
        throw new Error('Admin not found');
      }
    },
  },

  Mutation: {
    adminLogin: async (_, { email, password }) => {
      try {
        // Find admin by email
        const admin = await AdminHelper.findAdminByEmail(email);

        // Validate password
        const isPasswordValid = await AdminHelper.validatePassword(password, admin.password);
        if (!isPasswordValid) throw new Error('Invalid credentials');

        // Generate JWT token
        const token = AdminHelper.generateToken(admin);

        return {
          token,
          admin: {
            id: admin.id,
            name: admin.name, // Include name
            email: admin.email,
            role: admin.role,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
          },
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

export default authResolvers;
