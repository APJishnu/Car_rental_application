// app/modules/admin/layouts/AdminLayout.tsx

'use client';

import { ReactNode, useEffect, useState } from 'react';
import AdminNavbar from './components/AdminNavbar/AdminNavbar';
import Loading from '../../themes/Loading/Loading';
import styles from './AdminLayout.module.css'; // Import CSS Module

interface AdminLayoutProps {
  readonly children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay (remove this in production)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulate loading for 1 second

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.adminLayout}>
      {loading ? <Loading /> : <AdminNavbar />}
      {loading ? null : <div className={styles.childrenContainer}>{children}</div>}
    </div>
  );
};

export default AdminLayout;
