// page.tsx
"use client";

import React, { useState } from "react";
import {
  Card,
  Typography,
  Spin,
  Alert,
  Modal,
  Button,
  Upload,
  message,
  Switch,
  Form,
  Input,
} from "antd";
import {
  EditOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  BellOutlined,
  GlobalOutlined,
  LockOutlined,
  FileOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import styles from "./UserProfile.module.css";
import { useUpdateProfileImage } from "../../services/user-services";
import { useUpdateUserInfo } from "../../services/user-services";
import { useUpdatePassword } from "../../services/user-services";
import useUserData from "../../services/user-data";

interface PasswordChangeValues {
  currentPassword: string;
  newPassword: string;
}



const { Title, Text } = Typography;

const UserProfile: React.FC = () => {
  const { profileImage, userData, loading, error } = useUserData();
  const { updateProfileImage, loading: mutationLoading } =useUpdateProfileImage();
  const { updateUserInfo, loading: updateLoading } = useUpdateUserInfo();
  const { updatePassword } = useUpdatePassword();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [showSecuritySettings, setShowSecuritySettings] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const [form] = Form.useForm();

  React.useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        city: userData.city || "",
        state: userData.state || "",
        country: userData.country || "",
        pincode: userData.pincode || "",
      });
    }
  }, [userData, form]);

  const handleSubmit = async (values: any) => {
    try {
      const response = await updateUserInfo({
        userId: userData.id,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        city: values.city,
        state: values.state,
        country: values.country,
        pincode: values.pincode,
      });

      if (response.status === true) {
        message.success("Profile updated successfully");
        setIsEditMode(false);
      } else {
        // Handle validation errors
        if (response.fieldErrors) {
          response.fieldErrors.forEach((error: any) => {
            form.setFields([
              {
                name: error.field,
                errors: [error.message],
              },
            ]);
          });
        } else {
          message.error("Failed to update profile");
        }
      }
    } catch (error) {
      message.error("Error updating profile");
    }
  };

  if (loading || mutationLoading) {
    return (
      <div className={styles.container}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Alert
          message="Error"
          description={`Error fetching user data: ${error.message}`}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className={styles.container}>
        <Alert
          message="No User Data Found"
          description="Please make sure you're logged in."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  const handleProfileChange = (info: any) => {
    const file = info.file.originFileObj;
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      setSelectedImage(file);
    }
  };

  const handleUpdateImage = async () => {
    if (selectedImage) {
      try {
        const response = await updateProfileImage({
          userId: userData.id,
          profileImage: selectedImage,
        });
        if (response.data.updateProfileImage.status === "success") {
          message.success("Profile picture updated successfully");
        } else {
          message.error("Failed to update profile picture");
        }
      } catch (error) {
        message.error("Error updating profile picture");
      }
    }
    setIsModalVisible(false);
  };

  const renderEditForm = () => (
    <Form form={form} onFinish={handleSubmit} className={styles.editForm}>
      <div className={styles.userNameDiv}>
        <Form.Item className={styles.userNameFormItem} name="firstName">
          <Input placeholder="First Name" />
        </Form.Item>
        <Form.Item className={styles.userNameFormItem} name="lastName">
          <Input placeholder="Last Name" />
        </Form.Item>
      </div>
      <Form.Item name="email">
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item name="city">
        <Input placeholder="City" />
      </Form.Item>
      <Form.Item name="state">
        <Input placeholder="State" />
      </Form.Item>
      <Form.Item name="country">
        <Input placeholder="Country" />
      </Form.Item>
      <Form.Item name="pincode">
        <Input placeholder="Pincode" />
      </Form.Item>
      <div className={styles.formActions}>
        <Button type="primary" htmlType="submit" className={styles.saveButton}>
          <SaveOutlined /> Save Changes
        </Button>
        <Button
          type="primary"
          onClick={() => setIsEditMode(false)}
          className={styles.cancelButton}
        >
          <CloseOutlined /> Cancel
        </Button>
      </div>
    </Form>
  );

  const renderUserInfo = () => (
    <div className={styles.infoCard}>
      <h3 className={styles.cardTitle}>
        <UserOutlined /> Personal Information
      </h3>
      <div className={styles.addressSection}>
        <HomeOutlined className={styles.addressIcon} />
        <div className={styles.addressDetails}>
          <strong>Address</strong>
          <p>{`${userData.city}, ${userData.state}`}</p>
          <p>{`${userData.country} - ${userData.pincode}`}</p>
        </div>
      </div>
      <button
        className={styles.primaryButton}
        onClick={() => setIsEditMode(true)}
      >
        <EditOutlined /> Edit Profile
      </button>
    </div>
  );


  const handlePasswordChange = async (values: PasswordChangeValues) => {
    try {
      const response = await updatePassword({
        userId: userData.id,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      form.resetFields(["currentPassword", "newPassword"]);
  
      if (response?.status === true) {
        message.success("Password updated successfully");
        form.resetFields(["currentPassword", "newPassword"]);
      } else {
        if (response?.fieldErrors) {
          response.fieldErrors.forEach((error: any) => {
            form.setFields([
              {
                name: error.field,
                errors: [error.message],
              },
            ]);
          });
        } else {
          message.error("Failed to update password");
        }
      }
    } catch (error) {
      message.error("Error updating password");
    }
  };
  

  const renderSecuritySettings = () => (
    <div className={styles.securitySettings}>
      <h3>
        <LockOutlined /> Security Settings
      </h3>
      <Form form={form} className={styles.securityForm} onFinish={handlePasswordChange}>
        <div className={styles.passwordChangeDiv}>
          <Form.Item name="currentPassword">
            <Input.Password placeholder="Enter Current Password" />
          </Form.Item>
          <Form.Item name="newPassword">
            <Input.Password placeholder="Enter New Password" />
          </Form.Item>
        </div>

        <Form.Item>
          <Button type="link" className={styles.forgotPassword}>
            Forgot Password?
          </Button>
        </Form.Item>
        <Form.Item label="Two-Factor Authentication">
          <Switch />
        </Form.Item>
           {/* New Change Password Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Change Password
        </Button>
      </Form.Item>
      </Form>
      <Button
        onClick={() => setShowSecuritySettings(false)}
        className={styles.secondaryButton}
      >
        Back to Profile
      </Button>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.profileCard}>
          {/* Cover Section */}
          <div className={styles.coverSection}>
            <div className={styles.coverBackground} />

            {/* Profile Image */}
            <div className={styles.profileImageContainer}>
              <div className={styles.profileImageWrapper}>
                <img
                  src={profileImage ?? "/profile.svg"}
                  alt="Profile"
                  className={styles.profileImage}
                />
                <button
                  onClick={() => setIsModalVisible(true)}
                  className={styles.editButton}
                >
                  <EditOutlined />
                </button>
              </div>
            </div>

            {/* User Info */}
            <div className={styles.userInfo}>
              <h2 className={styles.userName}>
                {`${userData.firstName} ${userData.lastName}`}
              </h2>
              <div className={styles.contactInfo}>
                <span className={styles.contactItem}>
                  <MailOutlined /> {userData.email}
                </span>
                <span className={styles.contactItem}>
                  <PhoneOutlined /> {userData.phoneNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={styles.mainContent}>
            {/* Left Column */}
            <div className={styles.leftColumn}>
              {isEditMode ? renderEditForm() : renderUserInfo()}
            </div>

            {/* Right Column */}
            <div className={styles.rightColumn}>
              {showSecuritySettings ? (
                renderSecuritySettings()
              ) : (
                <div className={styles.settingsCard}>
                  <div className={styles.settingRow}>
                    <span className={styles.settingLabel}>
                      <BellOutlined /> Notifications
                    </span>
                    <Switch size="small" className={styles.switch} />
                  </div>

                  <div className={styles.settingRow}>
                    <span className={styles.settingLabel}>
                      <GlobalOutlined /> Language
                    </span>
                    <span className={styles.settingValue}>English</span>
                  </div>

                  <button
                    className={styles.secondaryButton}
                    onClick={() => setShowSecuritySettings(true)}
                  >
                    <LockOutlined /> Security Settings
                  </button>

                  <button className={styles.secondaryButton}>
                    <FileOutlined /> Theme Preferences
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* WhatsApp-style Profile Image Modal */}
      <Modal
        title={null}
        open={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        width={400}
        className={styles.profileModal}
        closeIcon={<span className={styles.modalClose}>×</span>}
        style={{ top: 20 }}
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      >
        <div className={styles.modalContent}>
          <div className={styles.modalImageContainer}>
            <img
              src={previewImage ?? profileImage ?? "/profile.svg"}
              alt="Preview"
              className={styles.modalImage}
            />
            <div className={styles.modalImageOverlay}>
              <Upload onChange={handleProfileChange} showUploadList={false}>
                <button className={styles.uploadButton}>Change Photo</button>
              </Upload>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button onClick={handleUpdateImage} className={styles.saveButton}>
              Save Changes
            </button>
            <button
              onClick={() => setIsModalVisible(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserProfile;
