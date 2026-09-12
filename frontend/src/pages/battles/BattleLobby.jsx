import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBattles, createBattle } from "../../features/battle/battleSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function BattleLobby() {
  const dispatch = useDispatch();
  const { battles, status } = useSelector((s) => s.battle);
  const { user } = useSelector((s) => s.auth);
  const [filter, setFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", type: "one_to_one", maxParticipants: 2 });

  useEffect(() => {
    const params = {};
    if (filter !== "all") params.type = filter;
    dispatch(fetchBattles(params));
  }, [dispatch, filter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user) return alert("Login to create battle");
    const payload = {
      title: form.title,
      description: form.description,
      type: form.type,
      maxParticipants: form.type === "one_to_one" ? 2 : parseInt(form.maxParticipants) || 8,
    };
    const result = await dispatch(createBattle(payload));
    if (result.meta.requestStatus === "fulfilled") {
      setShowCreate(false);
      setForm({ title: "", description: "", type: "one_to_one", maxParticipants: 2 });
    } else {
      alert(result.payload || "Failed to create");
    }
  };

  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-headline tracking-[0.3em] uppercase text-primary">Battle_Network</p>
          <h2 className="font-display text-4xl font-bold uppercase">BATTLE_LOBBY</h2>
          <p className="text-sm text-slate-400 mt-1">Create or join 1v1 duels and 1vN squad assaults • Live from MongoDB</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="self-start px-6 py-3 bg-primary text-black font-bold uppercase tracking-widest hover:brightness-110">
          {showCreate ? "Close" : "+ New Battle"}
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { key: "all", label: "ALL" },
          { key: "one_to_one", label: "1 vs 1" },
          { key: "one_to_many", label: "1 vs N" },
        ].map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={`px-4 py-2 text-xs font-headline tracking-widest border ${filter === f.key ? "bg-primary text-black border-primary" : "border-white/10 hover:border-primary/40"}`}>{f.label}</button>
        ))}
        <Link to="/battles/one-to-one" className="ml-auto hidden md:flex items-center gap-1 text-xs font-label uppercase tracking-widest border border-white/10 px-4 py-2 hover:border-primary">1v1_Arena →</Link>
        <Link to="/battles/one-to-many" className="hidden md:flex items-center gap-1 text-xs font-label uppercase tracking-widest border border-white/10 px-4 py-2 hover:border-secondary">1vN_Squad →</Link>
      </div>

      {showCreate && (
        <motion.form onSubmit={handleCreate} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 border border-primary/20 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-headline uppercase tracking-widest text-slate-400">Battle Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="NEURAL_DUEL_01" className="w-full mt-1 bg-surface-container border border-white/10 px-4 py-3 text-sm focus:border-primary outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-headline uppercase tracking-widest text-slate-400">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full mt-1 bg-surface-container border border-white/10 px-4 py-3 text-sm">
              <option value="one_to_one">One to One (1v1 • 2 players)</option>
              <option value="one_to_many">One to Many (1vN • 3-16 players)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] font-headline uppercase tracking-widest text-slate-400">Description</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="First to breach wins..." className="w-full mt-1 bg-surface-container border border-white/10 px-4 py-3 text-sm focus:border-primary outline-none" />
          </div>
          {form.type === "one_to_many" && (
            <div>
              <label className="text-[10px] font-headline uppercase tracking-widest text-slate-400">Max Participants (3-16)</label>
              <input type="number" min="3" max="16" value={form.maxParticipants} onChange={(e) => setForm({ ...form, maxParticipants: e.target.value })} className="w-full mt-1 bg-surface-container border border-white/10 px-4 py-3 text-sm" />
            </div>
          )}
          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-primary text-black py-3 font-bold uppercase tracking-widest hover:brightness-110">Deploy Battle</button>
          </div>
        </motion.form>
      )}

      {status === "loading" ? (
        <div className="text-center py-20 text-slate-500">Syncing battle grid...</div>
      ) : battles.length === 0 ? (
        <div className="text-center py-20 glass-panel border border-white/5">
          <span className="material-symbols-outlined text-5xl text-slate-600">swords</span>
          <p className="font-display text-xl uppercase mt-2">No battles in this sector</p>
          <p className="text-sm text-slate-500 mt-1">Create the first {filter === "one_to_one" ? "1v1 duel" : filter === "one_to_many" ? "1vN assault" : "battle"}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {battles.map((b) => (
            <motion.div key={b._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-5 border border-white/5 hover:border-primary/20 transition-colors flex flex-col">
              <div className="flex justify-between items-start">
                <span className={`text-[10px] font-headline px-2 py-1 border tracking-widest ${b.type === "one_to_one" ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary/10 text-secondary border-secondary/20"}`}>{b.type === "one_to_one" ? "1 vs 1" : `1 vs ${b.maxParticipants - 1}`}</span>
                <span className={`text-[10px] font-headline px-2 py-1 border uppercase ${b.status === "waiting" ? "bg-green-500/10 text-green-400 border-green-500/20" : b.status === "in_progress" ? "bg-tertiary/10 text-tertiary border-tertiary/20" : "bg-white/5 text-slate-400"}`}>{b.status}</span>
              </div>
              <h4 className="font-display font-bold uppercase mt-3 text-lg leading-tight">{b.title}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{b.description || "No description"}</p>
              <div className="flex items-center gap-2 mt-3 text-[10px] font-label uppercase tracking-widest text-slate-500">
                <span className="material-symbols-outlined text-xs">tag</span> {b.code} • {b.participants?.length}/{b.maxParticipants}
              </div>
              <div className="flex -space-x-2 mt-3">
                {b.participants?.slice(0, 5).map((p, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-surface-container flex items-center justify-center text-xs font-bold">{p.username?.[0]?.toUpperCase()}</div>
                ))}
                {b.participants?.length > 5 && <div className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center text-xs font-bold">+{b.participants.length - 5}</div>}
              </div>
              <Link to={`/battles/${b._id}`} className="mt-4 w-full text-center py-2 bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-black hover:border-primary transition-colors">Enter_Room →</Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
