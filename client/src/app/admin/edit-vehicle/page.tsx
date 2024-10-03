
"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useSearchParams, useRouter } from "next/navigation";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import styles from "./page.module.css"

// GraphQL queries
const GET_VEHICLE_BY_ID = gql`
  query GetVehicleById($id: String!) {
    getVehicleById(id: $id) {
      id
      name
      description
      
      quantity
      year
      primaryImageUrl
      otherImageUrls
    }
  }
`;

const UPDATE_VEHICLE = gql`
  mutation UpdateVehicle($id: String!, $input: EditVehicleInput!) {
    updateVehicle(id: $id, input: $input) {
      id
      name
      description
      quantity
      year
      primaryImageUrl
      otherImageUrls
    }
  }
`;

const VehicleEditPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("vehicle");

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]); // Primary image
  const [otherFiles, setOtherFiles] = useState<any[]>([]); // For multiple other images

  // Fetch vehicle details by ID
  const { loading, error, data } = useQuery(GET_VEHICLE_BY_ID, {
    variables: { id },
    skip: !id,
  });


  console.log(data)
  // Update vehicle mutation
  const [updateVehicle] = useMutation(UPDATE_VEHICLE, {
    onCompleted: () => {
      Swal.fire("Success", "Vehicle updated successfully", "success");
      router.push("/admin/vehicles-list"); // Redirect after updating
    },
    onError: (err) => {
      console.error("Error updating vehicle:", err);
      Swal.fire("Error!", err.message, "error");
    },
  });

  useEffect(() => {
    if (data?.getVehicleById) {
      form.setFieldsValue(data.getVehicleById);
      if (data.getVehicleById.primaryImageUrl) {
        setFileList([{ url: data.getVehicleById.primaryImageUrl }]);
      }
      if (data.getVehicleById.otherImageUrls) {
        setOtherFiles(data.getVehicleById.otherImageUrls.map((url: string, index: number) => ({ url, uid: index.toString() })));
      }
    }
  }, [data, form]);

  // Handle form submission
  const handleFinish = (values: any) => {
    const primaryImage = fileList.length > 0 ? fileList[0].originFileObj : null; // Get the primary file

    const updatedValues = {
      ...values,
      primaryImage, // Pass the file directly to the input
      otherImages: otherFiles.map((file) => file.originFileObj || file.url), // Keep original images or newly added files
    };

    updateVehicle({
      variables: {
        id,
        input: updatedValues,
      },
    });
  };

  // Handle primary image upload (limit to 1)
  const handlePrimaryFileChange = (info: any) => {
    const newFileList = info.fileList.slice(-1); // Restrict to 1 file
    if (newFileList.length > 1) {
      Swal.fire("Error", "Only one primary image can be uploaded.", "warning");
    } else {
      setFileList(newFileList);
    }
  };

  // Handle multiple image uploads (limit to 3)
  const handleOtherFileChange = (info: any) => {
    const newFileList = info.fileList.slice(0, 3); // Restrict to 3 files
    if (newFileList.length > 3) {
      Swal.fire("Error", "You can only upload up to 3 additional images.", "warning");
    } else {
      setOtherFiles(newFileList);
    }
  };

  if (loading) return <p>Loading vehicle data...</p>;
  if (error) return <p>Error loading vehicle data: {error.message}</p>;

  return (
    <div className={styles.mainDiv}>
      <h1>Edit Vehicle</h1>
      <Form form={form} onFinish={handleFinish} layout="vertical" className={styles.form}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input placeholder="Enter vehicle name" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} placeholder="Enter vehicle description" />
        </Form.Item>

        <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
          <Input placeholder="Enter quantity" />
        </Form.Item>

        <Form.Item name="year" label="Year" rules={[{ required: true }]}>
          <Input placeholder="Enter year of manufacture" />
        </Form.Item>

        {/* File Upload for Primary Image */}
        <Form.Item label="Primary Image">
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={handlePrimaryFileChange}
            beforeUpload={() => false} // Prevent automatic upload
            maxCount={1} // Restrict to one image
          >
            <Button icon={<UploadOutlined />}>Upload Primary Image</Button>
          </Upload>
        </Form.Item>

        {/* File Upload for Other Images */}
        <Form.Item label="Other Images (Max 3)">
          <Upload
            listType="picture"
            fileList={otherFiles}
            onChange={handleOtherFileChange}
            beforeUpload={() => false} // Prevent automatic upload
            multiple
          >
            <Button icon={<UploadOutlined />}>Upload Other Images</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default VehicleEditPage;
