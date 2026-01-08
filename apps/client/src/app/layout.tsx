import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ProfilePhotoProvider } from '@/context/ProfilePhotoContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ceylon Cargo Transport - Client Portal',
  description: 'Track your shipments and manage your cargo with Ceylon Cargo Transport',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ProfilePhotoProvider>
            {children}
          </ProfilePhotoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
