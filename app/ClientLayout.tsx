'use client';

import { usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';
import CartSidebar from '../components/CartSidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname === '/admin';

  return (
    <>
      {!isAdminPage && <Navbar />}
      {!isAdminPage && <CartSidebar />}
      {children}
    </>
  );
}
