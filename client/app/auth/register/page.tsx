'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface FormErrors {
  email?: string;
  student_number?: string;
  password?: string;
  confirm_password?: string;
}

const STUDENT_NUMBER_REGEX = /^[A-Za-z0-9\/\-\.]{4,20}$/;

function validateRegister(data: {
  email: string;
  student_number: string;
  password: string;
  confirm_password: string;
}): FormErrors {
  const errors: FormErrors = {};

  if (!data.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!data.student_number.trim()) {
    errors.student_number = 'Student number is required.';
  } else if (!STUDENT_NUMBER_REGEX.test(data.student_number.trim())) {
    errors.student_number = 'Enter a valid student number (e.g. B/1234/2023).';
  }

  if (!data.password) {
    errors.password = 'Password is required.';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  } else if (!/[A-Z]/.test(data.password)) {
    errors.password = 'Password must contain at least one uppercase letter.';
  } else if (!/\d/.test(data.password)) {
    errors.password = 'Password must contain at least one number.';
  }

  if (!data.confirm_password) {
    errors.confirm_password = 'Please confirm your password.';
  } else if (data.password !== data.confirm_password) {
    errors.confirm_password = 'Passwords do not match.';
  }

  return errors;
}

function passwordStrength(password: string): { label: string; color: string; width: string } {
  if (!password) return { label: '', color: '', width: 'w-0' };
  if (password.length < 6) return { label: 'Weak', color: 'bg-red-400', width: 'w-1/3' };
  if (password.match(/^(?=.*[A-Z])(?=.*\d).{8,}$/))
    return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
  return { label: 'Medium', color: 'bg-[#e8c97e]', width: 'w-2/3' };
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    student_number: '',
    password: '',
    confirm_password: '',
  });

  const [touched, setTouched] = useState({
    email: false,
    student_number: false,
    password: false,
    confirm_password: false,
  });

  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  const errors = validateRegister(formData);
  const isValid = Object.keys(errors).length === 0;
  const strength = passwordStrength(formData.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, student_number: true, password: true, confirm_password: true });

    if (!isValid) return;

    setApiError('');
    setSuccess('');
    setLoading(true);

    try {
      await register(formData);
      setSuccess('Account created successfully!');
      setFormData({ email: '', student_number: '', password: '', confirm_password: '' });
      setTouched({ email: false, student_number: false, password: false, confirm_password: false });
    } catch (err: any) {
      setApiError(
        err.response?.data?.email?.[0] ||
        err.response?.data?.detail ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full border bg-[#f5f4f0] px-4 py-3 text-[#1a1a2e] font-serif text-sm outline-none transition placeholder:text-[#9090a8] ${
      touched[field] && errors[field]
        ? 'border-red-400 focus:border-red-400'
        : touched[field] && !errors[field]
        ? 'border-green-400 focus:border-green-400'
        : 'border-[#d4cfc3] focus:border-[#e8c97e]'
    }`;

  const labelClass =
    'block text-xs font-serif font-bold tracking-[0.08em] uppercase text-[#1a1a2e] mb-2';

  return (
    <div className="min-h-screen grid md:grid-cols-2">

      <div className="hidden md:flex flex-col justify-between bg-[#1a1a2e] text-white p-12">
        <div>
          <div className="w-10 h-[3px] bg-[#e8c97e] mb-8" />
          <p className="text-[#e8c97e] text-xs tracking-[0.22em] uppercase font-serif mb-4">
            Official Student Services
          </p>
          <h1 className="text-4xl font-normal font-serif leading-snug mb-4">
            Student Portal
          </h1>
          <p className="text-[#9090a8] text-base font-serif leading-relaxed">
            Request ID replacements, track approval status, and manage your
            student profile — all in one place.
          </p>
        </div>
        <div className="text-[#5a6080] text-xs tracking-[0.06em] font-serif">
          © {new Date().getFullYear()} University ID Portal. All rights reserved.
        </div>
      </div>

      <div className="flex items-center justify-center bg-[#f5f4f0] px-6 py-12">
        <div className="w-full max-w-md bg-white border border-[#d4cfc3] p-8 md:p-10">

          <div className="mb-8 text-center">
            <div className="w-8 h-[2px] bg-[#e8c97e] mx-auto mb-5" />
            <h2 className="text-2xl font-normal font-serif text-[#1a1a2e]">
              Create Account
            </h2>
            <p className="text-[#9090a8] text-sm font-serif mt-1">
              Student Registration
            </p>
          </div>

          {apiError && (
            <div className="border border-red-200 bg-red-50 text-red-600 px-4 py-3 text-sm font-serif mb-5">
              {apiError}
            </div>
          )}

          {success && (
            <div className="border border-[#d4cfc3] bg-[#f5f4f0] text-[#1a1a2e] px-4 py-3 text-sm font-serif mb-5">
              ✓ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            <div>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                placeholder="student@university.ac.ke"
                className={inputClass('email')}
              />
              {touched.email && errors.email && (
                <p className="text-red-500 text-xs font-serif mt-1.5">{errors.email}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Student Number</label>
              <input
                type="text"
                name="student_number"
                value={formData.student_number}
                onChange={handleChange}
                onBlur={() => handleBlur('student_number')}
                placeholder="e.g., B/1234/2023"
                className={inputClass('student_number')}
              />
              {touched.student_number && errors.student_number && (
                <p className="text-red-500 text-xs font-serif mt-1.5">{errors.student_number}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                placeholder="Min. 6 chars, one uppercase, one number"
                className={inputClass('password')}
              />
              {formData.password && (
                <div className="mt-2">
                  <div className="h-[3px] w-full bg-[#d4cfc3]">
                    <div className={`h-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                  </div>
                  <p className="text-xs font-serif mt-1 text-[#8a7a5a]">
                    Strength: <span className="font-bold">{strength.label}</span>
                  </p>
                </div>
              )}
              {touched.password && errors.password && (
                <p className="text-red-500 text-xs font-serif mt-1.5">{errors.password}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Confirm Password</label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                onBlur={() => handleBlur('confirm_password')}
                placeholder="Re-enter your password"
                className={inputClass('confirm_password')}
              />
              {touched.confirm_password && errors.confirm_password && (
                <p className="text-red-500 text-xs font-serif mt-1.5">{errors.confirm_password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a1a2e] hover:bg-[#252540] disabled:opacity-70 text-[#e8c97e] font-serif font-bold py-3.5 text-xs tracking-[0.1em] uppercase transition-colors mt-2"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <p className="text-center text-sm text-[#9090a8] font-serif mt-7">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-[#1a1a2e] font-bold border-b border-[#e8c97e] pb-0.5 no-underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}