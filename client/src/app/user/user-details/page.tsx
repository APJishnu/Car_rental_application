'use client';

import React, { useState } from "react";
import { useUpdateProfileImage } from "../../../modules/user/services/user-services"; // Adjust the path as needed
import { Card, Typography, Spin, Alert, Modal, Button, Upload, message, Row, Col, Switch } from "antd";
import { UploadOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import styles from "./page.module.css";
import useUserData from '../../../modules/user/services/user-data'

const { Title, Text } = Typography;

const UserDetails: React.FC = () => {
  const { profileImage, userData, loading, error } = useUserData(); // Use your custom hook
  const { updateProfileImage, loading: mutationLoading } = useUpdateProfileImage();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Loader while fetching user data
  if (loading || mutationLoading) {
    return (
      <div className={styles.centeredDiv}>
        <Spin size="large" />
      </div>
    );
  }

  // Error handling
  if (error) {
    return (
      <Alert
        message="Error"
        description={`There was an error fetching the user data: ${error.message}`}
        type="error"
        showIcon
      />
    );
  }

  // Check for user data
  if (!userData) {
    return (
      <div className={styles.centeredDiv}>
        <Alert
          message="No User Data Found"
          description="The user data could not be retrieved. Please make sure you're logged in or try again later."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  const showModal = () => {
    setPreviewImage(profileImage);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setSelectedImage(null);
    setIsModalVisible(false);
  };

  const handleOk = async () => {
    if (selectedImage) {
      try {
        const response = await updateProfileImage({ userId: userData.id, profileImage: selectedImage });
        if (response.data.updateProfileImage.status === "success") {
          message.success("Profile picture updated successfully");
        } else {
          message.error("Failed to update profile picture");
        }
      } catch (error) {
        message.error("Error while updating profile picture");
      }
    }
    setIsModalVisible(false);
  };

  const handleProfileChange = (info: any) => {
    const file = info.file.originFileObj;
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      setSelectedImage(file);
    }
  };

  const removeProfilePicture = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove your profile picture?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await updateProfileImage({ userId: userData.id, profileImage: null });
          if (response.data.updateProfileImage.status === "success") {
            message.success("Your profile picture has been removed.");
          } else {
            message.error("Failed to remove profile picture");
          }
        } catch (error) {
          message.error("Error while removing profile picture");
        }
      }
    });
  };

  return (
    <div className={styles.mainDiv}>
      <Card bordered={false} className={styles.userCard}>
        <div className={styles.profileHeader}>
          <div className={styles.profile}>
            <img src={profileImage ?? "/profile.svg"} alt="Profile" className={styles.profileImage} onClick={showModal} />
            <EditOutlined className={styles.editIcon} onClick={showModal} />
          </div>
          <div className={styles.userInfo}>
            <Title level={4}>{`${userData.firstName} ${userData.lastName}`}</Title>
            <Text>{userData.email}</Text>
            <Text>{userData.phoneNumber}</Text>
          </div>
        </div>
        <div>
          <Text strong>Address:</Text>{" "}
          <Text>{`${userData.city}, ${userData.state}, ${userData.country} - ${userData.pincode}`}</Text>
        </div>

        <div className={styles.profileActions}>
          <Button block>Edit Profile Information</Button>
          <div className={styles.settingsRow}>
            <Text>Notifications</Text>
            <Switch defaultChecked className={styles.checkOption} />
          </div>
          <div className={styles.settingsRow}>
            <Text>Language</Text>
            <Text>English</Text>
          </div>
          <Button block>Security</Button>
          <Button block>Theme</Button>
        </div>
      </Card>

      <Modal title="Update Profile Picture" open={isModalVisible} onCancel={handleCancel} onOk={handleOk} okText="Update">
        {previewImage && <img src={previewImage} alt="Profile Preview" className={styles.previewImage} />}
        <Upload name="profile" onChange={handleProfileChange} showUploadList={false}>
          <Button icon={<UploadOutlined />}>Click to Select Image</Button>
        </Upload>
        <Button icon={<DeleteOutlined />} onClick={removeProfilePicture} style={{ margin: "0.5rem" }}>
          Remove
        </Button>
      </Modal>
    </div>
  );
};

export default UserDetails;
