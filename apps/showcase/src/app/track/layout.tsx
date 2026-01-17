import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Your Shipment | Ceylon Cargo Transport',
  description: 'Track your shipment in real-time with Ceylon Cargo Transport',
};

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
