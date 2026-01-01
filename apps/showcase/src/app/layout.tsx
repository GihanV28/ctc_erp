import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Ceylon Cargo Transport | Global Logistics Solutions',
  description:
    'Fast, reliable, and secure international shipping services. Track shipments in real-time with Ceylon Cargo Transport. Ocean freight, air cargo, and ground transportation.',
  keywords:
    'cargo transport, logistics, international shipping, ocean freight, air cargo, container shipping, Sri Lanka, global logistics, warehousing, customs clearance',
  authors: [{ name: 'Ceylon Cargo Transport' }],
  creator: 'Ceylon Cargo Transport',
  publisher: 'Ceylon Cargo Transport',
  metadataBase: new URL('https://www.cct.ceylongrp.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Ceylon Cargo Transport | Global Logistics Solutions',
    description: 'Fast, reliable, and secure international shipping services.',
    url: 'https://www.cct.ceylongrp.com',
    siteName: 'Ceylon Cargo Transport',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ceylon Cargo Transport',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ceylon Cargo Transport | Global Logistics Solutions',
    description: 'Fast, reliable, and secure international shipping services.',
    images: ['/images/og-image.jpg'],
    creator: '@ceyloncargo',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
