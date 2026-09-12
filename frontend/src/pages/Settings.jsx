import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchThemes, updateMyTheme, updateSettings } from "../features/theme/themeSlice";
import { motion } from "framer-motion";
import { applyThemeToDOM } from "../utils/themeDefinitions";

export default function Settings() {
  const dispatch = useDispatch();
  const { themes, currentKey, settings, currentTheme } = useSelector((s) => s.theme);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchThemes());
  }, [dispatch]);

  const handleThemeSelect = async (key) => {
    // optimistic local apply
    const theme = themes.find((t) => t.key === key);
    if (theme) applyThemeToDOM(theme);
    try {
      await dispatch(updateMyTheme(key)).unwrap();
    } catch (e) {
      // still keep local if not authenticated
      console.warn("Could not persist theme to DB (maybe not logged in)", e);
      // fallback to local only
      // we already applied
    }
  };

  const handleToggle = (path, value) => {
    const newSettings = JSON.parse(JSON.stringify(settings));
    const keys = path.split(".");
    let obj = newSettings;
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
    obj[keys[keys.length - 1]] = value;
    dispatch(updateSettings(newSettings));
  };

  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-headline tracking-[0.3em] uppercase text-primary">System_Preferences</p>
          <h2 className="font-display text-4xl font-bold uppercase tracking-tight">SETTINGS</h2>
          <p className="text-sm text-slate-400 mt-1">Theme based configuration • Persisted to MongoDB • {user ? user.username : "Guest"} • Active: <span className="text-primary">{currentTheme?.name}</span></p>
        </div>
        <div className="glass-panel px-4 py-3 border border-primary/20 self-start">
          <p className="text-[10px] font-headline uppercase tracking-widest text-slate-400">Preview</p>
          <div className="w-32 h-12 mt-2 border border-white/10" style={{ background: currentTheme?.preview?.gradient || currentTheme?.colors?.primary }} />
        </div>
      </div>

      {/* THEMES GRID - 10 THEMES */}
      <section className="mb-10">
        <h3 className="font-headline text-sm font-bold tracking-widest flex items-center gap-2 mb-4">
          <span className="w-2 h-5 bg-primary inline-block" /> THEME_MATRIX — 10 PROTOCOLS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {themes.map((theme) => (
            <motion.button
              key={theme.key}
              onClick={() => handleThemeSelect(theme.key)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative p-4 border text-left overflow-hidden transition-all ${currentKey === theme.key ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(0,0,0,0.3)]" : "border-white/10 bg-surface-container hover:border-white/20"}`}
            >
              <div className="h-16 w-full mb-3 border border-white/5" style={{ background: theme.preview?.gradient || theme.colors.primary }} />
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm" style={{ color: theme.colors.primary }}>{theme.preview?.icon || "palette"}</span>
                <p className="font-display text-xs font-bold tracking-widest">{theme.name}</p>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed line-clamp-2">{theme.description}</p>
              <div className="flex gap-1 mt-3">
                {[theme.colors.primary, theme.colors.secondary, theme.colors.tertiary].map((c) => (
                  <span key={c} className="w-6 h-2 border border-white/10" style={{ background: c }} />
                ))}
              </div>
              {currentKey === theme.key && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary text-black flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">check</span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
        <p className="text-[10px] font-label uppercase tracking-widest text-slate-500 mt-3">Themes are stored in MongoDB <code className="bg-black/40 px-1">Theme</code> collection and synced to <code className="bg-black/40 px-1">User.selectedTheme</code>. Change persists across devices after login.</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications */}
        <div className="glass-panel p-6 border border-white/5">
          <h4 className="font-headline text-xs font-bold tracking-widest flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">notifications</span> NOTIFICATIONS</h4>
          <div className="mt-4 space-y-4">
            {[
              { label: "Battle Invites", path: "notifications.battleInvites" },
              { label: "Tournament Updates", path: "notifications.tournamentUpdates" },
              { label: "Marketing", path: "notifications.marketing" },
            ].map((item) => {
              const val = item.path.split(".").reduce((o, k) => o?.[k], settings);
              return (
                <label key={item.path} className="flex justify-between items-center cursor-pointer">
                  <span className="text-sm text-slate-300">{item.label}</span>
                  <input type="checkbox" checked={!!val} onChange={(e) => handleToggle(item.path, e.target.checked)} className="w-5 h-5 accent-[var(--color-primary)]" />
                </label>
              );
            })}
          </div>
        </div>

        {/* Audio */}
        <div className="glass-panel p-6 border border-white/5">
          <h4 className="font-headline text-xs font-bold tracking-widest flex items-center gap-2"><span className="material-symbols-outlined text-sm text-secondary">volume_up</span> AUDIO</h4>
          <div className="mt-4 space-y-4">
            {[
              { label: "Master", path: "sound.master" },
              { label: "SFX", path: "sound.sfx" },
              { label: "Music", path: "sound.music" },
            ].map((item) => {
              const val = item.path.split(".").reduce((o, k) => o?.[k], settings);
              return (
                <div key={item.path}>
                  <div className="flex justify-between text-xs"><span>{item.label}</span><span className="text-primary">{val}</span></div>
                  <input type="range" min="0" max="100" value={val} onChange={(e) => handleToggle(item.path, parseInt(e.target.value))} className="w-full mt-1 accent-[var(--color-primary)]" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Graphics */}
        <div className="glass-panel p-6 border border-white/5">
          <h4 className="font-headline text-xs font-bold tracking-widest flex items-center gap-2"><span className="material-symbols-outlined text-sm text-tertiary">tune</span> GRAPHICS</h4>
          <div className="mt-4 space-y-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-slate-300">Quality</span>
              <select value={settings.graphics.quality} onChange={(e) => handleToggle("graphics.quality", e.target.value)} className="bg-surface-container border border-white/10 px-3 py-2 text-sm">
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="ultra">Ultra</option>
              </select>
            </label>
            <label className="flex justify-between items-center cursor-pointer">
              <span className="text-sm text-slate-300">Motion / Animations</span>
              <input type="checkbox" checked={settings.graphics.motion} onChange={(e) => handleToggle("graphics.motion", e.target.checked)} className="w-5 h-5 accent-[var(--color-primary)]" />
            </label>
            <label className="flex justify-between items-center cursor-pointer">
              <span className="text-sm text-slate-300">Show Stats Publicly</span>
              <input type="checkbox" checked={settings.privacy.showStats} onChange={(e) => handleToggle("privacy.showStats", e.target.checked)} className="w-5 h-5 accent-[var(--color-primary)]" />
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 glass-panel p-4 border border-primary/10 flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="text-xs text-slate-400">Settings auto-sync to MongoDB when logged in. Guest changes are local only.</p>
        <button onClick={() => dispatch(updateSettings(settings))} className="px-6 py-2 bg-primary text-black text-xs font-bold uppercase tracking-widest hover:brightness-110">Save_All → Persist to DB</button>
      </div>
    </div>
  );
}
