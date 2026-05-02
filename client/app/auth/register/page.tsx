'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    student_number: '',
    password: '',
    confirm_password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const passwordStrength = () => {
    if (formData.password.length < 6) return 'Weak';
    if (formData.password.match(/^(?=.*[A-Z])(?=.*\d).+$/)) return 'Strong';
    return 'Medium';
  };

  const passwordsMatch =
    formData.password &&
    formData.password === formData.confirm_password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register(formData);

      setSuccess(' Account created successfully!!!');

      setFormData({
        email: '',
        student_number: '',
        password: '',
        confirm_password: '',
      });

    } catch (err: any) {
      setError(
        err.response?.data?.email?.[0] ||
        err.response?.data?.detail ||
        'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">

      <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-12">
        <h1 className="text-4xl font-bold mb-4">Student Portal</h1>
        <p className="text-lg opacity-90">
          Request ID replacements, track approval status, and manage your student profile — all in one place.
        </p>
      </div>

      <div className="flex items-center justify-center bg-blue-200 px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-black text-2xl font-semibold text-center mb-1">
            Create Account
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Student Registration
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-5 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-5 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="text-black w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Student Number
              </label>
              <input
                type="text"
                name="student_number"
                value={formData.student_number}
                onChange={handleChange}
                required
                placeholder="e.g., B/1234/2023"
                className="w-full px-4 py-2.5 border rounded-xl text-black focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="text-black w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />

              {formData.password && (
                <p className="text-xs mt-1 text-gray-500">
                  Strength: <span className="font-medium">{passwordStrength()}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                className={`text-black w-full px-4 py-2.5 border rounded-xl outline-none ${
                  formData.confirm_password
                    ? passwordsMatch
                      ? 'border-green-500'
                      : 'border-red-500'
                    : ''
                }`}
              />

              {formData.confirm_password && !passwordsMatch && (
                <p className="text-xs text-red-500 mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}