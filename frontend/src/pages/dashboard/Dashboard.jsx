import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "framer-motion";
import gsap from "gsap";

export default function Dashboard() {
  const { user } = useAuth();

  useEffect(() => {
    gsap.fromTo(".dash-card", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" });
  }, []);

  const stats = [
    { label: "Level", value: user?.stats?.level ?? 1, sub: `XP ${user?.stats?.xp ?? 0}`, color: "primary" },
    { label: "Battles_Won", value: user?.stats?.battlesWon ?? 0, sub: `Lost ${user?.stats?.battlesLost ?? 0}`, color: "secondary" },
    { label: "Rank", value: user?.stats?.rank ?? "RECRUIT", sub: `${user?.role?.toUpperCase()} CLEARANCE`, color: "tertiary" },
  ];

  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
        <div>
          <p className="text-xs font-headline tracking-[0.3em] uppercase text-primary">Welcome_Operator</p>
          <h2 className="font-display text-4xl font-bold uppercase tracking-tight mt-1">{user?.displayName || user?.username}</h2>
          <p className="text-sm text-slate-400 mt-1">{user?.email} • <span className="text-primary uppercase">{user?.role}</span></p>
        </div>
        <div className="glass-panel px-6 py-3 border border-primary/20">
          <p className="text-[10px] font-headline uppercase tracking-widest text-slate-400">Credits</p>
          <p className="font-display text-2xl text-primary">{user?.stats?.credits ?? 1000} CR</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((s) => (
          <motion.div key={s.label} className="dash-card glass-panel p-6 border border-white/5 relative overflow-hidden group hover:border-primary/20 transition-colors">
            <p className="text-[10px] font-headline uppercase tracking-widest text-slate-500">{s.label}</p>
            <h4 className={`font-display text-3xl mt-2 ${s.color === "primary" ? "text-primary" : s.color === "secondary" ? "text-secondary" : "text-tertiary"}`}>{s.value}</h4>
            <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 border border-white/5">
          <h3 className="font-headline text-sm font-bold tracking-widest flex items-center gap-2">
            <span className="w-2 h-5 bg-primary inline-block" /> ACTIVE_MISSIONS
          </h3>
          <div className="mt-4 space-y-3">
            {[
              { title: "NEURAL_BREACH", progress: 75, status: "IN_PROGRESS" },
              { title: "VOID_WALKER_PROTOCOL", progress: 30, status: "QUEUED" },
              { title: "SYNTH_DRIVE_TRIAL", progress: 100, status: "COMPLETE" },
            ].map((m) => (
              <div key={m.title} className="bg-surface-container p-4 border-l-2 border-primary/40 flex justify-between items-center">
                <div>
                  <p className="text-sm font-headline font-bold">{m.title}</p>
                  <div className="w-40 h-1 bg-white/10 mt-2">
                    <div className="h-full bg-primary" style={{ width: `${m.progress}%` }} />
                  </div>
                </div>
                <span className={`text-[10px] font-headline px-2 py-1 border ${m.status === "COMPLETE" ? "bg-primary/20 text-primary border-primary/30" : "bg-white/5 text-slate-400 border-white/10"}`}>{m.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 border border-white/5">
          <h3 className="font-headline text-sm font-bold tracking-widest flex items-center gap-2">
            <span className="w-2 h-5 bg-secondary inline-block" /> QUICK_ACTIONS
          </h3>
          <div className="mt-4 space-y-3">
            <button className="w-full bg-primary text-black py-3 text-xs font-bold uppercase tracking-widest hover:brightness-110">Enter BattleZone</button>
            <button className="w-full border border-white/10 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white/5">Find Squad</button>
            <button className="w-full border border-white/10 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white/5">Customize Loadout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
