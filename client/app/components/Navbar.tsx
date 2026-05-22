'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('student/replacement');
  };

  return (
    <header className="bg-[#1a1a2e] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-10 h-16 flex justify-between items-center">
        <Link
          href="/"
          className="text-[#e8c97e] font-bold text-lg tracking-[0.05em] font-serif no-underline"
        >
          UNIVERSITY ID PORTAL
        </Link>

        <div className="flex items-center gap-6">
          {user && (
            <span className="text-[#9090a8] text-xs tracking-[0.06em] font-serif">
              {user.email}
            </span>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="text-[#1a1a2e] bg-[#e8c97e] hover:bg-[#d4b86a] px-5 py-1.5 font-serif font-bold text-xs tracking-[0.1em] uppercase transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-[#e8c97e] text-sm tracking-[0.08em] no-underline border-b border-[#e8c97e55] pb-0.5 font-serif uppercase"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="text-[#1a1a2e] bg-[#e8c97e] hover:bg-[#d4b86a] px-5 py-1.5 font-serif font-bold text-xs tracking-[0.1em] uppercase transition-colors no-underline"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}