// page.tsx
'use client';

import React, { useState } from 'react';
import { Card, Typography, Spin, Alert, Modal, Button, Upload, message, Switch } from 'antd';
import { 
  UploadOutlined, 
  DeleteOutlined, 
  EditOutlined,
  UserOutlined, 
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  BellOutlined,
  GlobalOutlined,
  LockOutlined,
  FileOutlined,
} from '@ant-design/icons';
import styles from './UserProfile.module.css';
import { useUpdateProfileImage } from "../../services/user-services";
import useUserData from '../../services/user-data';

const { Title, Text } = Typography;

const UserProfile: React.FC = () => {
  const { profileImage, userData, loading, error } = useUserData();
  const { updateProfileImage, loading: mutationLoading } = useUpdateProfileImage();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

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
          profileImage: selectedImage 
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
                <button className={styles.primaryButton}>
                <EditOutlined /> Edit Profile
              </button>
              </div>
            </div>
            

            {/* Right Column */}
            <div className={styles.rightColumn}>
              

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

                <button className={styles.secondaryButton}>
                  <LockOutlined /> Security Settings
                </button>

                <button className={styles.secondaryButton}>
                  <FileOutlined /> Theme Preferences
                </button>
              </div>
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
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
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
                <button className={styles.uploadButton}>
                  Change Photo
                </button>
              </Upload>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button
              onClick={handleUpdateImage}
              className={styles.saveButton}
            >
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