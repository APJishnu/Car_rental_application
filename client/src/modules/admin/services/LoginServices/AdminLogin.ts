import { useMutation } from '@apollo/client';
import { ADMIN_LOGIN } from '@/graphql/admin-mutations/admin-login';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface AdminLoginVariables {
  email: string;
  password: string;
}

interface AdminLoginResponse {
  adminLogin: {
    status: boolean;
    statusCode: number;
    message: string;
    token: string;
    fieldErrors?: {
      email?: string;
      password?: string;
    };
    data: {
      admin: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
    };
  };
}

const useAdminLogin = () => {
  const router = useRouter();
  const [adminLogin] = useMutation<AdminLoginResponse, AdminLoginVariables>(ADMIN_LOGIN);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await adminLogin({
        variables: { email, password },
      });


      if (data?.adminLogin.statusCode === 200) {
        const { token, data: { admin } } = data.adminLogin;

        Cookies.set('adminToken', token, { expires: 1 / 24 }); // Store token for 1 hour
        return { token, admin };
      } else if (data?.adminLogin.fieldErrors) {
        throw {
          response: {
            fieldErrors: data.adminLogin.fieldErrors, // Return field-specific errors
          },
        };
      } else {
        throw new Error(data?.adminLogin.message || 'Login failed');
      }
    } catch (err: any) {
      if (err.response?.fieldErrors) {
        throw err; // Field errors will be handled by the form
      } else if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error('An unexpected error occurred during login');
    }
  };

  return { login };
};

export default useAdminLogin;
