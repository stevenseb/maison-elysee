'use client';

import './globals.css';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';
import CartSidebar from '../components/CartSidebar';
import { CartProvider } from '../context/CartContext';


export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const pathname = usePathname();
    const isAdminPage = pathname === '/admin';

  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <ThemeProvider attribute="class">
            <SessionProvider>
                <CartProvider>
                {!isAdminPage && <Navbar />}
                {!isAdminPage && <CartSidebar />}
                {children}
                </CartProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
