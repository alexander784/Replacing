'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-700 hover:text-blue-800 transition">
          ID Replace
        </Link>

        <div className="space-x-4">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-gray-600 hover:text-blue-600"
          >
            Login
          </Link>

          <Link
            href="/auth/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}