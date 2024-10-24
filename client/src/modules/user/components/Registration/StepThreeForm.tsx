// components/StepThreeForm.tsx
"use client";
import React, { useRef } from "react";
import { Form, Input, Button, message } from "antd";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "../../../../graphql/user/registration-mutations";
import { useRouter } from "next/navigation";
import styles from "./Registration.module.css";
import { FormData } from "../../../../interfaces/user-interfaces/types";

interface StepThreeFormProps {
  prev: () => void;
  formData: FormData;
}

export const StepThreeForm: React.FC<StepThreeFormProps> = ({
  prev,
  formData,
}) => {
  const router = useRouter();
  const [registerUser] = useMutation(REGISTER_USER);
  const [form] = Form.useForm(); // Use the Ant Design form instance

  const onFinish = async (values: any) => {
    const inputData = { ...formData, additionalDetails: values }; // Adjust the structure to include additionalDetails

    try {
      const { data } = await registerUser({ variables: { input: inputData } });

      if (data.registerUser.status === "success") {
        message.success(data.registerUser.message);
        router.push("/user/user-login");
      } else {
        // Clear previous field errors
        form.setFields([
          { name: "city", errors: [] },
          { name: "state", errors: [] },
          { name: "country", errors: [] },
          { name: "pincode", errors: [] },
        ]);

        // Check for backend validation errors
        if (data.registerUser.errors) {
          const fieldErrors = data.registerUser.errors.map(
            (error: { field: string; message: string }) => ({
              name: error.field, // Get the field name from the error object
              errors: [error.message], // Set the error message
            })
          );

          // Set field errors using setFields
          form.setFields(fieldErrors);
        } else {
          message.error(data.registerUser.message); // Fallback error message
        }
      }
    } catch (error) {
      message.error("Registration failed. Please try again.");
    }
  };

  return (
    <Form
      form={form} // Bind the form instance
      name="additionalDetails"
      onFinish={onFinish}
      layout="vertical"
      className={styles.form}
    >
      <p className={styles.title}>Additional Details</p>
      <p className={styles.message}>Fill in your address information.</p>

      <Form.Item name="city">
        <Input className={styles.input} placeholder="City" />
      </Form.Item>

      <Form.Item name="state">
        <Input className={styles.input} placeholder="State" />
      </Form.Item>

      <Form.Item name="country">
        <Input className={styles.input} placeholder="Country" />
      </Form.Item>

      <Form.Item name="pincode">
        <Input className={styles.input} placeholder="Pincode" maxLength={6} />
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
