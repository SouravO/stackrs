import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const url = window.location.href;
const domain = new URL(url).hostname;
const API = "http://"+domain+":3000";

export default function AdminUserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser();
  }, [id]);

  async function fetchUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const res = await fetch(`${API}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) throw new Error('User not found');

      const data = await res.json();
      setUser(data.user);
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

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#0a1120] pt-28 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-red-400">{error || 'User not found'}</p>
          <Link to="/admin/users" className="text-[#f9bb1a] text-xs font-bold uppercase tracking-widest hover:underline mt-4 inline-block">
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1120] pt-28 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/admin/users"
          className="text-[#f9bb1a] text-xs font-bold uppercase tracking-widest hover:underline mb-6 inline-block"
        >
          &larr; Back to Users
        </Link>

        <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-8">
          User Detail
        </h1>

        <div className="bg-[#121c31]/90 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-white/40 text-xs font-bold uppercase tracking-widest">Name</label>
              <p className="text-white text-lg font-medium mt-1">{user.name || '—'}</p>
            </div>
            <div>
              <label className="text-white/40 text-xs font-bold uppercase tracking-widest">Email</label>
              <p className="text-white text-lg font-medium mt-1">{user.email}</p>
            </div>
            <div>
              <label className="text-white/40 text-xs font-bold uppercase tracking-widest">Phone</label>
              <p className="text-white text-lg font-medium mt-1">{user.phone || '—'}</p>
            </div>
            <div>
              <label className="text-white/40 text-xs font-bold uppercase tracking-widest">Role</label>
              <p className="mt-1">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${user.role === 'ADMIN' ? 'bg-[#f9bb1a]/20 text-[#f9bb1a]' : 'bg-white/10 text-white/60'}`}>
                  {user.role}
                </span>
              </p>
            </div>
            <div>
              <label className="text-white/40 text-xs font-bold uppercase tracking-widest">Created At</label>
              <p className="text-white text-lg font-medium mt-1">{new Date(user.created_at).toLocaleString()}</p>
            </div>
            <div>
              <label className="text-white/40 text-xs font-bold uppercase tracking-widest">User ID</label>
              <p className="text-white/60 text-sm font-mono mt-1 break-all">{user.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
