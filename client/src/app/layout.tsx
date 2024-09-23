// src/app/layout.tsx
'use client'; // Add this directive

import { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from '@/lib/apollo-client';
import './globals.css';
import Navbar from '../components/Navbar/Navbar'


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <html lang="en">
        <body>
        <Navbar />
       
          {children}</body>
      </html>
    </ApolloProvider>
  );
}
  