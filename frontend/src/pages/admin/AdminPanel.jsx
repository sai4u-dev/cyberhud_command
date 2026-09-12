import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";

export default function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/users?limit=20"),
        ]);
        setStats(statsRes.data.data);
        setUsers(usersRes.data.data.users);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    try {
      await api.patch(`/users/${id}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role: newRole } : u)));
    } catch (e) {
      alert(e.response?.data?.message || "Failed to update role");
    }
  };

  const handleBan = async (id) => {
    try {
      const { data } = await api.patch(`/users/${id}/ban`);
      setUsers((prev) => prev.map((u) => (u._id === id ? data.data.user : u)));
    } catch (e) {
      alert(e.response?.data?.message || "Failed");
    }
  };

  if (loading) return <div className="pt-32 text-center text-slate-500">Loading command center...</div>;

  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-xs font-headline tracking-[0.3em] uppercase text-secondary">Admin_Command</p>
          <h2 className="font-display text-4xl font-bold uppercase">CONTROL_CENTER</h2>
        </div>
        <div className="hidden md:flex gap-2 text-[10px] font-label uppercase tracking-widest">
          <span className="px-3 py-1 bg-primary/20 text-primary border border-primary/30">{stats?.totalUsers ?? 0} Operators</span>
          <span className="px-3 py-1 bg-white/5 text-slate-400 border border-white/10">{stats?.active ?? 0} Active</span>
          <span className="px-3 py-1 bg-error/20 text-error border border-error/30">{stats?.banned ?? 0} Banned</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(stats?.byRole || {}).map(([role, count]) => (
          <motion.div key={role} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-4 border border-white/5">
            <p className="text-[10px] font-headline uppercase text-slate-500">{role}</p>
            <p className="font-display text-2xl text-primary mt-1">{count}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-panel border border-white/5 overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b border-white/5">
          <h3 className="font-headline text-sm font-bold tracking-widest">OPERATOR_REGISTRY</h3>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search username/email..."
            className="bg-surface-container border border-white/10 px-3 py-2 text-xs w-56 focus:border-primary focus:outline-none" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-[10px] font-headline uppercase tracking-widest text-slate-400">
              <tr>
                <th className="text-left p-3">Operator</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users
                .filter((u) => !search || u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
                .map((u) => (
                  <tr key={u._id} className="hover:bg-white/[0.02]">
                    <td className="p-3">
                      <p className="font-headline font-bold text-white">{u.username}</p>
                      <p className="text-xs text-slate-500">{u.displayName}</p>
                    </td>
                    <td className="p-3 text-slate-300">{u.email}</td>
                    <td className="p-3">
                      <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="bg-surface-container border border-white/10 px-2 py-1 text-xs">
                        <option value="user">user</option>
                        <option value="moderator">moderator</option>
                        <option value="organizer">organizer</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] px-2 py-1 border font-headline uppercase ${u.status === "active" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-error/20 text-error border-error/30"}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => handleBan(u._id)} className="text-xs px-3 py-1 border border-white/10 hover:bg-white/5">
                        {u.status === "banned" ? "Unban" : "Ban"}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
