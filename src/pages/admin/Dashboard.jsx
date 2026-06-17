import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const url = window.location.href;
const domain = new URL(url).hostname;
const API = "http://"+domain+":3000";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const res = await fetch(`${API}/api/admin/users?limit=5`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1120] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#f9bb1a] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a1120] flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1120] pt-28 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-8">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#121c31]/90 border border-white/10 rounded-2xl p-6">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Total Users</p>
            <p className="text-4xl font-black text-white">{stats?.pagination?.total ?? 0}</p>
          </div>
          <div className="bg-[#121c31]/90 border border-white/10 rounded-2xl p-6">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Current Page</p>
            <p className="text-4xl font-black text-white">{stats?.pagination?.page ?? 0}</p>
          </div>
          <div className="bg-[#121c31]/90 border border-white/10 rounded-2xl p-6">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Per Page</p>
            <p className="text-4xl font-black text-white">{stats?.pagination?.limit ?? 0}</p>
          </div>
        </div>

        <div className="bg-[#121c31]/90 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Recent Users</h2>
            <Link
              to="/admin/users"
              className="text-[#f9bb1a] text-xs font-bold uppercase tracking-widest hover:underline"
            >
              View All
            </Link>
          </div>

          {stats?.users?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 text-xs font-bold uppercase tracking-widest">
                    <th className="pb-3 pr-4">Name</th>
                    <th className="pb-3 pr-4">Email</th>
                    <th className="pb-3 pr-4">Role</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.users.map((u) => (
                    <tr key={u.id} className="border-b border-white/5 text-white/80 text-sm">
                      <td className="py-3 pr-4">{u.name || '—'}</td>
                      <td className="py-3 pr-4">{u.email}</td>
                      <td className="py-3 pr-4">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${u.role === 'ADMIN' ? 'bg-[#f9bb1a]/20 text-[#f9bb1a]' : 'bg-white/10 text-white/60'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3">{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-white/40 text-sm">No users yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
