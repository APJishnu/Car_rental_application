"use client";

import React, { useState } from "react";
import { Form, Input, Button, Steps, message } from "antd";
import { gql, useMutation } from '@apollo/client'; // Import useMutation from Apollo Client
import styles from './Registration.module.css'; // Import your CSS module
import { useRouter } from 'next/navigation';

const { Step } = Steps;

interface FormData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}


// GraphQL mutations
const SEND_OTP = gql`
  mutation SendOTP($phoneNumber: String!) {
    sendOTP(phoneNumber: $phoneNumber) {
      status
      message
      data
    }
  }
`;

const VERIFY_OTP = gql`
  mutation VerifyOTP($phoneNumber: String!, $otp: String!) {
    verifyOTP(phoneNumber: $phoneNumber, otp: $otp) {
      status
      message
      data {
        id
        firstName
        lastName
        phoneNumber
        email
        isPhoneVerified
        phoneVerifiedAt
        city
        state
        country
        pincode
      }
    }
  }
`;

const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterInput!) {
    registerUser(input: $input) {
      status
      message
      data {
        id
        firstName
        lastName
        phoneNumber
        email
        isPhoneVerified
        phoneVerifiedAt
        city
        state
        country
        pincode
      }
    }
  }
`;

const RegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0); // Manage the current step
  const [formData, setFormData] = useState<FormData>({}); // Store form data across steps

  const router = useRouter();  // Use the Next.js router
  // Mutations
  const [sendOTP] = useMutation(SEND_OTP);
  const [verifyOTP] = useMutation(VERIFY_OTP);
  const [registerUser] = useMutation(REGISTER_USER);


  // Function to go to the next step
  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  // Function to go back to the previous step
  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const StepOneForm = () => {
    const onFinish = async (values: FormData) => {
      setFormData((prevData) => ({ ...prevData, ...values }));

      console.log(formData)

      try {
        // Call sendOTP mutation
        const { data } = await sendOTP({ variables: { phoneNumber: values.phoneNumber } });

        if (data.sendOTP.status === 'success') {
          message.success(data.sendOTP.message);
          next(); // Proceed to the next step if OTP is sent successfully
        } else {
          message.error(data.sendOTP.message); // Display error message if OTP send fails
        }
      } catch (error) {
        message.error("An error occurred while sending OTP."); // Handle any unexpected errors
      }
    };

    return (
      <Form
        name="basicRegistration"
        onFinish={onFinish}
        layout="vertical"
        className={styles.form}
      >
        <p className={styles.title}>Register</p>
        <p className={styles.message}>Signup now to get full access.</p>

        <div className={styles.flex}>
          <Form.Item
            name="firstName"
            rules={[{ required: true, message: "Please input your first name!" }]}
          >
            <Input
              className={styles.input}
              placeholder="Firstname"
              required
            />
          </Form.Item>

          <Form.Item
            name="lastName"
            rules={[{ required: true, message: "Please input your last name!" }]}
          >
            <Input
              className={styles.input}
              placeholder="Lastname"
              required
            />
          </Form.Item>
        </div>

        <Form.Item
          name="phoneNumber"
          rules={[
            { required: true, message: "Please input your phone number!" },
            { pattern: /^[0-9]{10}$/, message: "Please enter a valid 10-digit phone number!" }
          ]}
        >
          <Input
            className={styles.input}
            placeholder="Phone Number"
            required
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input
            className={styles.input}
            placeholder="Email"
            required
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            className={styles.input}
            placeholder="Password"
            required
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("The two passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password
            className={styles.input}
            placeholder="Confirm password"
            required
          />
        </Form.Item>

        <Form.Item>
          <Button className={styles.submit} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>

        <p className={styles.signin}>
          Already have an account? <a href="#">Signin</a>
        </p>
      </Form>
    );
  };


  // Step 2: Phone Verification Form (OTP)
  const StepTwoForm = () => {

    const [timer, setTimer] = useState(60); // Initialize timer with 60 seconds
    const [resendDisabled, setResendDisabled] = useState(true); // Disable resend button initially
    let countdownInterval: any = null; // Declare a variable for the countdown interval


    // Start the countdown when Step 2 is rendered
    const startCountdown = () => {
      // Clear any existing intervals
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }

      // Start a new countdown
      countdownInterval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(countdownInterval); // Stop countdown at 0
            setResendDisabled(false); // Enable resend button when countdown ends
            return 0;
          }
          return prevTimer - 1; // Decrease timer by 1 second
        });
      }, 1000);
    };

    // Reset timer and resend state when OTP is resent
    const handleResendOTP = async () => {
      try {
        const { data } = await sendOTP({
          variables: { phoneNumber: formData.phoneNumber },
        });

        if (data.sendOTP.status === "success") {
          message.success("OTP resent successfully.");
          setTimer(60); // Reset the timer
          setResendDisabled(true); // Disable resend button
          startCountdown(); // Start countdown again
        } else {
          message.error(data.sendOTP.message);
        }
      } catch (error) {
        message.error("Failed to resend OTP.");
      }
    };

    // Start the countdown when entering Step 2
    React.useLayoutEffect(() => {
      startCountdown(); // Begin countdown when StepTwoForm is rendered

      // Cleanup interval when component is unmounted or navigating away
      return () => clearInterval(countdownInterval);
    }, []);

    const onFinish = async (values: any) => {
      // Call verifyOTP mutation
      const { data } = await verifyOTP({ variables: { phoneNumber: formData.phoneNumber, otp: values.otp } });

      if (data.verifyOTP.status === 'success') {
        message.success(data.verifyOTP.message);
        next(); // Proceed to the next step
      } else {
        message.error(data.verifyOTP.message);
      }
    };



    return (
      <Form
        name="phoneVerification"
        onFinish={onFinish}
        layout="vertical"
        className={styles.form}
      >
        <p className={styles.title}>Phone Verification</p>
        <p className={styles.message}>Please enter the 4-digit OTP sent to your phone.</p>

        <Form.Item
          name="otp"
          rules={[
            { required: true, message: "Please input the OTP!" },
            { pattern: /^[0-9]{4}$/, message: "Please enter a valid 4-digit OTP!" },
          ]}
        >
          <Input className={styles.input} placeholder="4-digit OTP" maxLength={4} required />
        </Form.Item>

        <Form.Item>
          <Button className={styles.submit} type="primary" htmlType="submit">
            Verify
          </Button>
        </Form.Item>

        {/* Resend OTP Button */}
        <Button
          className={styles.submit}
          onClick={handleResendOTP}
          disabled={resendDisabled}
        >
          {resendDisabled
            ? `Resend OTP in ${timer} seconds`
            : "Resend OTP"}
        </Button>

        <Button onClick={prev} className={styles.submit}>
          Go Back
        </Button>
      </Form>
    );
  };

  // Step 3: Additional Details Form
  const StepThreeForm = () => {
    const onFinish = async (values: any) => {
      const inputData = { ...formData, ...values }; // Combine all form data

      // Call registerUser mutation
      const { data } = await registerUser({ variables: { input: inputData } });

      if (data.registerUser.status === 'success') {
        message.success(data.registerUser.message);

        router.push('/');  // This will redirect to the home page
      } else {
        message.error(data.registerUser.message);
      }
    };

    return (
      <Form
        name="additionalDetails"
        onFinish={onFinish}
        layout="vertical"
        className={styles.form}
      >
        <p className={styles.title}>Additional Details</p>
        <p className={styles.message}>Fill in your address information.</p>

        <Form.Item
          name="city"
          rules={[{ required: true, message: "Please input your city!" }]}
        >
          <Input className={styles.input} placeholder="City" required />
        </Form.Item>

        <Form.Item
          name="state"
          rules={[{ required: true, message: "Please input your state!" }]}
        >
          <Input className={styles.input} placeholder="State" required />
        </Form.Item>

        <Form.Item
          name="country"
          rules={[{ required: true, message: "Please input your country!" }]}
        >
          <Input className={styles.input} placeholder="Country" required />
        </Form.Item>

        <Form.Item
          name="pincode"
          rules={[
            { required: true, message: "Please input your pincode!" },
            { pattern: /^[0-9]{6}$/, message: "Please enter a valid 6-digit pincode!" },
          ]}
        >
          <Input className={styles.input} placeholder="Pincode" maxLength={6} required />
        </Form.Item>

        <Form.Item>
          <Button className={styles.submit} type="primary" htmlType="submit">
            Complete Registration
          </Button>
        </Form.Item>

        <Button onClick={prev} className={styles.submit}>
          Go Back
        </Button>
      </Form>
    );
  };

  return (
    <div className={styles.container}>
      <Steps current={currentStep}>
        <Step title="Basic Info" />
        <Step title="Verify Phone" />
        <Step title="Additional Info" />
      </Steps>

      {currentStep === 0 && <StepOneForm />}
      {currentStep === 1 && <StepTwoForm />}
      {currentStep === 2 && <StepThreeForm />}
    </div>
  );
};

export default RegistrationForm;
