'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { IDReplacement } from '@/types/replace';
import Link from 'next/link';

export default function MyReplacements() {
  const [requests, setRequests] = useState<IDReplacement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get('/replacement/');
        setRequests(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getStatusColor = (status: string) => {
    if (status === 'approved') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'rejected') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  const stats = {
    total: requests.length,
    approved: requests.filter(r => r.status === 'approved').length,
    pending: requests.filter(r => r.status === 'pending').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 text-white p-6">
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">ID Replacement Dashboard</h1>
          <p className="text-blue-200 text-sm mt-1">
            Track and manage all your replacement requests
          </p>
        </div>

        <Link
          href="/student/replacement/new"
          className="bg-blue-500 hover:bg-blue-600 transition px-6 py-3 rounded-xl font-medium shadow-lg"
        >
          + New Request
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-800/40 rounded-2xl p-4 border border-blue-700">
          <p className="text-sm text-blue-200">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-green-800/20 rounded-2xl p-4 border border-green-700">
          <p className="text-sm text-green-300">Approved</p>
          <p className="text-2xl font-bold">{stats.approved}</p>
        </div>

        <div className="bg-yellow-800/20 rounded-2xl p-4 border border-yellow-700">
          <p className="text-sm text-yellow-300">Pending</p>
          <p className="text-2xl font-bold">{stats.pending}</p>
        </div>

        <div className="bg-red-800/20 rounded-2xl p-4 border border-red-700">
          <p className="text-sm text-red-300">Rejected</p>
          <p className="text-2xl font-bold">{stats.rejected}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-blue-200">
          Loading requests...
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 bg-blue-900/40 border border-blue-800 rounded-3xl">
          <p className="text-lg text-blue-200">
            You have no replacement requests yet.
          </p>

          <Link
            href="/student/replacement/new"
            className="inline-block mt-4 bg-blue-500 px-5 py-2 rounded-xl"
          >
            Create your first request
          </Link>
        </div>
      ) : (
        <div className="grid gap-5">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-blue-900/40 border border-blue-800 rounded-2xl p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4 shadow-lg hover:shadow-xl transition"
            >
              <div>
                <h3 className="text-lg font-semibold">{req.full_name}</h3>

                <p className="text-blue-200 text-sm">
                  {req.student_number} • {req.course}
                </p>

                <p className="text-xs text-blue-400 mt-1">
                  Submitted {new Date(req.created_at).toLocaleDateString()}
                </p>
              </div>

              <div
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                  req.status
                )}`}
              >
                {req.status_display || req.status.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}