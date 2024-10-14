// components/LoginForm.tsx

"use client";

import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { gql, useMutation } from "@apollo/client";
import styles from './LoginForm.module.css';
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie'; // Import js-cookie

// GraphQL Mutation to log in
const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      status
      message
      token 
      data {
        id
        firstName
        lastName
        email
        phoneNumber
      }
    }
  }
`;

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [loginUser] = useMutation(LOGIN_USER);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { data } = await loginUser({ variables: { email: values.email, password: values.password } });

      if (data.loginUser.status === "success") {
        message.success(data.loginUser.message);
        
        const token = data.loginUser.token;
        Cookies.set("userToken", token, { expires: 1 / 24 }); 
        

 
        window.history.back();


      } else {
        message.error(data.loginUser.message);
      }
    } catch (error) {
      message.error("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Form
        name="loginForm"
        onFinish={onFinish}
        layout="vertical"
        className={styles.form}
      >
        <p className={styles.title}>Login</p>
        <p className={styles.message}>Welcome back! Please log in to your account.</p>

        <Form.Item
          name="email"
          rules={[ 
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input className={styles.input} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password className={styles.input} placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button className={styles.submit} type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form.Item>

        <p className={styles.signup}>
          Don’t have an account? <a href="/register">Sign up</a>
        </p>
      </Form>
    </div>
  );
};

export default LoginForm;
