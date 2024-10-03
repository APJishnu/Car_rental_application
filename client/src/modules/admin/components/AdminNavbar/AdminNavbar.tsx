// app/modules/admin/components/AdminNavbar/AdminNavbar.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // Update this based on your routing
import { MenuOutlined, CloseOutlined, DashboardOutlined, UserOutlined, SettingOutlined, LogoutOutlined, CarOutlined, BuildOutlined } from '@ant-design/icons'; // Import Ant Design icons
import styles from './AdminNavbar.module.css'; // Import CSS Module

const AdminNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={`${styles.navbar} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.logoContainer}>
        {!isSidebarCollapsed && (
          <div className={styles.logo}>
            <img src="/Navbar/Heading-logo.svg" alt="Logo" />
          </div>
        )}
        <div className={styles.toggleButtonDiv}>
          <button className={styles.toggleIcon} onClick={toggleSidebar}>
            {isSidebarCollapsed ? <MenuOutlined /> : <CloseOutlined />} {/* Ant Design icons */}
          </button>
          <button className={styles.menuIcon} onClick={toggleMenu}>
            {isMenuOpen ? <CloseOutlined /> : <MenuOutlined />} {/* Use Ant Design icons */}
          </button>
        </div>
      </div>
      <div className={`${styles.menu} ${isMenuOpen ? styles.showMenu : ''}`}>
        <Link href="/admin/" className={styles.navLink}>
          <DashboardOutlined className={styles.icon} />
          {!isSidebarCollapsed && 'Admin Dashboard'}
        </Link>
        <Link href="/admin/users" className={styles.navLink}>
          <UserOutlined className={styles.icon} />
          {!isSidebarCollapsed && 'Users'}
        </Link>
        <Link href="/admin/manufacture-list" className={styles.navLink}>
          <BuildOutlined className={styles.icon} />
          {!isSidebarCollapsed && 'Makes'}
        </Link>
        <Link href="/admin/vehicles-list" className={styles.navLink}>
          <CarOutlined className={styles.icon} />
          {!isSidebarCollapsed && 'Vehicles'}
        </Link>
        <Link href="/admin/rentable-vehicle-lists" className={styles.navLink}>
          <CarOutlined className={styles.icon} />
          {!isSidebarCollapsed && 'Rentable Vehicles'}
        </Link>
        <Link href="/admin/settings" className={styles.navLink}>
          <SettingOutlined className={styles.icon} />
          {!isSidebarCollapsed && 'Settings'}
        </Link>
        {/* Logout Button */}
        <div className={styles.logoutButtonContainer}>
          <Link href="/" className={styles.logoutButton}>
            <LogoutOutlined className={styles.icon} />
            {!isSidebarCollapsed && 'Logout'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
