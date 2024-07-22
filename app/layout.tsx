'use client';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';

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
          {!isAdminPage && <Navbar />}
          {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
