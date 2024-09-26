'use client';

import React, { useState } from 'react';
import styles from './AdminNavbar.module.css'; // Create a CSS module for the admin navbar
import { FaBars, FaTimes } from 'react-icons/fa'; // Import icons

const AdminNavbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Hamburger Icon */}
        <button className={styles.menuIcon} onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Admin Logo */}
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <img
              src="/Navbar/Heading-logo.svg" // Replace with your actual admin logo
              alt="Admin Logo"
              className={styles.logoImage}
            />
            <p>.Admin</p>
          </div>
        </div>

        {/* Menu Links */}
        <div className={`${styles.menu} ${menuOpen ? styles.showMenu : ''}`}>
          <a href="/admin/dashboard" className={styles.navLink}>Dashboard</a>
          <a href="/admin/users" className={styles.navLink}>Users</a>
          <a href="/admin/settings" className={styles.navLink}>Settings</a>
           {/* Logout Button */}
        <div className={styles.mobileLogoutContainer}>
          <button className={styles.logoutButton}>Logout</button>
        </div>
        </div>

        {/* Logout Button */}
        <div className={styles.logoutButtonContainer}>
          <button className={styles.logoutButton}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
