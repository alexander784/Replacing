'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { IDReplacement } from '@/types/replace';

export default function ReviewRequest() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [request, setRequest] = useState<IDReplacement | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState('');
  const [showReject, setShowReject] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await api.get(`/admin/id_replace/${id}/`);
        setRequest(res.data);
      } catch (error) {
        console.error(error);
        alert('Request not found');
        router.push('/admin/replacements');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchRequest();
  }, [id, router]);

  const handleApprove = async () => {
    const confirmed = window.confirm('Approve this request?');
    if (!confirmed) return;
    try {
      await api.patch(`/admin/id_replace/${id}/approve/`);
      alert('Request Approved Successfully!');
      router.push('/admin/replacements');
    } catch (error) {
      console.error(error);
      alert('Failed to approve request');
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    try {
      await api.patch(`/admin/id_replace/${id}/reject/`, {
        rejection_reason: rejectReason,
      });
      alert('Request Rejected');
      router.push('/admin/replacements');
    } catch (error) {
      console.error(error);
      alert('Failed to reject request');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-[#9090a8] font-serif text-sm tracking-widest uppercase">
        Loading request...
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-20 text-[#9090a8] font-serif text-sm">
        Request not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">

      {/* Back */}
      <button
        onClick={() => router.back()}
        className="mb-8 text-[#8a7a5a] font-serif text-xs tracking-[0.1em] uppercase hover:text-[#1a1a2e] transition-colors bg-transparent border-none cursor-pointer"
      >
        ← Back to Requests
      </button>

      {/* Card */}
      <div className="bg-white border border-[#d4cfc3] p-8 md:p-10">

        {/* Header */}
        <div className="mb-10">
          <div className="w-8 h-[2px] bg-[#e8c97e] mb-4" />
          <p className="text-[#8a7a5a] text-xs tracking-[0.22em] uppercase font-serif mb-2">
            Admin Review
          </p>
          <h1 className="text-3xl font-normal font-serif text-[#1a1a2e]">
            Review ID Replacement Request
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Details */}
          <div className="space-y-6">
            {[
              { label: 'Full Name', value: request.full_name },
              { label: 'Student Number', value: request.student_number },
              { label: 'Course', value: request.course },
              { label: 'Year of Study', value: request.year_of_study },
              { label: 'Reason', value: request.reason || 'No reason provided' },
            ].map(({ label, value }) => (
              <div key={label} className="border-b border-[#d4cfc3] pb-5">
                <p className="text-[#8a7a5a] text-xs tracking-[0.1em] uppercase font-serif mb-1">
                  {label}
                </p>
                <p className="text-[#1a1a2e] font-serif text-base">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Photo */}
          <div>
            <p className="text-[#8a7a5a] text-xs tracking-[0.1em] uppercase font-serif mb-3">
              Uploaded Photo
            </p>
            {request.id_photo ? (
              <img
                src={request.id_photo}
                alt="Student Photo"
                className="w-64 h-64 object-cover border border-[#d4cfc3]"
              />
            ) : (
              <div className="w-64 h-64 bg-[#f5f4f0] border border-[#d4cfc3] flex items-center justify-center">
                <p className="text-[#9090a8] font-serif text-sm">No image uploaded</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col md:flex-row gap-[2px] bg-[#d4cfc3]">
          <button
            onClick={handleApprove}
            className="flex-1 bg-[#f5f4f0] hover:bg-green-600 hover:text-white text-green-700 py-4 font-serif font-bold text-xs tracking-[0.1em] uppercase transition-colors border-none cursor-pointer"
          >
            ✓ Approve Request
          </button>
          <button
            onClick={() => setShowReject(true)}
            className="flex-1 bg-[#f5f4f0] hover:bg-red-600 hover:text-white text-red-600 py-4 font-serif font-bold text-xs tracking-[0.1em] uppercase transition-colors border-none cursor-pointer"
          >
            ✕ Reject Request
          </button>
        </div>
      </div>

      {/* Reject Modal */}
      {showReject && (
        <div className="fixed inset-0 bg-[#1a1a2e]/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white border border-[#d4cfc3] p-8 w-full max-w-lg">
            <div className="w-8 h-[2px] bg-[#e8c97e] mb-5" />
            <h2 className="text-xl font-normal font-serif text-[#1a1a2e] mb-5">
              Reject Request
            </h2>
            <textarea
              className="w-full border border-[#d4cfc3] bg-[#f5f4f0] p-4 h-32 outline-none focus:border-[#e8c97e] transition-colors font-serif text-sm text-[#1a1a2e] placeholder:text-[#9090a8] resize-none"
              placeholder="Why are you rejecting this request?"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-[2px] bg-[#d4cfc3] mt-6">
              <button
                onClick={() => setShowReject(false)}
                className="flex-1 py-3 bg-[#f5f4f0] hover:bg-white text-[#5a5a72] font-serif font-bold text-xs tracking-[0.08em] uppercase transition-colors border-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 py-3 bg-[#1a1a2e] hover:bg-[#252540] text-[#e8c97e] font-serif font-bold text-xs tracking-[0.08em] uppercase transition-colors border-none cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}