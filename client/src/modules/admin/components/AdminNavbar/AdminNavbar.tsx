// app/modules/admin/components/AdminNavbar/AdminNavbar.tsx

"use client";

import React, { useState } from "react";
// Update this based on your routing
import {
  ContainerOutlined,
  MenuOutlined,
  CloseOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  CarOutlined,
  BuildOutlined,
  CarTwoTone,
} from "@ant-design/icons"; // Import Ant Design icons
import styles from "./AdminNavbar.module.css"; // Import CSS Module
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";

const AdminNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isScaled, setIsScaled] = useState(false);
  const router = useRouter(); // Get the router instance
  const pathname = usePathname(); // Get the current pathname

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed); // Toggle sidebar state
    setIsScaled(true); // Trigger the scale effect

    // Remove the scale effect after the animation is done
    setTimeout(() => {
      setIsScaled(false);
    }, 500); // Matches the CSS transition duration
  };

  // Handle navigation and set active tab based on the current path
  const handleNavigation = (path: string) => {
    router.push(path); // Use router to navigate
  };

  const handleLogout = () => {
    // Remove the adminToken cookie
    Cookies.remove("adminToken");

    // Refresh the page
    window.location.reload();
  };

  return (
    <div
      className={`${styles.navbar} ${isSidebarCollapsed ? styles.collapsed : ""}`}
    >
      <div className={styles.logoContainer}>
        {!isSidebarCollapsed && (
          <div className={styles.logo}>
            LUXEDRIVE
          </div>
        )}
        <div className={styles.toggleButtonDiv}>
          <button
            className={`${styles.toggleIcon} ${isScaled ? styles.iconScale : ""}`}
            onClick={toggleSidebar}
          >
            {isSidebarCollapsed ? (
              <DoubleRightOutlined />
            ) : (
              <DoubleLeftOutlined />
            )}{" "}
            {/* Ant Design icons */}
          </button>
          <button className={styles.menuIcon} onClick={toggleMenu}>
            {isMenuOpen ? <CloseOutlined /> : <MenuOutlined />}{" "}
            {/* Use Ant Design icons */}
          </button>
        </div>
      </div>
      <div className={`${styles.menu} ${isMenuOpen ? styles.showMenu : ""}`}>
        <div
          onClick={() => handleNavigation("/admin/dashboard")}
          className={`${styles.navLink} ${pathname === "/admin/dashboard" ? styles.active : ""}`}
        >
          <DashboardOutlined className={styles.icon} />
          {!isSidebarCollapsed && "Admin Dashboard"}
        </div>
        <div
          onClick={() => handleNavigation("/admin/users")}
          className={`${styles.navLink} ${pathname === "/admin/users" ? styles.active : ""}`}
        >
          <UserOutlined className={styles.icon} />
          {!isSidebarCollapsed && "Users"}
        </div>
        <div
          onClick={() => handleNavigation("/admin/inventory-management")}
          className={`${styles.navLink} ${pathname === "/admin/inventory-management" ? styles.active : ""}`}
        >
          <ContainerOutlined className={styles.icon} />
          {!isSidebarCollapsed && "Inventory"}
        </div>

        <div
          onClick={() => handleNavigation("/admin/manufacture-list")}
          className={`${styles.navLink} ${pathname === "/admin/manufacture-list" ? styles.active : ""}`}
        >
          <BuildOutlined className={styles.icon} />
          {!isSidebarCollapsed && "Makes"}
        </div>
        <div
          onClick={() => handleNavigation("/admin/vehicles-list")}
          className={`${styles.navLink} ${pathname === "/admin/vehicles-list" ? styles.active : ""}`}
        >
          <CarOutlined className={styles.icon} />
          {!isSidebarCollapsed && "Vehicles"}
        </div>
        <div
          onClick={() => handleNavigation("/admin/rentable-vehicle-lists")}
          className={`${styles.navLink} ${pathname === "/admin/rentable-vehicle-lists" ? styles.active : ""}`}
        >
          <CarTwoTone className={styles.icon} />
          {!isSidebarCollapsed && "Rentables"}
        </div>

        {/* Logout Button */}
        <div
          onClick={handleLogout}
          className={`${styles.logoutButton} ${pathname === "/" ? styles.active : ""}`}
        >
          <LogoutOutlined className={styles.icon} />
          {!isSidebarCollapsed && "Logout"}
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
