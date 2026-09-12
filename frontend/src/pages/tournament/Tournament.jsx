import { motion } from "framer-motion";

const TOURNAMENTS = [
  { name: "NEURAL_BREACH_CHAMPIONSHIP", prize: "120 ETH", players: 128, status: "LIVE", progress: 75 },
  { name: "VOID_ROYALE_SEASON_3", prize: "80 ETH", players: 64, status: "REGISTERING", progress: 30 },
  { name: "SYNTH_DRIVE_GRAND_PRIX", prize: "45 ETH", players: 32, status: "UPCOMING", progress: 0 },
];

export default function Tournament() {
  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-headline tracking-[0.3em] uppercase text-tertiary">Championship</p>
        <h2 className="font-display text-4xl font-bold uppercase">TOURNAMENTS</h2>
        <p className="text-sm text-slate-400 mt-1">Seasonal competitions • Entry via battles • Prize pools in ETH</p>
      </div>

      <div className="space-y-4">
        {TOURNAMENTS.map((t, i) => (
          <motion.div key={t.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="glass-panel p-6 border border-white/5 hover:border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-headline px-2 py-1 border uppercase ${t.status === "LIVE" ? "bg-tertiary/10 text-tertiary border-tertiary/20" : t.status === "REGISTERING" ? "bg-primary/10 text-primary border-primary/20" : "bg-white/5 text-slate-400 border-white/10"}`}>{t.status}</span>
                <span className="text-xs text-slate-500">{t.players} operators</span>
              </div>
              <h4 className="font-display font-bold uppercase mt-2">{t.name}</h4>
              <div className="w-full max-w-md h-2 bg-white/5 mt-3 border border-white/5">
                <motion.div initial={{ width: 0 }} animate={{ width: `${t.progress}%` }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-primary" />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] font-headline uppercase tracking-widest text-slate-500">Prize Pool</p>
                <p className="font-display text-xl text-secondary">{t.prize}</p>
              </div>
              <button className="px-6 py-3 bg-primary text-black font-bold uppercase tracking-widest text-sm hover:brightness-110 whitespace-nowrap">{t.status === "REGISTERING" ? "Register" : t.status === "LIVE" ? "Watch Live" : "Notify Me"}</button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 glass-panel p-6 border border-primary/10">
        <h3 className="font-headline text-xs font-bold tracking-widest">HOW_IT_WORKS</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {[
            { step: "01", title: "Qualify via Battles", desc: "Win 1v1 duels or squad battles to earn tournament points." },
            { step: "02", title: "Register", desc: "Use points to secure a slot. Max 128 per championship." },
            { step: "03", title: "Compete & Claim", desc: "Bracket elimination. Prize distributed on-chain." },
          ].map((s) => (
            <div key={s.step} className="bg-surface-container p-4 border border-white/5">
              <p className="text-2xl font-display text-primary">{s.step}</p>
              <p className="font-bold text-sm uppercase mt-1">{s.title}</p>
              <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
