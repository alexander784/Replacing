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

    if (id) {
      fetchRequest();
    }
  }, [id, router]);

  const handleApprove = async () => {
    const confirmed = window.confirm(
      'Approve this request?'
    );

    if (!confirmed) return;

    try {
      await api.patch(
        `/admin/id_replace/${id}/approve/`
      );

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
      await api.patch(
        `/admin/id_replace/${id}/reject/`,
        {
          rejection_reason: rejectReason,
        }
      );

      alert('Request Rejected');

      router.push('/admin/replacements');
    } catch (error) {
      console.error(error);

      alert('Failed to reject request');
    }
  };

  if (loading) {
    return <p>Loading request...</p>;
  }

  if (!request) {
    return <p>Request not found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="mb-6 text-blue-600 hover:underline"
      >
        ← Back to Requests
      </button>

      <div className="card p-8 bg-white rounded-3xl shadow-sm">
        <h1 className="text-black text-3xl font-bold mb-8">
          Review ID Replacement Request
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <label className="font-medium text-gray-600">
                Full Name
              </label>

              <p className="text-gray-900 text-xl font-semibold">
                {request.full_name}
              </p>
            </div>

            <div>
              <label className="font-medium text-black">
                Student Number
              </label>

              <p className="text-xl">
                {request.student_number}
              </p>
            </div>

            <div>
              <label className="font-medium text-black">
                Course
              </label>

              <p>{request.course}</p>
            </div>

            <div>
              <label className="font-medium text-gray-600">
                Year of Study
              </label>

              <p>{request.year_of_study}</p>
            </div>

            <div>
              <label className="font-medium text-gray-600">
                Reason
              </label>

              <p className="text-gray-700">
                {request.reason ||
                  'No reason provided'}
              </p>
            </div>
          </div>

          <div>
            <label className="font-medium block mb-3 text-gray-600">
              Uploaded Photo
            </label>

            {request.id_photo ? (
              <img
                src={request.id_photo}
                alt="Student Photo"
                className="w-72 h-72 object-cover rounded-2xl border border-gray-200"
              />
            ) : (
              <p className="text-gray-500">
                No image uploaded
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row gap-4">
          <button
            onClick={handleApprove}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-semibold text-lg transition-all"
          >
             Approve Request
          </button>

          <button
            onClick={() => setShowReject(true)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-semibold text-lg transition-all"
          >
             Reject Request
          </button>
        </div>
      </div>

      {showReject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">
              Reject Request
            </h2>

            <textarea
              className="w-full border border-gray-300 rounded-2xl p-4 h-32 outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Why are you rejecting this request?"
              value={rejectReason}
              onChange={(e) =>
                setRejectReason(e.target.value)
              }
            />

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowReject(false)}
                className="flex-1 py-3 border rounded-2xl"
              >
                Cancel
              </button>

              <button
                onClick={handleReject}
                className="flex-1 py-3 bg-red-600 text-white rounded-2xl"
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