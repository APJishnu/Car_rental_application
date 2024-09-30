"use client";

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_MANUFACTURER } from '@/graphql/admin-mutations/manufacture'; // Adjust the import path as needed
import { message, Form, Input, Upload, Button, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import CountrySelect from 'react-select-country-list';

const AddManufacturerForm: React.FC = () => {
  const [form] = Form.useForm();
  const [image, setImage] = useState<File | null>(null);
  const [fileList, setFileList] = useState<any[]>([]); // Manage file list for Upload component
  const [country, setCountry] = useState<string>(''); // State for selected country
  const [addManufacturer] = useMutation(ADD_MANUFACTURER);

  const handleFinish = async (values: any) => {
    const { name } = values;
  
    if (!image) {
      message.error('No image selected');
      return;
    }
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('country', country);
    formData.append('image', image);
  
    try {
       await addManufacturer({
        variables: {
          name,
          country,
          image,
        },
        context: {
          fetchOptions: {
            formData,
          },
        },
      });
  
      message.success('Manufacturer added successfully!');
      form.resetFields();
      setFileList([]);
      setImage(null);
      setCountry('');
    } catch (error: any) {
      console.error('Error adding manufacturer:', error);
      // Display the specific error message
      message.error(error.message || 'Error adding manufacturer');
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

  // Get country options from react-select-country-list
  const countryOptions = CountrySelect().getData().map((country) => ({
    label: country.label, // Full country name
    value: country.value,  // Country code
  }));

  const handleCountryChange = (value: string) => {
    // Find the full name of the country using the value (country code)
    const selectedCountry = countryOptions.find(option => option.value === value);
    if (selectedCountry) {
      setCountry(selectedCountry.label); // Store full country name
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      className="add-manufacturer-form"
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please input the manufacturer name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Country"
        name="country"
        rules={[{ required: true, message: 'Please select a country!' }]}
      >
        <Select
          options={countryOptions}
          onChange={handleCountryChange} // Update country state with full name
          placeholder="Select a country"
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
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
          Add Manufacturer
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddManufacturerForm;
