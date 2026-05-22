'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { IDReplacement, ReplacementStatusConfig } from '@/types/replace';

export default function AdminReplacements() {
  const [requests, setRequests] = useState<IDReplacement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending'>('pending');

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/id_replace/');
      let data = res.data;
      if (filter === 'pending') {
        data = data.filter((req: IDReplacement) => req.status === 'pending');
      }
      setRequests(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-10">
        <div>
          <div className="w-8 h-[2px] bg-[#e8c97e] mb-4" />
          <p className="text-[#8a7a5a] text-xs tracking-[0.22em] uppercase font-serif mb-2">
            Admin Panel
          </p>
          <h1 className="text-3xl font-normal font-serif text-[#1a1a2e]">
            ID Replacement Requests
          </h1>
        </div>

        <div className="flex gap-[2px] bg-[#d4cfc3] self-start">
          <button
            onClick={() => setFilter('pending')}
            className={`px-5 py-2.5 font-serif font-bold text-xs tracking-[0.08em] uppercase transition-colors ${
              filter === 'pending'
                ? 'bg-[#1a1a2e] text-[#e8c97e]'
                : 'bg-[#f5f4f0] text-[#9090a8] hover:bg-white'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2.5 font-serif font-bold text-xs tracking-[0.08em] uppercase transition-colors ${
              filter === 'all'
                ? 'bg-[#1a1a2e] text-[#e8c97e]'
                : 'bg-[#f5f4f0] text-[#9090a8] hover:bg-white'
            }`}
          >
            All Requests
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#9090a8] font-serif text-sm tracking-widest uppercase">
          Loading...
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#d4cfc3]">
          <div className="w-8 h-[2px] bg-[#e8c97e] mx-auto mb-5" />
          <p className="text-[#9090a8] font-serif text-sm">No requests found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-[2px] bg-[#d4cfc3]">
          {requests.map((req) => (
            <Link
              key={req.id}
              href={`/admin/replacements/${req.id}`}
              className="no-underline"
            >
              <div className="bg-white hover:bg-[#f5f4f0] transition-colors px-6 py-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4 cursor-pointer">
                <div>
                  <h3 className="text-base font-bold font-serif text-[#1a1a2e] tracking-[0.02em]">
                    {req.full_name}
                  </h3>
                  <p className="text-[#5a5a72] text-sm font-serif mt-0.5">
                    {req.student_number} · {req.course}
                  </p>
                  <p className="text-[#9090a8] text-xs font-serif mt-1">
                    {new Date(req.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`self-start md:self-center px-4 py-1.5 text-xs font-serif font-bold tracking-[0.08em] uppercase border ${ReplacementStatusConfig[req.status].bgColor} ${ReplacementStatusConfig[req.status].color}`}
                >
                  {ReplacementStatusConfig[req.status].label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}