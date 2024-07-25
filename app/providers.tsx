'use client';

import { CartProvider } from '../context/CartContext';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <SessionProvider>
        <CartProvider>{children}</CartProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
