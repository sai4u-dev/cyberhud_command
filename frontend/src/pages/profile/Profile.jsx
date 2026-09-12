import { useAuth } from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  const { currentTheme } = useSelector((s) => s.theme);

  if (!user) return <div className="pt-32 text-center text-slate-500">Please login to view profile.</div>;

  return (
    <div className="pt-24 pb-12 px-6 max-w-5xl mx-auto">
      <div className="glass-panel p-8 border border-primary/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: currentTheme?.preview?.gradient }} />
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-24 h-24 bg-surface-container border-2 border-primary/30 flex items-center justify-center text-3xl font-bold shrink-0">{user.username[0].toUpperCase()}</div>
          <div className="flex-1">
            <h2 className="font-display text-3xl font-bold uppercase">{user.displayName || user.username}</h2>
            <p className="text-sm text-slate-300 mt-1">{user.email} • <span className="text-primary uppercase">{user.role}</span> • <span className="text-secondary">{user.themeKey}</span> theme</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 bg-white/5 border border-white/10 text-xs">Level {user.stats?.level}</span>
              <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-xs text-primary">{user.stats?.xp} XP</span>
              <span className="px-3 py-1 bg-secondary/10 border border-secondary/20 text-xs text-secondary">{user.stats?.battlesWon} Wins</span>
              <span className="px-3 py-1 bg-tertiary/10 border border-tertiary/20 text-xs text-tertiary">Rank {user.stats?.rank}</span>
            </div>
            <div className="flex gap-3 mt-6">
              <Link to="/settings" className="px-5 py-2 bg-primary text-black font-bold uppercase tracking-widest text-xs hover:brightness-110">Settings</Link>
              <Link to="/battles" className="px-5 py-2 border border-white/10 font-bold uppercase tracking-widest text-xs hover:bg-white/5">My Battles</Link>
            </div>
          </div>
          <div className="glass-panel p-4 border border-white/5 self-start">
            <p className="text-[10px] font-headline uppercase tracking-widest text-slate-500">Credits</p>
            <p className="font-display text-2xl text-primary mt-1">{user.stats?.credits} CR</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="glass-panel p-5 border border-white/5">
          <h4 className="font-headline text-xs font-bold tracking-widest">STATISTICS</h4>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm"><span className="text-slate-400">Battles Won</span><span className="font-bold text-primary">{user.stats?.battlesWon}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-400">Battles Lost</span><span className="font-bold text-tertiary">{user.stats?.battlesLost}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-400">Win Rate</span><span className="font-bold">{user.stats?.battlesWon + user.stats?.battlesLost > 0 ? Math.round((user.stats.battlesWon / (user.stats.battlesWon + user.stats.battlesLost)) * 100) : 0}%</span></div>
          </div>
        </div>
        <div className="glass-panel p-5 border border-white/5 md:col-span-2">
          <h4 className="font-headline text-xs font-bold tracking-widest">ACHIEVEMENTS</h4>
          <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-surface-container border border-white/5 flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-primary">military_tech</span>
                <span className="text-[10px] font-label uppercase mt-1">Badge_{i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
