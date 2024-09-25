// services/LoginServices/AdminLoginServices.ts

import { useMutation } from '@apollo/client';
import { ADMIN_LOGIN } from '@/graphql/admin-mutations/admin-login'; // Update with the correct path to your mutations file

interface AdminLoginVariables {
  email: string;
  password: string;
}

interface AdminLoginResponse {
  adminLogin: {
    token: string;
    admin: {
      id: string;
      email: string;
      name: string;
    };
  };
}

const useAdminLogin = () => {
  const [adminLogin, { loading, error }] = useMutation<AdminLoginResponse, AdminLoginVariables>(ADMIN_LOGIN);

  
const login = async (email: string, password: string) => {
    try {
      const { data } = await adminLogin({
        variables: { email, password },
      });
  
      if (data) {
        const { token, admin } = data.adminLogin;
        // Store token and admin details (e.g., in localStorage or context)
        localStorage.setItem('token', token);
        // Optionally return the admin details or token
        return { token, admin };
      }
    } catch (err: unknown) { // Type 'err' as 'unknown'
      // Check if 'err' is an instance of 'Error' before accessing 'message'
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      // If 'err' is not an instance of 'Error', throw a generic error
      throw new Error('An unexpected error occurred during login');
    }
  };

  return { login, loading, error };
};

export default useAdminLogin;
