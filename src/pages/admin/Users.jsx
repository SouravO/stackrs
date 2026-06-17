import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const url = window.location.href;
const domain = new URL(url).hostname;
const API = "http://"+domain+":3000";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const limit = 50;

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  async function fetchUsers(pageNum) {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const res = await fetch(`${API}/api/admin/users?page=${pageNum}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch users');

      const data = await res.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a1120] pt-28 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1120] pt-28 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            All Users
          </h1>
          <Link
            to="/admin/dashboard"
            className="text-[#f9bb1a] text-xs font-bold uppercase tracking-widest hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-[#121c31]/90 border border-white/10 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#f9bb1a] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 text-xs font-bold uppercase tracking-widest">
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Created</th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-white/5 text-white/80 text-sm hover:bg-white/5 transition-colors">
                        <td className="p-4 font-medium">{u.name || '—'}</td>
                        <td className="p-4">{u.email}</td>
                        <td className="p-4">{u.phone || '—'}</td>
                        <td className="p-4">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${u.role === 'ADMIN' ? 'bg-[#f9bb1a]/20 text-[#f9bb1a]' : 'bg-white/10 text-white/60'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-white/40">{new Date(u.created_at).toLocaleDateString()}</td>
                        <td className="p-4">
                          <Link
                            to={`/admin/users/${u.id}`}
                            className="text-[#f9bb1a] text-xs font-bold uppercase tracking-widest hover:underline"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-white/40">No users found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-white/10">
                  <p className="text-white/40 text-xs">
                    Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl bg-white/5 border border-white/10 text-white/60 disabled:opacity-30 hover:bg-white/10 transition-all"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= pagination.totalPages}
                      className="px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl bg-white/5 border border-white/10 text-white/60 disabled:opacity-30 hover:bg-white/10 transition-all"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
