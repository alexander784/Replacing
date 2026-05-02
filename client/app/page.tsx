'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-700">
            Id Replace
          </h1>

          <div className="space-x-4">
            <Link href="/auth/login/" className="text-sm font-medium text-gray-600 hover:text-blue-600">
              Login
            </Link>
            <Link href="/auth/register/" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
              Register
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Lost Your Student ID?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Request a replacement quickly and securely through the official university portal.
        </p>

        <Link
          href="/dashboard"
          className="bg-blue-600 text-white px-8 py-3 rounded-xl text-lg hover:bg-blue-700 transition"
        >
          Request Replacement
        </Link>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-semibold text-center mb-12">
            How It Works
          </h3>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 border rounded-xl">
              <h4 className="font-semibold mb-2">1. Submit Details</h4>
              <p className="text-sm text-gray-600">
                Provide your student information and ID replacement request.
              </p>
            </div>

            <div className="p-6 border rounded-xl">
              <h4 className="font-semibold mb-2">2. Admin Verification</h4>
              <p className="text-sm text-gray-600">
                University admin reviews and validates your details.
              </p>
            </div>

            <div className="p-6 border rounded-xl">
              <h4 className="font-semibold mb-2">3. Get Approval</h4>
              <p className="text-sm text-gray-600">
                Receive confirmation and proceed with ID replacement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-semibold mb-4">
            Secure & Verified
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            All requests are handled by authorized university administrators. 
            Your data is protected and used strictly for identity verification purposes.
          </p>
        </div>
      </section>

      <section className="py-16 text-center">
        <h3 className="text-2xl font-semibold mb-4">
          Ready to Replace Your ID?
        </h3>
        <Link
          href="/auth/register/"
          className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700"
        >
          Get Started
        </Link>
      </section>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} University ID Portal. All rights reserved.
        </div>
      </footer>
    </div>
  );
}