'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';

export default function NewReplacementRequest() {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    full_name: user?.student_profile?.full_name || '',
    student_number: user?.student_number || '',
    course: '',
    year_of_study: '',
    reason: '',
  });

  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size must be less than 5MB");
        return;
      }
      setIdPhoto(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idPhoto) {
      setError("Please upload your passport photo");
      return;
    }

    setLoading(true);
    setError('');

    const data = new FormData();
    data.append('full_name', formData.full_name);
    data.append('student_number', formData.student_number);
    data.append('course', formData.course);
    data.append('year_of_study', formData.year_of_study);
    data.append('reason', formData.reason);
    data.append('id_photo', idPhoto);

    try {
      await api.post('/replacements/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert("Your ID replacement request has been submitted successfully!");
      router.push('/dashboard'); // or /replacements
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data?.id_photo?.[0] || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Request New ID Card</h1>
        <p className="text-gray-600 mt-2">Fill in your details to request a replacement ID</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student Number</label>
              <input
                type="text"
                name="student_number"
                value={formData.student_number}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course / Program</label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="e.g. Bachelor of Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year of Study</label>
              <select
                name="year_of_study"
                value={formData.year_of_study}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="">Select Year</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
                <option value="5">Year 5</option>
              </select>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Replacement</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={4}
              className="form-input resize-y"
              placeholder="Lost my ID card, It was damaged, Stolen, etc."
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passport Size Photo <span className="text-red-500">*</span>
            </label>
            
            <div className="mt-2 flex items-center gap-6">
              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-2xl w-48 h-48 flex flex-col items-center justify-center hover:border-blue-500 transition-colors">
                  <span className="text-4xl mb-2">📸</span>
                  <span className="text-sm font-medium text-gray-600">Upload Photo</span>
                  <span className="text-xs text-gray-500 mt-1">JPG or PNG (max 5MB)</span>
                </div>
                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </label>

              {preview && (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-48 h-48 object-cover rounded-2xl border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => { setPreview(null); setIdPhoto(null); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-lg font-semibold disabled:opacity-70"
          >
            {loading ? "Submitting Request..." : "Submit Replacement Request"}
          </button>
        </form>
      </div>
    </div>
  );
}