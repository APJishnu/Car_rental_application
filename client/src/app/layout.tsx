// src/app/layout.tsx
'use client';

import { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from '@/lib/apollo-client';
import './globals.css';
import Navbar from '../modules/user/components/Navbar/Navbar'
import Footer from '../modules/user/components/Footer/Footer'

interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ApolloProvider client={client}>
      <html lang="en">
        <body>
          <Navbar />
          {children}
          <Footer />
          </body>
          
      </html>
    </ApolloProvider>
  );
}
