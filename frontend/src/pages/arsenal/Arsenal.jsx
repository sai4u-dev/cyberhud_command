import { motion } from "framer-motion";

const WEAPONS = [
  { name: "VOID_RIFLE", dmg: 92, fire: 78, range: 88, owned: true },
  { name: "PLASMA_EDGE", dmg: 98, fire: 45, range: 60, owned: true },
  { name: "NEURAL_BURST", dmg: 85, fire: 90, range: 70, owned: false },
  { name: "SYNTH_CANNON", dmg: 100, fire: 30, range: 95, owned: false },
];

export default function Arsenal() {
  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-headline tracking-[0.3em] uppercase text-secondary">Loadout</p>
        <h2 className="font-display text-4xl font-bold uppercase">ARSENAL</h2>
        <p className="text-sm text-slate-400 mt-1">Customize your operator • Stats affect battle performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {WEAPONS.map((w, i) => (
            <motion.div key={w.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className={`glass-panel p-5 border ${w.owned ? "border-primary/20 bg-primary/5" : "border-white/5 opacity-70"}`}>
              <div className="flex justify-between items-start">
                <h4 className="font-display font-bold uppercase">{w.name}</h4>
                {w.owned ? <span className="text-[10px] px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 font-headline">OWNED</span> : <span className="text-[10px] px-2 py-1 bg-white/5 text-slate-500 border border-white/10 font-headline">LOCKED</span>}
              </div>
              <div className="mt-4 space-y-2">
                {[
                  { label: "Damage", val: w.dmg },
                  { label: "Fire Rate", val: w.fire },
                  { label: "Range", val: w.range },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between text-[10px] font-headline uppercase tracking-widest"><span className="text-slate-500">{s.label}</span><span className="text-primary">{s.val}</span></div>
                    <div className="w-full h-1 bg-white/5 mt-1"><div className="h-full bg-primary" style={{ width: `${s.val}%` }} /></div>
                  </div>
                ))}
              </div>
              <button className={`mt-4 w-full py-2 text-xs font-bold uppercase tracking-widest border ${w.owned ? "bg-primary text-black border-primary hover:brightness-110" : "border-white/10 text-slate-400 hover:bg-white/5"}`}>{w.owned ? "Equip" : "Unlock • 1200 CR"}</button>
            </motion.div>
          ))}
        </div>

        <div className="glass-panel p-6 border border-white/5">
          <h3 className="font-headline text-xs font-bold tracking-widest">ACTIVE_LOADOUT</h3>
          <div className="mt-4 aspect-[3/4] bg-black/40 border border-white/5 flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-primary">person</span>
            <p className="font-display text-lg uppercase mt-2">VOID_WALKER</p>
            <p className="text-xs text-slate-500">Primary: VOID_RIFLE • Secondary: PLASMA_EDGE</p>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs"><span className="text-slate-400">Power</span><span className="text-primary font-bold">2,840</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-400">Win Rate</span><span className="text-secondary font-bold">68.4%</span></div>
          </div>
          <button className="mt-4 w-full py-3 bg-secondary text-white font-bold uppercase tracking-widest hover:brightness-110">Save Loadout</button>
        </div>
      </div>
    </div>
  );
}
