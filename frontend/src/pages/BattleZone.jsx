import { useState, useEffect, useRef } from "react";
import ZoneMap from "../components/maps/ZoneMap";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MODES = [
  { id: "solo", title: "SOLO_PROTOCOL", desc: "1v1 neural duel. First to breach wins.", players: "1 Player", icon: "person" },
  { id: "squad", title: "SQUAD_ASSAULT", desc: "4v4 tactical domination. Coordinate or collapse.", players: "8 Players", icon: "groups" },
  { id: "royale", title: "VOID_ROYALE", desc: "16 operators. Shrinking grid. Last signal alive.", players: "16 Players", icon: "swords" },
];

export default function BattleZone() {
  const [activeMode, setActiveMode] = useState("squad");
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".battle-title", { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power4.out" });
      gsap.fromTo(".mode-card", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power3.out", delay: 0.3 });
      gsap.fromTo(".map-section", { opacity: 0 }, { opacity: 1, duration: 1, scrollTrigger: { trigger: ".map-section", start: "top 80%" } });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="bg-background min-h-screen pt-16">
      <section className="relative py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-block px-4 py-1 border border-primary/30 bg-primary/5 mb-6">
            <span className="font-label text-primary text-xs tracking-[0.3em] uppercase">Select_Protocol</span>
          </motion.div>
          <h2 className="battle-title font-display text-5xl md:text-7xl font-bold tracking-tighter leading-none">
            BATTLING <span className="text-primary glow-text">ZONE</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">Choose your arena. Solo precision or squad chaos. The grid remembers every victory.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {MODES.map((m) => (
            <motion.button
              key={m.id}
              onClick={() => setActiveMode(m.id)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`mode-card group text-left glass-panel p-6 border relative overflow-hidden transition-all ${activeMode === m.id ? "border-primary bg-primary/5 shadow-[0_0_30px_rgba(143,245,255,0.15)]" : "border-white/5 hover:border-white/10"}`}
            >
              <div className="w-12 h-12 bg-surface-container border border-white/10 flex items-center justify-center mb-4 group-hover:border-primary/30 transition-colors">
                <span className={`material-symbols-outlined ${activeMode === m.id ? "text-primary" : "text-slate-400"}`}>{m.icon}</span>
              </div>
              <h4 className="font-display text-lg uppercase">{m.title}</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{m.desc}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-[10px] font-headline tracking-widest px-2 py-1 bg-white/5 border border-white/10">{m.players}</span>
                {activeMode === m.id && <span className="text-[10px] font-headline tracking-widest text-primary">● ACTIVE</span>}
              </div>
              {activeMode === m.id && <div className="absolute bottom-0 left-0 h-1 w-full bg-primary" />}
            </motion.button>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-primary text-black px-10 py-4 font-bold uppercase tracking-widest hover:brightness-110 transition-all">
            Deploy → {MODES.find((m) => m.id === activeMode)?.title}
          </motion.button>
        </div>
      </section>

      <section className="map-section py-12 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="font-display text-2xl uppercase tracking-widest text-primary">LIVE_ZONES</h3>
            <p className="text-xs font-label uppercase tracking-widest text-slate-500">Google Maps integration • Real-time operator positions</p>
          </div>
          <div className="hidden md:flex gap-2 text-[10px] font-label uppercase">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary inline-block" /> LIVE</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-secondary inline-block" /> WAITING</span>
          </div>
        </div>
        <ZoneMap />
      </section>
    </div>
  );
}
