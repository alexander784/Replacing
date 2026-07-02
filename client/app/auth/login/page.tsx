'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface FormErrors {
  email?: string;
  password?: string;
}

function validateLogin(email: string, password: string): FormErrors {
  const errors: FormErrors = {};

  if (!email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return errors;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const errors = validateLogin(email, password);
  const isValid = Object.keys(errors).length === 0;

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!isValid) return;

    setApiError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/student/replacement');
      }
    } catch (err: any) {
      console.log('LOGIN ERROR:', err);
      setApiError(
        err.response?.data?.detail || 'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: keyof FormErrors) =>
    `mt-2 w-full px-4 py-3 border bg-[#f5f4f0] font-serif text-sm text-[#1a1a2e] outline-none transition placeholder:text-[#9090a8] ${
      touched[field] && errors[field]
        ? 'border-red-400 focus:border-red-400'
        : touched[field] && !errors[field]
        ? 'border-green-400 focus:border-green-400'
        : 'border-[#d4cfc3] focus:border-[#e8c97e]'
    }`;

  const labelClass = 'block text-xs font-serif font-bold tracking-[0.08em] uppercase text-[#1a1a2e] mb-0';

  return (
    <div className="min-h-screen flex">

      <div className="hidden lg:flex w-1/2 bg-[#1a1a2e] text-white p-12 flex-col justify-between">
        <div>
          <div className="w-10 h-[3px] bg-[#e8c97e] mb-8" />
          <p className="text-[#e8c97e] text-xs tracking-[0.22em] uppercase font-serif mb-4">
            Official Student Services
          </p>
          <h1 className="text-4xl font-normal font-serif leading-snug mb-4">
            University ID Portal
          </h1>
          <p className="text-[#9090a8] text-base font-serif leading-relaxed">
            Securely manage student identification,
            replacements, and approvals in one place.
          </p>
        </div>
        <div className="text-[#5a6080] text-xs tracking-[0.06em] font-serif">
          © {new Date().getFullYear()} University System
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#f5f4f0] px-6">
        <div className="w-full max-w-md bg-white border border-[#d4cfc3] p-8 md:p-10">

          <div className="mb-8 text-center">
            <div className="w-8 h-[2px] bg-[#e8c97e] mx-auto mb-5" />
            <h2 className="text-2xl font-normal font-serif text-[#1a1a2e]">
              Welcome Back
            </h2>
            <p className="text-[#9090a8] text-sm font-serif mt-1">
              Sign in to continue
            </p>
          </div>

          {apiError && (
            <div className="border border-red-200 bg-red-50 text-red-600 px-4 py-3 text-sm font-serif mb-5">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            <div>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="student@university.ac.ke"
                className={inputClass('email')}
              />
              {touched.email && errors.email && (
                <p className="text-red-500 text-xs font-serif mt-1.5">{errors.email}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="Enter your password"
                className={inputClass('password')}
              />
              {touched.password && errors.password && (
                <p className="text-red-500 text-xs font-serif mt-1.5">{errors.password}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a1a2e] hover:bg-[#252540] disabled:opacity-70 text-[#e8c97e] font-serif font-bold py-3.5 text-xs tracking-[0.1em] uppercase transition-colors flex items-center justify-center mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#e8c97e] border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#9090a8] font-serif mt-7">
            Don't have an account?{' '}
            <Link
              href="/auth/register"
              className="text-[#1a1a2e] font-bold border-b border-[#e8c97e] pb-0.5 no-underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}