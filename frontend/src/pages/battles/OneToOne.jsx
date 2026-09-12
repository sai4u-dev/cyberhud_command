import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBattles, createBattle } from "../../features/battle/battleSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function OneToOne() {
  const dispatch = useDispatch();
  const { battles } = useSelector((s) => s.battle);

  useEffect(() => {
    dispatch(fetchBattles({ type: "one_to_one" }));
  }, [dispatch]);

  const handleQuickChallenge = async () => {
    const title = `DUEL_${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    await dispatch(createBattle({ title, description: "Ranked 1v1 duel — first breach wins", type: "one_to_one" }));
    dispatch(fetchBattles({ type: "one_to_one" }));
  };

  const duelBattles = battles.filter((b) => b.type === "one_to_one");

  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
      <div className="relative overflow-hidden glass-panel p-8 md:p-10 border border-primary/20 mb-8">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/10 blur-[80px] rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <p className="text-xs font-headline tracking-[0.3em] uppercase text-primary">Duel_Protocol</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase">ONE_TO_ONE</h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">Face a single opponent. No squad, no backup. Pure skill, latency, and nerve. Ranked duels affect global leaderboard.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={handleQuickChallenge} className="px-6 py-3 bg-primary text-black font-bold uppercase tracking-widest hover:brightness-110">Quick Challenge</button>
              <Link to="/battles" className="px-6 py-3 border border-white/10 font-bold uppercase tracking-widest hover:bg-white/5">All Battles</Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 self-start">
            <div className="glass-panel p-4 border border-white/5 text-center">
              <p className="text-2xl font-display text-primary">{duelBattles.filter((b) => b.status === "waiting").length}</p>
              <p className="text-[10px] font-label uppercase tracking-widest text-slate-500">Waiting</p>
            </div>
            <div className="glass-panel p-4 border border-white/5 text-center">
              <p className="text-2xl font-display text-tertiary">{duelBattles.filter((b) => b.status === "in_progress").length}</p>
              <p className="text-[10px] font-label uppercase tracking-widest text-slate-500">Live</p>
            </div>
            <div className="glass-panel p-4 border border-white/5 text-center">
              <p className="text-2xl font-display text-secondary">{duelBattles.length}</p>
              <p className="text-[10px] font-label uppercase tracking-widest text-slate-500">Total</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {duelBattles.length === 0 ? (
          <div className="md:col-span-2 text-center py-16 glass-panel border border-white/5">
            <span className="material-symbols-outlined text-5xl text-slate-600">person</span>
            <p className="mt-2 font-display uppercase">No duels active</p>
            <p className="text-sm text-slate-500">Be the first to challenge the grid.</p>
          </div>
        ) : (
          duelBattles.map((b) => (
            <motion.div key={b._id} whileHover={{ y: -3 }} className="glass-panel p-6 border border-white/5 hover:border-primary/20">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-display font-bold uppercase text-lg">{b.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{b.code} • Host: {b.host?.username || b.participants?.[0]?.username}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 border font-headline uppercase ${b.status === "waiting" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-tertiary/10 text-tertiary"}`}>{b.status}</span>
              </div>

              <div className="flex items-center gap-4 mt-6">
                <div className="flex-1 glass-panel p-3 border border-primary/20 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold">{b.participants?.[0]?.username?.[0]?.toUpperCase()}</div>
                  <p className="text-xs font-bold mt-2">{b.participants?.[0]?.username}</p>
                  <p className="text-[10px] text-primary">HOST • READY</p>
                </div>
                <span className="font-display text-xl text-slate-600">VS</span>
                <div className="flex-1 glass-panel p-3 border border-white/5 text-center">
                  {b.participants?.[1] ? (
                    <>
                      <div className="w-12 h-12 mx-auto rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center font-bold">{b.participants[1].username?.[0]?.toUpperCase()}</div>
                      <p className="text-xs font-bold mt-2">{b.participants[1].username}</p>
                      <p className="text-[10px] text-secondary">{b.participants[1].isReady ? "READY" : "JOINED"}</p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center"><span className="material-symbols-outlined text-slate-500">person_add</span></div>
                      <p className="text-xs font-bold mt-2 text-slate-500">Awaiting Challenger</p>
                      <p className="text-[10px] text-slate-600">Open Slot</p>
                    </>
                  )}
                </div>
              </div>

              <Link to={`/battles/${b._id}`} className="mt-6 block w-full text-center py-3 bg-primary text-black font-bold uppercase tracking-widest hover:brightness-110">Enter Duel →</Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
