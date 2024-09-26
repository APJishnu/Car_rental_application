// src/app/layout.tsx
'use client';

import { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from '@/lib/apollo-client';
import './globals.css';
import Navbar from '../modules/user/components/Navbar/Navbar'
import Footer from '../modules/user/components/Footer/Footer'
import { usePathname } from 'next/navigation';
import AdminNavbar from '../modules/admin/components/AdminNavbar/AdminNavbar'

interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {

  const pathname = usePathname();

  // Check if the current path includes "/admin"
  const isAdminRoute = pathname.startsWith('/admin');
  return (
    <ApolloProvider client={client}>
      <html lang="en">
        <body>
        {isAdminRoute ? <AdminNavbar /> : <Navbar />}
          {children}
          <Footer />
          </body>
          
      </html>
    </ApolloProvider>
  );
}
