"use client";

import React, { useEffect, useState } from "react";
import { useFetchUserData, useUpdateProfileImage } from "../../../modules/user/services/user-services";
import Cookies from "js-cookie";
import {
  Card,
  Typography,
  Spin,
  Alert,
  Divider,
  Modal,
  Button,
  Upload,
  message,
} from "antd";
import { UploadOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const UserDetails: React.FC = () => {
  const token = Cookies.get("userToken");

  // Use the custom hook to fetch user data
  const { fetchUserData, loading, data, error } = useFetchUserData();
  const { updateProfileImage, loading: mutationLoading } = useUpdateProfileImage(); // Mutation for updating profile image

  // State to control profile picture modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState<string | undefined>("/profile.svg"); // Default image initially

  useEffect(() => {
    if (token) {
      fetchUserData(token);
    }
  }, [token]);

  useEffect(() => {
    if (data && data.getUser && data.getUser.data) {
      const userData = data.getUser.data;
      // If profile picture exists, set it; otherwise, keep the default image
      setProfileImage(userData.profileImage ?? undefined);
    }
  }, [data]);

  // Handle loading state
  if (loading || mutationLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  // Handle error state
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

  if (!data || data.getUser.data === null) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Alert
          message="No User Data Found"
          description="The user data could not be retrieved. Please make sure you're logged in or try again later."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  const { status, message: statusMessage, data: userData } = data.getUser;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    message.success("Profile updated successfully");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Handle profile image change (upload mutation)
  const handleProfileChange = async (info: any) => {
    if (info.file.status === "done") {
      console.log(info.file)
      const newImageUrl = info.file.name; // Assuming the response contains the image URL
      if (newImageUrl) {
        try {
          const response = await updateProfileImage({ userId:userData.id, profileImage: newImageUrl }); // Call mutation
          if (response.data.updateProfileImage.status === "success") {
            setProfileImage(newImageUrl); // Update the local state
            message.success("Profile picture updated successfully");
          } else {
            message.error("Failed to update profile picture");
          }
        } catch (error) {
          message.error("Error while updating profile picture");
        }
      }
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const removeProfilePicture = async () => {
    try {
      const response = await updateProfileImage({userId:userData.id, profileImage: null }); // Remove profile image
      if (response.data.updateProfileImage.status === "success") {
        setProfileImage("/profile.svg"); // Set back to default image
        message.success("Profile picture removed");
      } else {
        message.error("Failed to remove profile picture");
      }
    } catch (error) {
      message.error("Error while removing profile picture");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <Card bordered={false} style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <Title level={3}>User Details</Title>

        {/* Display status and message */}
        <Alert
          message={`Status: ${status}`}
          description={statusMessage}
          type={status === "success" ? "success" : "info"}
          showIcon
          style={{ marginBottom: "1.5rem" }}
        />

        {/* Profile picture section */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <div style={{ textAlign: "center" }}>
            <img
              src={profileImage ?? "/profile.svg"}
              alt="Profile"
              style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
            />
            <div>
              <Button icon={<EditOutlined />} onClick={showModal} style={{ margin: "0.5rem" }}>
                Change
              </Button>
              <Button icon={<DeleteOutlined />} onClick={removeProfilePicture} style={{ margin: "0.5rem" }}>
                Remove
              </Button>
            </div>
          </div>
        </div>

        {/* User details section */}
        {userData && (
          <>
            <Divider />
            <Text strong>ID:</Text> <Text>{userData.id}</Text>
            <Divider />
            <Text strong>Name:</Text> <Text>{`${userData.firstName} ${userData.lastName}`}</Text>
            <Divider />
            <Text strong>Phone:</Text> <Text>{userData.phoneNumber}</Text>
            <Divider />
            <Text strong>Email:</Text> <Text>{userData.email}</Text>
            <Divider />
            <Text strong>Address:</Text>{" "}
            <Text>
              {userData.city}, {userData.state}, {userData.country} - {userData.pincode}
            </Text>
          </>
        )}

        {/* Profile modal for uploading profile picture */}
        <Modal title="Update Profile Picture" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <Upload
            name="profile"
            onChange={handleProfileChange}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Modal>
      </Card>
    </div>
  );
};

export default UserDetails;
