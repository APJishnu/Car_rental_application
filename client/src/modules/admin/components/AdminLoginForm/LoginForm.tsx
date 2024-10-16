"use client";

import React, { useState } from 'react';
import useAdminLogin from '../../services/LoginServices/AdminLogin';
import Input from '@/themes/InputField/InputField'; 
import Button from '@/themes/Button/Button'; 
import { Spin } from 'antd'; // Import Spin from antd
import { LoadingOutlined } from '@ant-design/icons'; // Import LoadingOutlined icon
import styles from './LoginForm.module.css';
import { useRouter } from 'next/navigation'; 

// Define the type for your form state and error message
interface LoginFormState {
  email: string;
  password: string;
}

// Custom loading indicator styled as white
const loadingIcon = <LoadingOutlined style={{ fontSize: 24, color: 'white' }} spin />;

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<LoginFormState['email']>('');
  const [password, setPassword] = useState<LoginFormState['password']>('');
  const [loginError, setLoginError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); // Local loading state

  const { login } = useAdminLogin();
  const router = useRouter(); // Initialize router

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(''); // Reset error
    setLoading(true); // Set loading to true

    try {
      await login(email, password);
      // Wait for 1 second before navigating
      setTimeout(() => {
        router.push('/admin/dashboard'); // Navigate to dashboard after login
      }, 1000);

      console.log('Logged in successfully');
    } catch (err) {
      if (err instanceof Error) {
        setLoginError(err.message);
      } else {
        setLoginError('An unexpected error occurred during login.');
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Admin Login</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          {loginError && <p className={styles.error}>{loginError}</p>}
          <Button type="submit" className={styles.loginButton} disabled={loading}>
            {loading ? loadingIcon : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;  
