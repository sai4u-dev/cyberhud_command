import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchThemes, updateMyTheme, updateSettings } from "../features/theme/themeSlice";
import { motion } from "framer-motion";
import { applyThemeToDOM } from "../utils/themeDefinitions";
import soundManager from "../utils/soundManager";

export default function Settings() {
  const dispatch = useDispatch();
  const { themes, currentKey, settings, currentTheme } = useSelector((s) => s.theme);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchThemes());
  }, [dispatch]);

  const [isMuted, setIsMuted] = useState(false);

  const handleThemeSelect = async (key) => {
    soundManager.playSfx("theme");
    // optimistic local apply
    const theme = themes.find((t) => t.key === key);
    if (theme) applyThemeToDOM(theme);
    try {
      await dispatch(updateMyTheme(key)).unwrap();
      soundManager.playSfx("notify");
    } catch (e) {
      console.warn("Could not persist theme to DB (maybe not logged in)", e);
    }
  };

  const handleToggle = (path, value) => {
    // play feedback
    if (path.startsWith("sound")) {
      // preview after change
      setTimeout(() => {
        if (path.includes("sfx")) soundManager.playSfx("click");
        else if (path.includes("music")) {
          if (value > 0) soundManager.startMusic();
          else soundManager.stopMusic();
          soundManager.playSfx("notify");
        } else soundManager.playSfx("click");
      }, 50);
      soundManager.setVolumes({
        master: path === "sound.master" ? value : settings.sound.master,
        sfx: path === "sound.sfx" ? value : settings.sound.sfx,
        music: path === "sound.music" ? value : settings.sound.music,
      });
    } else {
      soundManager.playSfx("click");
    }

    const newSettings = JSON.parse(JSON.stringify(settings));
    const keys = path.split(".");
    let obj = newSettings;
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
    obj[keys[keys.length - 1]] = value;
    dispatch(updateSettings(newSettings));
  };

  const handlePreview = (type) => {
    soundManager.playSfx(type);
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
    soundManager.playSfx(next ? "defeat" : "notify");
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

        {/* Audio — Sound Effects & Customization */}
        <div className="glass-panel p-6 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 blur-[30px] rounded-full pointer-events-none" />
          <h4 className="font-headline text-xs font-bold tracking-widest flex items-center gap-2 relative z-10">
            <span className="material-symbols-outlined text-sm text-secondary">volume_up</span> AUDIO • SOUND_FX
            <button onClick={toggleMute} className={`ml-auto px-2 py-1 border text-[10px] font-headline tracking-widest ${isMuted ? "bg-error/20 text-error border-error/30" : "bg-white/5 text-slate-400 border-white/10 hover:border-primary/40"}`}>
              {isMuted ? "🔇 Muted" : "🔊 Sound On"}
            </button>
          </h4>

          <div className="mt-4 space-y-4 relative z-10">
            {[
              { label: "Master", path: "sound.master", icon: "surround_sound", desc: "Global volume" },
              { label: "SFX", path: "sound.sfx", icon: "music_note", desc: "Attacks, hits, UI" },
              { label: "Music", path: "sound.music", icon: "queue_music", desc: "Ambient drone" },
            ].map((item) => {
              const val = item.path.split(".").reduce((o, k) => o?.[k], settings);
              return (
                <div key={item.path} className="bg-black/30 border border-white/5 p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold flex items-center gap-1.5"><span className="material-symbols-outlined text-xs text-secondary">{item.icon}</span> {item.label} <span className="text-[10px] text-slate-500 font-normal">• {item.desc}</span></span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 border ${val === 0 ? "bg-error/10 text-error border-error/20" : "bg-primary/10 text-primary border-primary/20"}`}>{val}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-slate-600">0</span>
                    <input type="range" min="0" max="100" value={val} onChange={(e) => handleToggle(item.path, parseInt(e.target.value))} className="flex-1 accent-[var(--color-primary)] h-1" />
                    <span className="text-[10px] text-slate-600">100</span>
                    <button onClick={() => handlePreview(item.label === "Music" ? "notify" : item.label === "SFX" ? "attack" : "click")} className="ml-2 px-2 py-1 bg-white/5 border border-white/10 text-[10px] hover:bg-primary/10 hover:border-primary/30">▶ Test</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SFX Test Grid */}
          <div className="mt-5 relative z-10">
            <p className="text-[10px] font-headline uppercase tracking-widest text-slate-500 mb-2">Preview_Sound_Effects • Tap to test (respects SFX volume)</p>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {[
                { key: "attack", label: "Attack", icon: "swords" },
                { key: "hit", label: "Hit", icon: "target" },
                { key: "crit", label: "Crit", icon: "bolt" },
                { key: "shield", label: "Shield", icon: "shield" },
                { key: "special", label: "Special", icon: "auto_awesome" },
                { key: "heal", label: "Heal", icon: "healing" },
                { key: "victory", label: "Victory", icon: "trophy" },
                { key: "defeat", label: "Defeat", icon: "skull" },
                { key: "click", label: "Click", icon: "touch_app" },
                { key: "theme", label: "Theme", icon: "palette" },
                { key: "notify", label: "Notify", icon: "notifications" },
                { key: "error", label: "Error", icon: "error" },
              ].map((s) => (
                <button key={s.key} onClick={() => handlePreview(s.key)} className="bg-surface-container border border-white/10 hover:border-secondary/30 hover:bg-secondary/5 p-2 flex flex-col items-center gap-1 group">
                  <span className="material-symbols-outlined text-sm group-hover:text-secondary">{s.icon}</span>
                  <span className="text-[10px] font-headline uppercase tracking-widest">{s.label}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-600 mt-2">Procedural Web Audio • No downloads • Works offline • Volumes sync to MongoDB via <code className="bg-black/40 px-1">User.settings.sound</code></p>
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
        <button onClick={() => { soundManager.playSfx("notify"); dispatch(updateSettings(settings)); }} className="px-6 py-2 bg-primary text-black text-xs font-bold uppercase tracking-widest hover:brightness-110">Save_All → Persist to DB</button>
      </div>
    </div>
  );
}
