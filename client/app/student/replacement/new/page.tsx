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
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.append('id_photo', idPhoto);

    try {
      await api.post('/id_replace/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Request submitted successfully!');
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

  const inputClass =
    'w-full border border-[#d4cfc3] bg-[#f5f4f0] px-5 py-3 text-[#1a1a2e] font-serif text-sm focus:border-[#e8c97e] focus:ring-0 outline-none transition placeholder:text-[#9090a8]';

  const labelClass =
    'block text-xs font-serif font-bold tracking-[0.08em] uppercase text-[#1a1a2e] mb-2';

  return (
    <div className="min-h-screen bg-[#f5f4f0] flex items-center justify-center p-6">
      <div className="w-full max-w-lg mx-auto">

        <div className="text-center mb-10">
          <div className="w-10 h-[3px] bg-[#e8c97e] mx-auto mb-6" />
          <p className="text-[#8a7a5a] text-xs tracking-[0.22em] uppercase font-serif mb-3">
            Student Services
          </p>
          <h1 className="text-3xl font-normal font-serif text-[#1a1a2e]">
            ID Replacement Request
          </h1>
          <p className="text-[#9090a8] text-sm font-serif mt-2">
            Please fill in your details accurately
          </p>
        </div>

        <div className="bg-white border border-[#d4cfc3] p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Student Number</label>
              <input
                type="text"
                name="student_number"
                value={formData.student_number}
                onChange={handleChange}
                required
                placeholder="e.g. SCT221-0001/2022"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Course / Program</label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                placeholder="Bachelor of Computer Science"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Year of Study</label>
              <select
                name="year_of_study"
                value={formData.year_of_study}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select Year</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
                <option value="5">Year 5</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Reason for Replacement</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={3}
                placeholder="Lost ID, damaged, stolen, etc."
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className={labelClass}>Passport Size Photo</label>
              <div className="flex flex-col sm:flex-row gap-6 items-start mt-1">
                <label className="cursor-pointer">
                  <div className="w-40 h-40 border-2 border-dashed border-[#d4cfc3] bg-[#f5f4f0] flex flex-col items-center justify-center hover:border-[#e8c97e] transition-colors">
                    <span className="text-4xl mb-2">📸</span>
                    <p className="font-serif font-bold text-xs tracking-[0.08em] uppercase text-[#1a1a2e]">
                      Upload Photo
                    </p>
                    <p className="text-[10px] text-[#9090a8] font-serif mt-1">
                      PNG or JPG · Max 5MB
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
                      className="w-40 h-40 object-cover border border-[#d4cfc3]"
                    />
                    <button
                      type="button"
                      onClick={() => { setPreview(null); setIdPhoto(null); }}
                      className="absolute -top-3 -right-3 bg-[#1a1a2e] text-[#e8c97e] w-7 h-7 flex items-center justify-center text-sm hover:bg-[#252540] transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="border border-red-200 bg-red-50 text-red-600 px-4 py-3 text-sm font-serif">
                {error}
              </div>
            )}

            {success && (
              <div className="border border-[#d4cfc3] bg-[#f5f4f0] text-[#1a1a2e] px-4 py-3 text-sm font-serif">
                ✓ {success}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a1a2e] hover:bg-[#252540] disabled:opacity-70 text-[#e8c97e] font-serif font-bold py-3.5 text-xs tracking-[0.1em] uppercase transition-colors mt-2"
            >
              {loading ? 'Submitting...' : 'Submit Replacement Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}