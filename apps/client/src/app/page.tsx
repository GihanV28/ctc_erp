import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 flex items-center justify-center p-6">
      <div className="text-center text-white space-y-8">
        <div>
          <h1 className="text-5xl font-bold mb-4">
            Ceylon Cargo Transport
          </h1>
          <p className="text-xl text-purple-200">
            Your trusted partner in global logistics
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button variant="primary" className="bg-white text-purple-600 hover:bg-gray-100 rounded-full px-8">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8">
              Sign Up
            </Button>
          </Link>
        </div>

        <div className="pt-8 text-sm text-purple-300">
          <p>Track your shipments • Request quotes • Manage your cargo</p>
        </div>
      </div>
    </div>
  );
}
