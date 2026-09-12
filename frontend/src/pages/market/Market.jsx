import { motion } from "framer-motion";

const ITEMS = [
  { name: "Neural Blade MK-II", price: 2400, rarity: "Legendary", color: "primary", icon: "swords" },
  { name: "Void Walker Skin", price: 1200, rarity: "Epic", color: "secondary", icon: "person" },
  { name: "Synth Drive Booster", price: 800, rarity: "Rare", color: "tertiary", icon: "bolt" },
  { name: "Plasma Shield", price: 1800, rarity: "Epic", color: "primary", icon: "shield" },
  { name: "Holo Scrambler", price: 600, rarity: "Common", color: "primary", icon: "visibility_off" },
  { name: "Quantum Core", price: 3500, rarity: "Mythic", color: "secondary", icon: "memory" },
];

export default function Market() {
  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-xs font-headline tracking-[0.3em] uppercase text-primary">Black_Market</p>
          <h2 className="font-display text-4xl font-bold uppercase">MARKET</h2>
          <p className="text-sm text-slate-400 mt-1">Trade cyberware, skins, and boosters • Credits only</p>
        </div>
        <div className="hidden md:flex items-center gap-3 glass-panel px-4 py-2 border border-primary/20">
          <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
          <span className="font-bold text-primary">4,250 CR</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ITEMS.map((item, i) => (
          <motion.div key={item.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-panel p-5 border border-white/5 hover:border-primary/20 group">
            <div className="w-12 h-12 bg-surface-container border border-white/10 flex items-center justify-center group-hover:border-primary/30">
              <span className="material-symbols-outlined" style={{ color: `var(--color-${item.color})` }}>{item.icon}</span>
            </div>
            <h4 className="font-display font-bold uppercase mt-4">{item.name}</h4>
            <p className={`text-[10px] font-headline px-2 py-1 inline-block mt-1 border ${item.rarity === "Mythic" ? "bg-tertiary/10 text-tertiary border-tertiary/20" : item.rarity === "Legendary" ? "bg-primary/10 text-primary border-primary/20" : "bg-white/5 text-slate-400 border-white/10"}`}>{item.rarity}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="font-bold text-primary">{item.price} CR</span>
              <button className="px-4 py-2 bg-primary text-black text-xs font-bold uppercase tracking-widest hover:brightness-110">Buy</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
