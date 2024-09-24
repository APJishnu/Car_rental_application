"use client";

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADMIN_LOGIN } from '@/graphql/admin-mutations/admin-login'; // Update with the correct path to your mutations file
import Input from '@/themes/InputField/InputField'; // Update with the correct path to your Input component
import Button from '@/themes/Button/Button'; // Update with the correct path to your Button component
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [adminLogin] = useMutation(ADMIN_LOGIN, {
    onCompleted: (data) => {
      const { token, admin } = data.adminLogin;
      // Store token and admin details (e.g., in localStorage or context)
      localStorage.setItem('token', token);
      // Redirect or update the state to indicate successful login
      console.log('Logged in:', admin);
    },
    onError: (error) => {
      setLoginError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(''); // Reset error

    adminLogin({ variables: { email, password } });
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
        <Button type="submit" className={styles.loginButton}>
          Login
        </Button>
      </form>
    </div>
    </div>
  );
};

export default LoginForm;
