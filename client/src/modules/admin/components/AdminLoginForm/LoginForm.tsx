"use client";

import React, { useState } from "react";
import useAdminLogin from "../../services/LoginServices/AdminLogin";
import Input from "@/themes/InputField/InputField";
import Button from "@/themes/Button/Button";
import { Spin } from "antd";
import {
  LoadingOutlined,
  UserOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import styles from "./LoginForm.module.css";
import { useRouter } from "next/navigation";

interface LoginFormState {
  email: string;
  password: string;
}

interface FieldErrors {
  email?: string;
  password?: string;
}

const loadingIcon = (
  <LoadingOutlined style={{ fontSize: 24, color: "white" }} spin />
);

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<LoginFormState["email"]>("");
  const [password, setPassword] = useState<LoginFormState["password"]>("");
  const [loginError, setLoginError] = useState<string>(""); // General error for login failure
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({}); // Field-specific errors
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { login } = useAdminLogin();
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");
    setFieldErrors({}); // Clear field errors on new submission
    setLoading(true);

    try {
      await login(email, password);
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1000);
    } catch (err: any) {
      if (err.response?.fieldErrors) {
        setFieldErrors(err.response.fieldErrors); // Set field-specific errors
      } else if (err instanceof Error) {
        setLoginError(err.message); // General error
      } else {
        setLoginError("An unexpected error occurred during login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.mainContainer}>
      {loading && (
        <div className={styles.loadingOverlay}>
          <Spin size="large" />
        </div>
      )}
      <div className={styles.container}>
        <h2 className={styles.heading}>ADMIN LOGIN</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <UserOutlined className={styles.icon} />
            <Input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <p className={styles.error}>
            {" "}
            <span>{fieldErrors.email}</span>
          </p>{" "}
          {/* Show email error */}
          <div className={styles.inputGroup}>
            <LockOutlined className={styles.icon} />
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className={styles.eyeIcon}
            >
              {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </span>
          </div>
          <p className={styles.error}>
            <span>{fieldErrors.password}</span>
          </p>{" "}
          {/* Show password error */}
          {loginError && <p className={styles.error}>{loginError}</p>}{" "}
          {/* Show general error */}
          <Button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? loadingIcon : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
