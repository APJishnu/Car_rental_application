"use client";

import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { EDIT_MANUFACTURER } from '@/graphql/admin-queries/manufacture'; // Adjust the import path as needed
import { message, Form, Input, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface Manufacturer {
  id: string;
  name: string;
  country: string;
  imageUrl: string; // Existing image URL
}

// Define the props type for the EditManufacturer component
interface EditManufacturerProps {
  visible: boolean;
  onClose: () => void;
  manufacturer: Manufacturer; // Use the Manufacturer type here
}

const EditManufacturer: React.FC<EditManufacturerProps> = ({ visible, onClose, manufacturer }) => {
  const [form] = Form.useForm();
  const [image, setImage] = useState<File | null>(null);
  const [fileList, setFileList] = useState<any[]>([]); // Manage file list for Upload component
  const [editManufacturer] = useMutation(EDIT_MANUFACTURER);

  // Set the initial fileList and form values when the component mounts or when manufacturer changes
  useEffect(() => {
    if (manufacturer) {
      form.setFieldsValue({
        name: manufacturer.name,
        country: manufacturer.country,
      });

      if (manufacturer.imageUrl) {
        setFileList([{ uid: '-1', name: 'image.png', status: 'done', url: manufacturer.imageUrl }]); // Adjust the uid and name as needed
      }
    }
  }, [manufacturer, form]);

  const handleFinish = async (values: any) => {
    const { name, country } = values;
  
    try {
      const { data } = await editManufacturer({
        variables: {
          id: manufacturer.id,
          name,
          country,
          image: image || null,
        },
      });
  
      if (data.editManufacturer) {
        message.success('Manufacturer updated successfully!');
        onClose();
      } else {
        message.error('Failed to update manufacturer.');
      }
    } catch (error: any) {
      message.error(error.message || 'An error occurred while updating the manufacturer.');
    }
  };
  

  const handleChange = ({ fileList: newFileList }: { fileList: any[] }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      setImage(newFileList[0].originFileObj); // Set the image to the uploaded file
    } else {
      setImage(null); // Reset image if no file is uploaded
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      style={{ display: visible ? 'block' : 'none' }}
    >
      <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the manufacturer name!' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Country" name="country" rules={[{ required: true, message: 'Please input the country!' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Image" name="image">
        <Upload
          fileList={fileList} // Use fileList prop
          beforeUpload={(file) => {
            setFileList([file]); // Set the uploaded file to fileList
            return false; // Prevent automatic upload
          }}
          onChange={handleChange} // Handle file change
          showUploadList={true}
        >
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Update Manufacturer
        </Button>
        <Button onClick={onClose} style={{ marginLeft: '10px' }}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditManufacturer;
