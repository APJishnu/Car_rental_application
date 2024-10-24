
// components/StepOneForm.tsx
"use client";
import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useMutation } from '@apollo/client';
import { SEND_OTP } from '../../../../graphql/user/registration-mutations';
import styles from './Registration.module.css';
import { FormData, FieldError } from '../../../../interfaces/user-interfaces/types';

interface StepOneFormProps {
  next: () => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export const StepOneForm: React.FC<StepOneFormProps> = ({ next, setFormData }) => {
  const [form] = Form.useForm();
  const [sendOTP] = useMutation(SEND_OTP);

  const onFinish = async (values: any) => {
    try {
      const { data } = await sendOTP({
        variables: {
          firstName: values.firstName,
          lastName: values.lastName,
          phoneNumber: values.phoneNumber,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        },
      });

      if (data.sendOTP.status === "success") {
        setFormData((prevData) => ({ ...prevData, ...values }));
        message.success(data.sendOTP.message);
        next();
      } else {
        form.setFields([
            { name: "firstName", errors: [] },
            { name: "lastName", errors: [] },
            { name: "phoneNumber", errors: [] },
            { name: "email", errors: [] },
            { name: "password", errors: [] },
            { name: "confirmPassword", errors: [] },
            
          ]);
        if(!data.sendOTP.errors){
            message.error(data.sendOTP.message);
        }
        handleErrors(data.sendOTP.errors, form);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      message.error("An unexpected error occurred. Please try again later.");
    }
  };

  const handleErrors = (errors: FieldError[], form: any) => {
    if (errors && Array.isArray(errors)) {
      const errorObj: { [key: string]: string } = {};
      errors.forEach((error: FieldError) => {
        errorObj[error.field] = error.message;
      });
      form.setFields(
        Object.entries(errorObj).map(([field, error]) => ({
          name: field,
          errors: [error],
        }))
      );
    }
  };



  return (
    <Form
      form={form}
      name="basicRegistration"
      onFinish={onFinish}
      layout="vertical"
      className={styles.form}
      preserve={true}
    >
      <p className={styles.title}>Register</p>
      <p className={styles.message}>Signup now to get full access.</p>

      <div className={styles.flex}>
        <div className={styles.inputContainer}>
          <Form.Item name="firstName">
            <Input className={styles.input} placeholder="Firstname" />
          </Form.Item>
        </div>

        <div className={styles.inputContainer}>
          <Form.Item name="lastName">
            <Input className={styles.input} placeholder="Lastname" />
          </Form.Item>
        </div>
      </div>

      <div className={styles.inputContainer}>
        <Form.Item name="phoneNumber">
          <Input className={styles.input} placeholder="Phone Number" />
        </Form.Item>
      </div>

      <div className={styles.inputContainer}>
        <Form.Item name="email">
          <Input className={styles.input} placeholder="Email" />
        </Form.Item>
      </div>

      <div className={styles.inputContainer}>
        <Form.Item name="password">
          <Input.Password className={styles.input} placeholder="Password" />
        </Form.Item>
      </div>

      <div className={styles.inputContainer}>
        <Form.Item name="confirmPassword">
          <Input.Password className={styles.input} placeholder="Confirm password" />
        </Form.Item>
      </div>

      <Form.Item>
        <Button className={styles.submit} type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>

      <p className={styles.signin}>
        Already have an account? <a href="/user/user-login">Signin</a>
      </p>
    </Form>
  );
};