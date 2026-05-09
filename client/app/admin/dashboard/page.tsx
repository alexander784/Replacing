'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('http://localhost:8000/admin/id_replace/');
        const requests = res.data;

        setStats({
          total: requests.length,
          pending: requests.filter((r: any) => r.status === 'pending').length,
          approved: requests.filter((r: any) => r.status === 'approved').length,
          rejected: requests.filter((r: any) => r.status === 'rejected').length,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-black text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <p className="text-gray-900">Total Requests</p>
          <p className="text-black text-5xl font-bold mt-3">{stats.total}</p>
        </div>
        <div className="card border-yellow-300">
          <p className="text-yellow-600">Pending</p>
          <p className="text-5xl font-bold mt-3 text-yellow-600">{stats.pending}</p>
        </div>
        <div className="card border-green-300">
          <p className="text-green-600">Approved</p>
          <p className="text-5xl font-bold mt-3 text-green-600">{stats.approved}</p>
        </div>
        <div className="card border-red-300">
          <p className="text-red-600">Rejected</p>
          <p className="text-5xl font-bold mt-3 text-red-600">{stats.rejected}</p>
        </div>
      </div>
    </div>
  );
}