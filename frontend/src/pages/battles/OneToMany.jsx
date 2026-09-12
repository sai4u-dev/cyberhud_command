import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBattles, createBattle } from "../../features/battle/battleSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function OneToMany() {
  const dispatch = useDispatch();
  const { battles } = useSelector((s) => s.battle);
  const [form, setForm] = useState({ title: "", maxParticipants: 8 });

  useEffect(() => {
    dispatch(fetchBattles({ type: "one_to_many" }));
  }, [dispatch]);

  const squadBattles = battles.filter((b) => b.type === "one_to_many");

  const handleCreate = async (e) => {
    e.preventDefault();
    await dispatch(createBattle({ title: form.title || `SQUAD_${Math.random().toString(36).slice(2, 6).toUpperCase()}`, description: "Squad assault — team breach protocol", type: "one_to_many", maxParticipants: parseInt(form.maxParticipants) }));
    dispatch(fetchBattles({ type: "one_to_many" }));
    setForm({ title: "", maxParticipants: 8 });
  };

  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
      <div className="relative overflow-hidden glass-panel p-8 md:p-10 border border-secondary/20 mb-8">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-secondary/10 blur-[80px] rounded-full" />
        <div className="relative z-10">
          <p className="text-xs font-headline tracking-[0.3em] uppercase text-secondary">Squad_Protocol</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase">ONE_TO_MANY</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl">One host vs many challengers. Up to 16 operators. Last squad standing claims the prize. Perfect for tournaments and clan wars.</p>

          <form onSubmit={handleCreate} className="mt-6 flex flex-col md:flex-row gap-3 max-w-2xl">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Squad title (optional)" className="flex-1 bg-surface-container border border-white/10 px-4 py-3 text-sm placeholder:text-slate-500 focus:border-secondary outline-none" />
            <select value={form.maxParticipants} onChange={(e) => setForm({ ...form, maxParticipants: e.target.value })} className="bg-surface-container border border-white/10 px-4 py-3 text-sm">
              <option value="4">4 Players</option><option value="6">6 Players</option><option value="8">8 Players</option><option value="12">12 Players</option><option value="16">16 Players</option>
            </select>
            <button type="submit" className="px-6 py-3 bg-secondary text-white font-bold uppercase tracking-widest hover:brightness-110">Create_Squad</button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {squadBattles.length === 0 ? (
          <div className="lg:col-span-2 text-center py-16 glass-panel border border-white/5">
            <span className="material-symbols-outlined text-5xl text-slate-600">groups</span>
            <p className="mt-2 font-display uppercase">No squads deployed</p>
          </div>
        ) : (
          squadBattles.map((b) => (
            <motion.div key={b._id} whileHover={{ y: -3 }} className="glass-panel p-6 border border-white/5 hover:border-secondary/20">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-display font-bold uppercase text-lg">{b.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{b.code} • {b.mapZone?.name || "NEURAL_GRID"} • {b.participants.length}/{b.maxParticipants}</p>
                </div>
                <span className="text-[10px] px-2 py-1 bg-secondary/10 text-secondary border border-secondary/20 font-headline uppercase">{b.status}</span>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-[10px] font-headline uppercase tracking-widest text-slate-500 mb-1"><span>Fill</span><span>{Math.round((b.participants.length / b.maxParticipants) * 100)}%</span></div>
                <div className="w-full h-2 bg-white/5 border border-white/5">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(b.participants.length / b.maxParticipants) * 100}%` }} transition={{ duration: 0.8 }} className="h-full bg-secondary" />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {b.participants.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 bg-surface-container border border-white/10 px-3 py-2">
                    <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-[10px] font-bold">{p.username[0].toUpperCase()}</div>
                    <span className="text-xs font-bold">{p.username}</span>
                    <span className={`w-2 h-2 rounded-full ${p.isReady ? "bg-green-500" : "bg-slate-500"}`} />
                  </div>
                ))}
                {Array.from({ length: Math.max(0, b.maxParticipants - b.participants.length) }).map((_, i) => (
                  <div key={`empty-${i}`} className="w-12 h-12 border border-dashed border-white/10 flex items-center justify-center"><span className="material-symbols-outlined text-slate-600 text-sm">add</span></div>
                ))}
              </div>

              <Link to={`/battles/${b._id}`} className="mt-4 block w-full text-center py-3 bg-white/5 border border-white/10 font-bold uppercase tracking-widest hover:bg-secondary hover:text-white hover:border-secondary transition-colors">Join_Squad →</Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
