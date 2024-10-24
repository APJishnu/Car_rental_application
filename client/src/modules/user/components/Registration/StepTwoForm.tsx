// components/StepTwoForm.tsx
"use client";
import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useMutation } from '@apollo/client';
import { SEND_OTP, VERIFY_OTP } from '../../../../graphql/user/registration-mutations';
import styles from './Registration.module.css';
import { FormData, FieldError } from '../../../../interfaces/user-interfaces/types';

interface StepTwoFormProps {
  next: () => void;
  prev: () => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export const StepTwoForm: React.FC<StepTwoFormProps> = ({
  next,
  prev,
  formData,
  setFormData,
}) => {
  const [form] = Form.useForm();
  const [timer, setTimer] = React.useState(60);
  const [resendDisabled, setResendDisabled] = React.useState(true);
  const [verifying, setVerifying] = React.useState(false);
  const [sendOTP] = useMutation(SEND_OTP);
  const [verifyOTP] = useMutation(VERIFY_OTP);

  React.useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdownInterval);
          setResendDisabled(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  const handleResendOTP = async () => {
    try {
      const { data } = await sendOTP({
        variables: { phoneNumber: formData.phoneNumber },
      });

      if (data.sendOTP.status === "success") {
        message.success("OTP resent successfully.");
        setTimer(60);
        setResendDisabled(true);
      } else {
        message.error(data.sendOTP.message);
      }
    } catch (error) {
      message.error("Failed to resend OTP.");
    }
  };

  const handleErrors = (errors: FieldError[], form: any) => {
    if (errors && Array.isArray(errors)) {
      const errorObj: { [key: string]: string } = {};
      errors.forEach((error: FieldError) => {
        errorObj[error.field] = error.message;
      });

      console.log("hai",errorObj)
      form.setFields(
        Object.entries(errorObj).map(([field, error]) => ({
          name: field,
          errors: [error],
        }))
      );
    }
  };

  
  const onFinish = async (values: { otp: string }) => {
    try {
      setVerifying(true);

      const { data } = await verifyOTP({
        variables: {
          phoneNumber: formData.phoneNumber || null,
          otp: values?.otp || null,
        },
      });

      if (data.verifyOTP.status === "success") {
        message.success(data.verifyOTP.message);
        if (data.verifyOTP.data) {
          setFormData((prev) => ({
            ...prev,
            isPhoneVerified: data.verifyOTP.data.isPhoneVerified,
            phoneVerifiedAt: data.verifyOTP.data.phoneVerifiedAt,
          }));
        }
        next();
      } else {

        console.log(data.verifyOTP.errors,"hai")
        if(!data.verifyOTP.errors){
            message.error(data.verifyOTP.message || "Failed to verify OTP");
        }
        handleErrors(data.verifyOTP.errors, form);
      }
    } catch (error: any) {
      message.error(error.message || "Failed to verify OTP");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Form
      form={form}
      name="phoneVerification"
      onFinish={onFinish}
      layout="vertical"
      className={styles.form}
    >
      <p className={styles.title}>Phone Verification</p>
      <p className={styles.message}>
        Please enter the 6-digit OTP sent to {formData.phoneNumber}
      </p>

      <div className={styles.inputContainer}>
        <Form.Item name="otp">
          <Input
            className={styles.input}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            disabled={verifying}
          />
        </Form.Item>
      </div>

      <Form.Item>
        <Button
          className={styles.submit}
          type="primary"
          htmlType="submit"
          loading={verifying}
          disabled={verifying}
        >
          {verifying ? "Verifying..." : "Verify OTP"}
        </Button>
      </Form.Item>

      <div className={styles.actionButtons}>
        <Button
          className={`${styles.submit} ${styles.resendButton}`}
          onClick={handleResendOTP}
          disabled={resendDisabled || verifying}
        >
          {resendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
        </Button>

        <Button onClick={prev} className={styles.submit} disabled={verifying}>
          Go Back
        </Button>
      </div>
    </Form>
  );
};
