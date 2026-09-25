import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createBattle } from "../features/battle/battleSlice";
import MapCN from "../components/maps/MapCN";
import PlayableArena from "../components/battle/PlayableArena";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import soundManager from "../utils/soundManager";

gsap.registerPlugin(ScrollTrigger);

const MODES = [
  { id: "one_to_one", title: "SOLO_PROTOCOL", desc: "1v1 neural duel. First to breach wins.", players: "1 vs 1", icon: "person", type: "one_to_one" },
  { id: "one_to_many", title: "SQUAD_ASSAULT", desc: "1vN squad survival. Eliminate all bots.", players: "1 vs N", icon: "groups", type: "one_to_many" },
  { id: "royale", title: "VOID_ROYALE", desc: "Squad tactics. Coordinate or collapse.", players: "8 Players", icon: "swords", type: "one_to_many" },
];

export default function BattleZone() {
  const [activeMode, setActiveMode] = useState("one_to_one");
  const [showPlay, setShowPlay] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".battle-title", { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power4.out" });
      gsap.fromTo(".mode-card", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power3.out", delay: 0.3 });
      gsap.fromTo(".map-section", { opacity: 0 }, { opacity: 1, duration: 1, scrollTrigger: { trigger: ".map-section", start: "top 80%" } });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const handleMapAction = async (zone, actionType) => {
    soundManager.playSfx("click");
    // actionType is "one_to_one" or "one_to_many" from MapCN
    const type = actionType || activeMode;
    if (!user) {
      soundManager.playSfx("error");
      navigate("/login");
      return;
    }
    soundManager.playSfx("notify");
    const title = `${zone.code}_${type === "one_to_one" ? "DUEL" : "SQUAD"}_${Math.random().toString(36).slice(2, 4).toUpperCase()}`;
    const res = await dispatch(createBattle({ title, description: `Battling at ${zone.name}`, type, maxParticipants: type === "one_to_one" ? 2 : 8, mapZone: { name: zone.name } }));
    if (res.meta.requestStatus === "fulfilled") {
      soundManager.playSfx("special");
      setSelectedZone(zone);
      setShowPlay(true);
    } else {
      soundManager.playSfx("error");
    }
  };

  const handleDeploy = () => {
    soundManager.playSfx("click");
    if (activeMode === "one_to_one") navigate("/battles/one-to-one");
    else navigate("/battles/one-to-many");
  };

  return (
    <div ref={heroRef} className="bg-background min-h-screen pt-16">
      <section className="relative py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-block px-4 py-1 border border-primary/30 bg-primary/5 mb-6">
            <span className="font-label text-primary text-xs tracking-[0.3em] uppercase">Select_Protocol • MapCN</span>
          </motion.div>
          <h2 className="battle-title font-display text-5xl md:text-7xl font-bold tracking-tighter leading-none">
            BATTLING <span className="text-primary glow-text">ZONE</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">Choose your arena. Click a zone on the MapCN below to instantly deploy a 1v1 duel or 1vN squad. Play directly in the arena.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {MODES.map((m) => (
            <motion.button
              key={m.id}
              onClick={() => { soundManager.playSfx("click"); setActiveMode(m.type); }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`mode-card group text-left glass-panel p-6 border relative overflow-hidden transition-all ${activeMode === m.type ? "border-primary bg-primary/5 shadow-[0_0_30px_rgba(143,245,255,0.15)]" : "border-white/5 hover:border-white/10"}`}
            >
              <div className="w-12 h-12 bg-surface-container border border-white/10 flex items-center justify-center mb-4 group-hover:border-primary/30 transition-colors">
                <span className={`material-symbols-outlined ${activeMode === m.type ? "text-primary" : "text-slate-400"}`}>{m.icon}</span>
              </div>
              <h4 className="font-display text-lg uppercase">{m.title}</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{m.desc}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-[10px] font-headline tracking-widest px-2 py-1 bg-white/5 border border-white/10">{m.players}</span>
                {activeMode === m.type && <span className="text-[10px] font-headline tracking-widest text-primary">● ACTIVE</span>}
              </div>
              {activeMode === m.type && <div className="absolute bottom-0 left-0 h-1 w-full bg-primary" />}
            </motion.button>
          ))}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleDeploy} className="bg-primary text-black px-10 py-4 font-bold uppercase tracking-widest hover:brightness-110 transition-all">
            Deploy → {MODES.find((m) => m.type === activeMode)?.title}
          </motion.button>
          <button onClick={() => { soundManager.playSfx(showPlay ? "click" : "special"); setShowPlay(!showPlay); }} className="px-10 py-4 border border-white/10 font-bold uppercase tracking-widest hover:bg-white/5 text-sm">
            {showPlay ? "Close Arena" : "▶ Quick Play Demo"}
          </button>
        </div>
      </section>

      {/* Playable Arena Demo */}
      {showPlay && (
        <section className="px-6 max-w-7xl mx-auto pb-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-display text-xl uppercase tracking-widest">PLAYABLE_ARENA • {activeMode === "one_to_one" ? "1 vs 1 Duel" : "1 vs N Squad"}</h3>
            <div className="flex gap-2">
              <button onClick={() => setActiveMode(activeMode === "one_to_one" ? "one_to_many" : "one_to_one")} className="px-3 py-1 border border-white/10 text-xs font-headline uppercase hover:border-primary">Switch to {activeMode === "one_to_one" ? "1vN" : "1v1"}</button>
              <button onClick={() => setShowPlay(false)} className="px-3 py-1 bg-white/5 border border-white/10 text-xs">Close</button>
            </div>
          </div>
          <PlayableArena mode={activeMode} onExit={() => setShowPlay(false)} onVictory={() => console.log("victory")} />
          <p className="text-[10px] font-label uppercase tracking-widest text-slate-500 mt-2 text-center">MapCN + PlayableArena • Energy, cooldowns, combo, crits • Works offline without backend</p>
        </section>
      )}

      <section className="map-section py-8 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 mb-4">
          <div>
            <h3 className="font-display text-2xl uppercase tracking-widest text-primary flex items-center gap-2"><span className="material-symbols-outlined">map</span> LIVE_ZONES • MAP_CN</h3>
            <p className="text-xs font-label uppercase tracking-widest text-slate-500">Leaflet + Carto Dark Matter • Cyber presentation • Click zone → Duel or Squad</p>
          </div>
          <div className="flex gap-2 text-[10px] font-label uppercase">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary inline-block" /> 1v1 DUEL</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-secondary inline-block" /> 1vN SQUAD</span>
          </div>
        </div>
        <MapCN onSelectZone={setSelectedZone} onBattleAction={handleMapAction} />
        {selectedZone && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="text-slate-500">Selected:</span>
            <span className="font-bold text-primary">{selectedZone.name}</span>
            <span className="text-slate-500">— click Duel or Squad on map card to play</span>
          </div>
        )}
      </section>
    </div>
  );
}
