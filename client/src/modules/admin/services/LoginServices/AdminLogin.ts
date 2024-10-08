// services/LoginServices/AdminLoginServices.ts

import { useMutation } from '@apollo/client';
import { ADMIN_LOGIN } from '@/graphql/admin-mutations/admin-login'; // Update with the correct path to your mutations file
import Cookies from 'js-cookie'; // Import js-cookie
import {useRouter} from 'next/navigation'

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
  const router = useRouter()
  const [adminLogin, { loading, error }] = useMutation<AdminLoginResponse, AdminLoginVariables>(ADMIN_LOGIN);


  const login = async (email: string, password: string) => {
    try {
      const { data } = await adminLogin({
        variables: { email, password },
      });

      if (data) {
        const { token, admin } = data.adminLogin;

        

        Cookies.set('adminToken', token, { expires: 1 / 24 }); // Store token for 1 hour
       

        return { token, admin };
      }
    } catch (err: unknown) {

      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error('An unexpected error occurred during login');
    }
  };

  return { login, loading, error };
};

export default useAdminLogin;
