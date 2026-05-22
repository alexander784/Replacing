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

      <div className="flex">
        <div className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] p-6">
          <nav className="space-y-2">
            <Link href="/admin/dashboard" className="text-black flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-400 font-medium">
               Dashboard
            </Link>
            <Link href="/admin/replacements" className="text-black flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-400 font-medium bg-gray-100">
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