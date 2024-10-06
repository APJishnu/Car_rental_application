"use client"
import React, { useState } from 'react';
import styles from './Navbar.module.css';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import icons



const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };


  const handleSignUp = () => {
    window.location.href = '/user/sign-up';
  }

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

            {/* Mobile Login/Register Button */}
          <div className={styles.mobileLoginContainer}>
      
            <button className={styles.loginBtn} onClick={handleSignUp}>Login / Register</button>
          </div>
       
        </div>
        <div className={styles.btnContainer}>
          <button className={styles.loginBtn} onClick={handleSignUp}>Login / Register</button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
