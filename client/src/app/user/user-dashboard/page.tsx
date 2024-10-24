"use client"

import React, { useState } from 'react';
import UserProfile from '../../../modules/user/components/UserProfile/UserProfile';
import BookingList from '../../../modules/user/components/UserBookings/UserBookings';
import { UserIcon, CalendarDaysIcon } from 'lucide-react';
import styles from './page.module.css';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.container}>
      <div className={styles.dashboardCard}>
        <h1 className={styles.title}>My Dashboard</h1>
        
        <div className={styles.tabContainer}>
          <div className={styles.tabList}>
            <button
              className={`${styles.tabButton} ${activeTab === 'profile' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('profile')}
            >
              <UserIcon className={styles.icon} />
              <span>Profile</span>
            </button>
            
            <button
              className={`${styles.tabButton} ${activeTab === 'bookings' ? styles.activeTab : ''}`}
              onClick={() => handleTabChange('bookings')}
            >
              <CalendarDaysIcon className={styles.icon} />
              <span>My Bookings</span>
            </button>
          </div>
          
          <div className={styles.tabContent}>
            {activeTab === 'profile' && (
              <div className={styles.tabPanel}>
                <UserProfile />
              </div>
            )}
            
            {activeTab === 'bookings' && (
              <div className={styles.tabPanel}>
                <BookingList />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;