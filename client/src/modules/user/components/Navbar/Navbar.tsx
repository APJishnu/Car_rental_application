"use client";
import React, { useState } from 'react';
import styles from './Navbar.module.css';
import { FaBars, FaTimes, FaUser, FaCog, FaSignOutAlt, FaEnvelope , FaChevronDown} from 'react-icons/fa'; // Import icons
import { Dropdown, MenuProps, Modal, Button   } from 'antd';
import useUserData from '../../services/user-data';
import { UserAddOutlined, LoginOutlined , SmileOutlined } from '@ant-design/icons';
import { removeUserToken } from '../../services/remove-user-cookie';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { userData, loading } = useUserData();
  const [isModalVisible, setIsModalVisible] = useState(false); 

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };



  const handleLogout = () => {
    removeUserToken(); // Call the function to remove the token
    window.location.href = '/'; // Redirect to login page after logout
  };


  const showModal = () => {
    setIsModalVisible(true); // Show modal on click
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Close modal
  };
  // Render loading state
  const renderLoading = () => <span>Loading...</span>;

   
const renderModalContent = () => (
  <div className={styles.card}>
    <img src="/login-signup.svg" alt="user login" />
    <p className={styles.heading}><SmileOutlined /> Welcome to Our Platform! <SmileOutlined /></p>
    <p className={styles.description}>
      We're excited to have you here! <br />
      Join us today by creating an account or logging in to continue.
    </p>
    <div className={styles.buttonContainer}>
    
<Button
  type="primary"
  icon={<UserAddOutlined />}  // Changed icon to UserAddOutlined
  className={styles.signupButton}
  onClick={() => window.location.href = '/user/sign-up'}
>
  Sign Up
</Button>
<Button
  type="default"
  icon={<LoginOutlined />}  // Changed icon to LoginOutlined
  className={styles.loginButton}
  onClick={() => window.location.href = '/user/user-login'}
>
  Login
</Button>
    </div>
  </div>
);

  // Render user icon or login button
  const renderUserIconOrButton = () => {
    if (loading) {
      return renderLoading();
    }
    if (userData) {
      // Create menu items
      const menuItems: MenuProps['items'] = [
        {
          key: 'email',
          label: (
            <span className={styles.menuItem}>
              <FaEnvelope style={{ marginRight: '8px' }} /> {userData.email}
            </span>
          ), // Show user email with email icon
        },
        {
          key: 'profile',
          label: (
            <a href="/user/user-details" className={styles.menuItem}>
              <FaUser style={{ marginRight: '8px' }} /> Profile
            </a>
          ), // Show profile with user icon
        },
        {
          key: 'settings',
          label: (
            <a href="/user/settings" className={styles.menuItem}>
              <FaCog style={{ marginRight: '8px' }} /> Settings
            </a>
          ), // Show settings with cog (settings) icon
        },
        {
          key: 'logout',
          label: (
            <span className={styles.menuItem} onClick={handleLogout}>
              <FaSignOutAlt style={{ marginRight: '8px' }} /> Logout
            </span>
          ), // Show logout with logout icon
        },
      ];

      return (
        <Dropdown
        menu={{ items: menuItems }}
        trigger={['click']}
        placement="bottomCenter"
        overlayStyle={{ zIndex: 1050, position: 'fixed', width: '220px', borderRadius: '0px', padding: '5px', paddingRight: '0px', paddingTop: '22px' }}
        className={styles.overlayDropDown}
      >
       
          <span className={styles.userIcon}>
            <FaUser size={24} className={styles.userIconInteractive} />
            <FaChevronDown style={{ marginLeft: '5px' }} /> {/* Arrow icon */}
          </span>
    
      </Dropdown>
    );
  }
  return <button className={styles.loginBtn} onClick={showModal}>Login / Register</button>;
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <button
          className={styles.menuIcon}
          onClick={toggleMenu}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <img
              src="/Navbar/Heading-logo.svg" // Replace with your actual logo image
              alt="LuxeDrive Logo"
              className={styles.logoImage}
            />
          </div>
        </div>
        <div className={`${styles.menu} ${menuOpen ? styles.showMenu : ''}`}>
          <a href="/" className={styles.navLink}>Home</a>
          <a href="/" className={styles.navLink}>About</a>
          <a href="/" className={styles.navLink}>Services</a>
          <a href="/" className={styles.navLink}>Contact</a>

          {/* Mobile User Icon or Login/Register Button */}
          <div className={styles.mobileLoginContainer}>
            {renderUserIconOrButton()}
          </div>
        </div>
        <div className={styles.btnContainer}>
          {renderUserIconOrButton()}
        </div>
      </div>
        {/* Modal for Login/Signup */}
        <Modal open={isModalVisible} onCancel={handleCancel} footer={null} centered>
        {renderModalContent()}
      </Modal>
    </nav>
  );
};

export default Navbar;
