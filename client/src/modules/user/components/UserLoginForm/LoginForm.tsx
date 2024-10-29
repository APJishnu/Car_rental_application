"use client";

import React, { useState } from "react";
import { Form, Input, message } from "antd";
import Button from "../../../../themes/Button/Button";
import { gql, useMutation } from "@apollo/client";
import styles from "./LoginForm.module.css";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

// GraphQL Mutation to log in
const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      status
      statusCode
      message
      token
      data {
        id
        firstName
        lastName
        email
        phoneNumber
      }
      fieldErrors {
        email
        password
      }
    }
  }
`;

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // Create a form instance for error handling
  const router = useRouter();
  const [loginUser] = useMutation(LOGIN_USER);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      // Log submitted values before handling empty fields

      // Default to empty strings if values are undefined
      const email = values.email || '';
      const password = values.password || '';

      const { data } = await loginUser({ variables: { email, password } });

      if (data.loginUser.status) {
        message.success(data.loginUser.message);
        const token = data.loginUser.token;
        Cookies.set("userToken", token, { expires: 1 / 24 });
        window.history.back();
      } else {
        // Show backend validation errors
        message.error(data.loginUser.message);

        // If there are field errors, set them in the form
        if (data.loginUser.fieldErrors) {
          form.setFields([
            {
              name: 'email',
              errors: [data.loginUser.fieldErrors.email],
            },
            {
              name: 'password',
              errors: [data.loginUser.fieldErrors.password],
            },
          ]);
        }
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
        form={form} // Link the form instance
        name="loginForm"
        onFinish={onFinish}
        layout="vertical"
        className={styles.form}
      >
        <p className={styles.title}>Login</p>
        <p className={styles.message}>
          Welcome back! Please log in to your account.
        </p>

        <Form.Item
          name="email" // Field name for email
        >
          <Input className={styles.input} placeholder="Email" />
        </Form.Item>
    
        <Form.Item
          name="password" // Field name for password
        >
          <Input.Password className={styles.input} placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button className={styles.submit} type="submit" loading={loading}>
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
