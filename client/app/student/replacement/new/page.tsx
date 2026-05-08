'use client';

import { useState } from 'react';
import api from '@/lib/axios';

export default function NewReplacementRequest() {
  const [formData, setFormData] = useState({
    full_name: '',
    student_number: '',
    course: '',
    year_of_study: '',
    reason: '',
  });

  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
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
      setError('Please upload your passport photo');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const data = new FormData();

    data.append('full_name', formData.full_name);
    data.append('student_number', formData.student_number);
    data.append('course', formData.course);
    data.append('year_of_study', formData.year_of_study);
    data.append('reason', formData.reason);
    data.append('id_photo', idPhoto);

    try {
      await api.post('/id_replace/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Details successfully submitted!');

      setFormData({
        full_name: '',
        student_number: '',
        course: '',
        year_of_study: '',
        reason: '',
      });

      setIdPhoto(null);
      setPreview(null);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.id_photo?.[0] ||
          'Failed to submit request'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-900 max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black">
          Request New ID Card
        </h1>

        <p className="text-black mt-2">
          Fill in your details to request a replacement ID
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="text-black w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Number
              </label>

              <input
                type="text"
                name="student_number"
                value={formData.student_number}
                onChange={handleChange}
                required
                placeholder="e.g. SCT221-0001/2022"
                className="text-black w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course / Program
              </label>

              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                placeholder="Bachelor of Computer Science"
                className="text-black w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year of Study
              </label>

              <select
                name="year_of_study"
                value={formData.year_of_study}
                onChange={handleChange}
                required
                className="text-black w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Replacement
            </label>

            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={4}
              placeholder="Lost ID, damaged card, stolen card, etc."
              className="text-black w-full rounded-xl border border-gray-300 px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Passport Size Photo
            </label>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <label className="cursor-pointer">
                <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center hover:border-blue-500 transition">
                  <span className="text-5xl">📸</span>

                  <p className="mt-3 text-sm font-medium text-gray-700">
                    Upload Photo
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    PNG or JPG • Max 5MB
                  </p>
                </div>

                <input
                  type="file"
                  accept="image/png, image/jpeg"
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
                    onClick={() => {
                      setPreview(null);
                      setIdPhoto(null);
                    }}
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white text-sm flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl transition disabled:opacity-70"
          >
            {loading
              ? 'Submitting Request...'
              : 'Submit Replacement Request'}
          </button>
        </form>
      </div>
    </div>
  );
}