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
        const res = await api.get('id_replace/');
        setRequests(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const getStatusStyle = (status: string) => {
    if (status === 'approved') return 'bg-green-50 text-green-700 border border-green-200';
    if (status === 'rejected') return 'bg-red-50 text-red-600 border border-red-200';
    return 'bg-[#f5f4f0] text-[#8a7a5a] border border-[#d4cfc3]';
  };

  const stats = {
    total: requests.length,
    approved: requests.filter(r => r.status === 'approved').length,
    pending: requests.filter(r => r.status === 'pending').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-[#f5f4f0] p-6 md:p-10">

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-10">
          <div>
            <div className="w-8 h-[2px] bg-[#e8c97e] mb-4" />
            <p className="text-[#8a7a5a] text-xs tracking-[0.22em] uppercase font-serif mb-2">
              Student Portal
            </p>
            <h1 className="text-3xl font-normal font-serif text-[#1a1a2e]">
              ID Replacement Dashboard
            </h1>
            <p className="text-[#9090a8] text-sm font-serif mt-1">
              Track and manage all your replacement requests
            </p>
          </div>

          <Link
            href="/student/replacement/new"
            className="inline-block bg-[#1a1a2e] hover:bg-[#252540] text-[#e8c97e] font-serif font-bold text-xs tracking-[0.1em] uppercase px-6 py-3 transition-colors no-underline self-start"
          >
            + New Request
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px] bg-[#d4cfc3] mb-10">
          {[
            { label: 'Total', value: stats.total, color: 'text-[#1a1a2e]' },
            { label: 'Approved', value: stats.approved, color: 'text-green-700' },
            { label: 'Pending', value: stats.pending, color: 'text-[#8a7a5a]' },
            { label: 'Rejected', value: stats.rejected, color: 'text-red-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#f5f4f0] p-5">
              <p className="text-[#9090a8] text-xs tracking-[0.1em] uppercase font-serif mb-1">
                {label}
              </p>
              <p className={`text-3xl font-normal font-serif ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#9090a8] font-serif text-sm tracking-widest uppercase">
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#d4cfc3]">
            <div className="w-8 h-[2px] bg-[#e8c97e] mx-auto mb-5" />
            <p className="text-[#9090a8] font-serif text-base mb-5">
              You have no replacement requests yet.
            </p>
            <Link
              href="/student/replacement/new"
              className="inline-block bg-[#1a1a2e] hover:bg-[#252540] text-[#e8c97e] font-serif font-bold text-xs tracking-[0.1em] uppercase px-6 py-3 transition-colors no-underline"
            >
              Create your first request
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-[2px] bg-[#d4cfc3]">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white px-6 py-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
              >
                <div>
                  <h3 className="text-base font-bold font-serif text-[#1a1a2e] tracking-[0.02em]">
                    {req.full_name}
                  </h3>
                  <p className="text-[#5a5a72] text-sm font-serif mt-0.5">
                    {req.student_number} · {req.course}
                  </p>
                  <p className="text-[#9090a8] text-xs font-serif mt-1">
                    Submitted {new Date(req.created_at).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`self-start md:self-center px-4 py-1.5 text-xs font-serif font-bold tracking-[0.08em] uppercase ${getStatusStyle(req.status)}`}
                >
                  {req.status_display || req.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}