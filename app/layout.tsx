import './globals.css';
import { Metadata } from 'next';
import { Providers } from './providers';
import ClientLayout from './ClientLayout';
import packageInfo from '../package.json';

export const metadata: Metadata = {
  title: packageInfo.name,
  description: 'Your app description',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className="bg-gray-900 text-white">
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
