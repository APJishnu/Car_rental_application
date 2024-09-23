"use client"
import React, { useState } from 'react';
import styles from './Navbar.module.css';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import icons
import Image from 'next/image'; // Import Link component


const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.menuIcon} onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>LEXEDRIVE</div>
        </div>
        <div className={`${styles.menu} ${menuOpen ? styles.showMenu : ''}`}>
          <a href="#" className={styles.navLink}>Home</a>
          <a href="#" className={styles.navLink}>About</a>
          <a href="#" className={styles.navLink}>Services</a>
          <a href="#" className={styles.navLink}>Contact</a>
        </div>
        <div className={styles.btnContainer}>
        <button className={styles.loginBtn}>Login / Register</button>
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;
