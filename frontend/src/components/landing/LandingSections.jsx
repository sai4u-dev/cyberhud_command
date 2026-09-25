import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Trusted by strip
export function TrustedBy() {
  return (
    <section className="border-y border-white/5 bg-black/40 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[11px] font-headline tracking-[0.2em] uppercase text-slate-500">Trusted by 128K operators • Featured in</p>
        <div className="flex items-center gap-6 md:gap-8 text-slate-500 font-display font-bold tracking-widest text-xs">
          <span className="hover:text-white transition-colors">WIRED</span>
          <span className="hover:text-white transition-colors">THE VERGE</span>
          <span className="hover:text-white transition-colors">IGN</span>
          <span className="hover:text-white transition-colors">PC GAMER</span>
          <span className="hidden md:inline hover:text-white transition-colors">KOTAKU</span>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { n: "01", title: "Link Neural ID", desc: "Create operator • Verify wallet • Claim 1,000 CR starter", icon: "fingerprint" },
    { n: "02", title: "Deploy to Zone", desc: "Pick MapCN sector • 1v1 duel or 1vN squad • 8-16 slots", icon: "map" },
    { n: "03", title: "Reign & Earn", desc: "Real-time combat • 60fps • Prize auto-payout (ETH) • Rank up", icon: "trophy" },
  ];
  return (
    <section className="py-14 px-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div>
          <p className="text-[11px] font-headline tracking-[0.22em] uppercase text-primary">How It Works</p>
          <h3 className="font-display text-[26px] md:text-3xl font-bold uppercase tracking-tight mt-1">From <span className="text-primary">Link</span> to Legend in 3 moves</h3>
        </div>
        <Link to="/battles" className="hidden md:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-white/10 px-4 py-2 hover:border-primary/40">Start Battling <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((s) => (
          <motion.div key={s.n} whileHover={{ y: -3 }} className="glass-panel p-6 border border-white/5 hover:border-primary/20 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/5 blur-[24px] rounded-full" />
            <div className="w-10 h-10 bg-surface-variant border border-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-lg">{s.icon}</span>
            </div>
            <p className="font-display text-3xl font-black text-white/10 mt-4">{s.n}</p>
            <h4 className="font-display font-bold uppercase mt-1">{s.title}</h4>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function ModesExpanded() {
  const modes = [
    { k: "1V1", title: "Duel Protocol", players: "1 vs 1 • 2 slots • 3 min", desc: "Pure skill. First breach wins. Ranked affects MMR. Best for warmup & climbing.", cta: "Enter Duel", to: "/battles/one-to-one", accent: "primary" },
    { k: "1VN", title: "Squad Reign", players: "1 vs N • 4-16 slots • 5-8 min", desc: "Host vs many. Last squad standing. Team breach, revives, prize split.", cta: "Host Squad", to: "/battles/one-to-many", accent: "secondary" },
    { k: "ROYALE", title: "Void Royale", players: "16 • Solo/Team • 12 min", desc: "Shrinking grid. Loot shards. Extract or be erased. Highest risk/reward.", cta: "Queue Royale", to: "/battles", accent: "tertiary" },
  ];
  return (
    <section className="py-14 bg-surface-container/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-between items-end gap-3 mb-7">
          <h3 className="font-display text-2xl md:text-[26px] font-bold uppercase tracking-tight">Choose your <span className="text-primary">Reign</span></h3>
          <p className="text-sm text-slate-500 max-w-md">Three ways to play. All wagered, all live. Smooth 60fps on any device.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modes.map((m) => (
            <motion.div key={m.k} whileHover={{ y: -4 }} className="glass-panel p-6 border border-white/5 hover:border-white/15 flex flex-col">
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 flex items-center justify-center font-black text-xs border ${m.accent === "primary" ? "bg-primary text-black border-primary" : m.accent === "secondary" ? "bg-secondary text-white border-secondary" : "bg-tertiary text-black border-tertiary"}`}>{m.k}</span>
                <span className="text-[11px] font-headline tracking-widest text-slate-500">{m.players}</span>
              </div>
              <h4 className="font-display font-bold uppercase mt-3 text-lg">{m.title}</h4>
              <p className="text-sm text-slate-400 mt-1 flex-1">{m.desc}</p>
              <Link to={m.to} className={`mt-5 inline-flex justify-center py-3 font-bold uppercase tracking-widest text-sm border ${m.accent === "primary" ? "bg-primary text-black border-primary hover:brightness-110" : m.accent === "secondary" ? "bg-secondary text-white border-secondary hover:brightness-110" : "bg-tertiary text-black border-tertiary hover:brightness-110"}`}>{m.cta} →</Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LiveBattlesStrip() {
  const items = [
    { code: "BT-G4CC", zone: "NEURAL_GRID_ALPHA", type: "1V1", live: true, viewers: 842 },
    { code: "BT-LBFA", zone: "VOID_SECTOR_7", type: "1VN", live: true, viewers: 521 },
    { code: "BT-9X2K", zone: "SYNTH_CORE", type: "1V1", live: false, viewers: 0 },
  ];
  return (
    <section className="py-8 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-display font-bold uppercase tracking-widest text-sm flex items-center gap-2"><span className="w-2 h-5 bg-tertiary inline-block" /> LIVE_NOW</h4>
        <span className="text-[11px] font-headline tracking-widest text-slate-500">{items.filter(i=>i.live).length} LIVE • MapCN</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {items.map((b) => (
          <div key={b.code} className={`p-4 border flex justify-between items-center ${b.live ? "bg-tertiary/5 border-tertiary/20" : "glass-panel border-white/5"}`}>
            <div>
              <p className="font-display font-bold text-sm">{b.code} • {b.zone}</p>
              <p className="text-xs text-slate-500">{b.type} • {b.live ? `${b.viewers} watching` : "Waiting lobby"}</p>
            </div>
            <span className={`w-2 h-2 rounded-full ${b.live ? "bg-tertiary animate-pulse" : "bg-slate-600"}`} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function Operators() {
  const ops = [
    { name: "BLADE_9", rank: "#3 • 12K wins", quote: "Smooth 60fps even on my old rig. Reign is real.", avatar: "person" },
    { name: "VOID_QUEEN", rank: "#1 • 18K wins", quote: "No hand-holding. Best duels in 2025.", avatar: "person_4" },
    { name: "TOXIC_LAB", rank: "#7 • 9K wins", quote: "Squad Reign with MapCN is cracked. Never lags.", avatar: "groups" },
  ];
  return (
    <section className="py-14 px-6 max-w-7xl mx-auto">
      <h3 className="font-display text-xl md:text-2xl font-bold uppercase tracking-tight">Operators <span className="text-slate-500 font-normal">— what they say</span></h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {ops.map((o) => (
          <div key={o.name} className="glass-panel p-6 border border-white/5">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 bg-surface-variant border border-white/10 flex items-center justify-center"><span className="material-symbols-outlined text-sm">{o.avatar}</span></span>
              <div>
                <p className="font-display font-bold text-sm">{o.name}</p>
                <p className="text-[11px] text-slate-500">{o.rank}</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">“{o.quote}”</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TournamentPrize() {
  return (
    <section className="py-14 bg-gradient-to-b from-primary/5 via-transparent to-transparent border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-[11px] font-headline tracking-[0.22em] uppercase text-primary">Tournament • Prize Pool</p>
          <h3 className="font-display text-3xl md:text-4xl font-bold uppercase leading-tight mt-1">4,200 <span className="text-primary">ETH</span> <span className="text-slate-500 text-xl">+ 120 ETH weekly</span></h3>
          <p className="text-sm text-slate-400 mt-2">Wagered battles fund the pool. Top 48 split. Audited, on-chain.</p>
          <div className="flex gap-3 mt-5">
            <Link to="/tournament" className="px-5 py-3 bg-primary text-black font-black uppercase tracking-widest text-sm hover:brightness-110">View Brackets</Link>
            <Link to="/leaderboard" className="px-5 py-3 border border-white/15 font-bold uppercase tracking-widest text-sm hover:bg-white/5">Leaderboard</Link>
          </div>
        </div>
        <div className="glass-panel p-6 border border-white/5">
          <div className="space-y-3">
            {[
              { place: "1st", pct: 28, eth: "1,176 ETH" },
              { place: "2nd", pct: 18, eth: "756 ETH" },
              { place: "3-4th", pct: 10, eth: "420 ETH" },
              { place: "5-16th", pct: 3, eth: "126 ETH" },
            ].map((r) => (
              <div key={r.place} className="flex items-center gap-3">
                <span className="w-14 text-xs font-headline tracking-widest text-slate-500">{r.place}</span>
                <div className="flex-1 h-2 bg-black border border-white/5"><div className="h-full bg-primary" style={{ width: `${r.pct * 2.2}%` }} /></div>
                <span className="w-24 text-right text-xs font-bold">{r.eth}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ArsenalTease() {
  return (
    <section className="py-14 px-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap justify-between items-end gap-3 mb-6">
        <h3 className="font-display text-2xl font-bold uppercase tracking-tight">Arsenal <span className="text-slate-500">— equip to reign</span></h3>
        <Link to="/arsenal" className="text-xs font-bold uppercase tracking-widest border border-white/10 px-4 py-2 hover:border-primary/40">Browse Arsenal →</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { name: "Neon Katana", stat: "CRIT +18%", price: "1,240 CR" },
          { name: "Pulse Rifle", stat: "DMG 92", price: "2,100 CR" },
          { name: "Void Shield", stat: "BLOCK 45%", price: "980 CR" },
          { name: "Hack Drone", stat: "REVEAL +30%", price: "1,560 CR" },
        ].map((w) => (
          <div key={w.name} className="glass-panel p-4 border border-white/5 hover:border-primary/20">
            <div className="w-full h-20 bg-black/40 border border-white/5 flex items-center justify-center"><span className="material-symbols-outlined text-3xl text-slate-600">swords</span></div>
            <p className="font-display font-bold text-sm mt-3">{w.name}</p>
            <p className="text-[11px] text-primary">{w.stat} • {w.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Roadmap() {
  const steps = [
    { q: "Q1 2025", done: true, t: "Neural Link Alpha", d: "1v1 duels, MapCN, 10 themes" },
    { q: "Q2 2025", done: true, t: "Reign Launch", d: "1vN squads, tournaments, ETH pools" },
    { q: "Q3 2025", done: false, t: "Warrior Drop", d: "New 3D warrior, story, clan wars" },
    { q: "Q4 2025", done: false, t: "Mobile Reign", d: "iOS/Android 60fps" },
  ];
  return (
    <section className="py-14 bg-black/30 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="font-display text-xl font-bold uppercase tracking-widest">Roadmap</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {steps.map((s) => (
            <div key={s.q} className={`p-5 border ${s.done ? "bg-primary/5 border-primary/20" : "glass-panel border-white/5"}`}>
              <p className="text-[11px] font-headline tracking-widest text-slate-500">{s.q} {s.done ? "• DONE" : "• NEXT"}</p>
              <p className="font-display font-bold uppercase mt-1">{s.t}</p>
              <p className="text-sm text-slate-400">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Community() {
  return (
    <section className="py-14 px-6 max-w-7xl mx-auto">
      <div className="glass-panel p-7 md:p-8 border border-white/5 flex flex-col md:flex-row justify-between gap-6 items-center">
        <div>
          <p className="text-[11px] font-headline tracking-[0.2em] uppercase text-primary">Community</p>
          <h3 className="font-display text-2xl font-bold uppercase mt-1">Join 14K on Discord. No bots, just Reign.</h3>
          <p className="text-sm text-slate-400">Strats, LFG, dev logs. Verified community.</p>
        </div>
        <div className="flex gap-3">
          <a href="#" className="px-5 py-3 bg-[#5865F2] text-white font-bold uppercase tracking-widest text-sm">Join Discord</a>
          <a href="#" className="px-5 py-3 border border-white/15 font-bold uppercase tracking-widest text-sm hover:bg-white/5">Follow X</a>
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  const qs = [
    { q: "Is there wagering?", a: "Battles can involve prize pools. All wagering is optional and transparent, with pools shown before you join." },
    { q: "Does 3D lag?", a: "No. Warrior is procedural (no GLTF), 380 particles, 1.55 DPR cap, ContactShadows, always 60fps." },
    { q: "Can I play 1 vs N alone?", a: "Yes. Squad vs bots is playable solo. Host a room and fight AI." },
    { q: "Prize in real ETH?", a: "Yes. Pools are on-chain. 4,200 ETH global + weekly 120 ETH. Top 48 paid." },
  ];
  return (
    <section className="py-14 px-6 max-w-5xl mx-auto">
      <h3 className="font-display text-xl font-bold uppercase tracking-widest text-center">FAQ</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {qs.map((f) => (
          <div key={f.q} className="glass-panel p-5 border border-white/5">
            <p className="font-display font-bold text-sm">{f.q}</p>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
