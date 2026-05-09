'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { IDReplacement,ReplacementStatusConfig } from '@/types/replace';

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-black text-3xl font-bold">ID Replacement Requests</h1>
        
        <div className="flex gap-3">
          <button onClick={() => setFilter('pending')} className={`px-5 py-2 rounded-xl ${filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-900 border'}`}>
            Pending
          </button>
          <button onClick={() => setFilter('all')} className={`px-5 py-2 rounded-xl ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-900 border'}`}>
            All Requests
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <Link key={req.id} href={`/admin/id_replace/${req.id}`}>
              <div className="card hover:shadow-md transition-all cursor-pointer flex justify-between items-center">
                <div>
                  <h3 className="text-black font-semibold">{req.full_name}</h3>
                  <p className="text-gray-600">{req.student_number} • {req.course}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(req.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className={`px-5 py-2 rounded-full text-sm font-medium ${ReplacementStatusConfig[req.status].bgColor} ${ReplacementStatusConfig[req.status].color}`}>
                  {ReplacementStatusConfig[req.status].label}
                </div>
              </div>
            </Link>
          ))}

          {requests.length === 0 && (
            <p className="text-center text-gray-500 py-10">No requests found.</p>
          )}
        </div>
      )}
    </div>
  );
}