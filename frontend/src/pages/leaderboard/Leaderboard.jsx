import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("global");
  const [data, setData] = useState({ leaderboard: [], battleLeaderboard: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [global, battle] = await Promise.all([
          api.get("/users/leaderboard"),
          api.get("/battles/leaderboard"),
        ]);
        setData({ leaderboard: global.data.data.leaderboard, battleLeaderboard: battle.data.data.leaderboard });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="pt-32 text-center text-slate-500">Loading leaderboards...</div>;

  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-headline tracking-[0.3em] uppercase text-primary">Rankings</p>
          <h2 className="font-display text-4xl font-bold uppercase">LEADERBOARD</h2>
        </div>
        <div className="flex gap-2 self-start">
          <button onClick={() => setActiveTab("global")} className={`px-4 py-2 text-xs font-headline tracking-widest border ${activeTab === "global" ? "bg-primary text-black border-primary" : "border-white/10 hover:border-primary/40"}`}>Global XP</button>
          <button onClick={() => setActiveTab("battle")} className={`px-4 py-2 text-xs font-headline tracking-widest border ${activeTab === "battle" ? "bg-secondary text-white border-secondary" : "border-white/10 hover:border-secondary/40"}`}>Battle Wins</button>
        </div>
      </div>

      <div className="glass-panel border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-[10px] font-headline uppercase tracking-widest text-slate-400">
              <tr>
                <th className="text-left p-3 w-16">#</th>
                <th className="text-left p-3">Operator</th>
                <th className="text-left p-3">Role</th>
                <th className="text-right p-3">{activeTab === "global" ? "XP" : "Wins"}</th>
                <th className="text-right p-3">Battles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(activeTab === "global" ? data.leaderboard : data.battleLeaderboard).map((u, idx) => (
                <tr key={u._id || u.username || idx} className={`hover:bg-white/[0.02] ${idx < 3 ? "bg-primary/5" : ""}`}>
                  <td className="p-3 font-display font-bold">
                    <span className={`w-8 h-8 flex items-center justify-center border ${idx === 0 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : idx === 1 ? "bg-slate-400/20 text-slate-300 border-slate-400/30" : idx === 2 ? "bg-amber-700/20 text-amber-600 border-amber-700/30" : "bg-white/5 text-slate-400 border-white/10"}`}>{idx + 1}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-surface-container border border-white/10 flex items-center justify-center font-bold">{(u.displayName || u.username)[0]}</div>
                      <div>
                        <p className="font-bold">{u.displayName || u.username}</p>
                        <p className="text-xs text-slate-500">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3"><span className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 font-headline uppercase">{u.role}</span></td>
                  <td className="p-3 text-right font-display text-primary">{activeTab === "global" ? (u.stats?.xp ?? "-") : u.wins}</td>
                  <td className="p-3 text-right text-slate-400">{u.stats?.battlesWon ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
