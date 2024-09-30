// app/modules/user/layouts/UserLayout.tsx

'use client';

import { ReactNode, useEffect, useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Loading from '../../themes/Loading/Loading';

interface UserLayoutProps {
  readonly children: ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay (remove this in production)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulate loading for 1 second

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? <Loading /> : <Navbar />}
      {loading ? null : children}
      {loading ? null : <Footer />}
    </>
  );
};

export default UserLayout;
