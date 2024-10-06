// app/layout.tsx

'use client';

import React, { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from '@/lib/apollo-client';
import './globals.css';
import { usePathname } from 'next/navigation';
import AdminLayout from '../modules/admin/AdminLayout';
import UserLayout from '../modules/user/UserLayout';

interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();

  // Check if the current path is an admin route
  const isAdminRoute = pathname.startsWith('/admin');
  // Check if it's specifically the admin login route
  const isAdminLogin = pathname === '/admin/admin-login';
  const isUserSignUp = pathname === '/user/sign-up';
  const isUserLogin = pathname === '/user/user-login';

  // Define the layout to be used based on the route
  let LayoutComponent;

  if (isAdminLogin) {
    // No layout for admin login
    LayoutComponent = React.Fragment;
  } else if (isUserSignUp) {

    LayoutComponent = React.Fragment;
 
  } else if (isUserLogin) {

    LayoutComponent = React.Fragment;
  } else if (isAdminRoute) {
    // Admin layout for other admin routes
    LayoutComponent = AdminLayout;
  } else {
    // User layout for non-admin routes
    LayoutComponent = UserLayout;
  }

  return (
    <ApolloProvider client={client}>
      <html lang="en">
        <body>
          <LayoutComponent>{children}</LayoutComponent>
        </body>
      </html>
    </ApolloProvider>
  );
}
