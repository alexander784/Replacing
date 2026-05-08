'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <a href="/api/auth/logout" className="text-red-600 hover:underline text-sm font-medium">
              Logout
            </a>
          </div>
        </div>
      </nav>

      <div className="flex">
        <div className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] p-6">
          <nav className="space-y-2">
            <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 font-medium">
               Dashboard
            </Link>
            <Link href="/admin/replacements" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 font-medium bg-gray-100">
              Replacement Requests
            </Link>
          </nav>
        </div>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}