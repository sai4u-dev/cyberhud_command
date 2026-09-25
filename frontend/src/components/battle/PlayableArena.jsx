import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import soundManager from "../../utils/soundManager";

/*
  Playable Battling Zone — 1v1 & 1vN
  - 1v1: Player vs 1 AI (duel)
  - 1vN: Player vs 3 Bots (squad survival)
  Real-time with energy, cooldowns, defend, special
*/

const PLAYER_CFG = { maxHp: 100, maxEnergy: 100, attack: 24, defense: 6 };
const BOT_CFG = { maxHp: 85, attack: 18, defense: 4 };

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function PlayableArena({ mode = "one_to_one", onVictory, onDefeat, onExit }) {
  const isOneToMany = mode === "one_to_many";

  // Player
  const [player, setPlayer] = useState({ hp: PLAYER_CFG.maxHp, energy: PLAYER_CFG.maxEnergy, isDefending: false, shieldTimer: 0 });
  const [opponent, setOpponent] = useState({ hp: BOT_CFG.maxHp, maxHp: BOT_CFG.maxHp, name: "NEURAL_BOT_01", isAttacking: false });
  const [bots, setBots] = useState(() =>
    isOneToMany
      ? [
          { id: 1, hp: 75, maxHp: 75, name: "BOT_ALPHA", alive: true },
          { id: 2, hp: 75, maxHp: 75, name: "BOT_BETA", alive: true },
          { id: 3, hp: 75, maxHp: 75, name: "BOT_GAMMA", alive: true },
        ]
      : []
  );
  const [targetBotIdx, setTargetBotIdx] = useState(0);

  const [log, setLog] = useState([]);
  const [damagePops, setDamagePops] = useState([]); // {id,x,y,value,crit}
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(false);
  const [cooldowns, setCooldowns] = useState({ special: 0, heal: 0 });
  const [gameState, setGameState] = useState("playing"); // playing | victory | defeat
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);
  const aiRef = useRef(null);

  const addLog = useCallback((msg, type = "info") => {
    setLog((l) => [{ id: Date.now() + Math.random(), msg, type, time: new Date().toLocaleTimeString() }, ...l].slice(0, 8));
  }, []);

  const popDamage = useCallback((value, target = "opponent", crit = false) => {
    const id = Date.now() + Math.random();
    const x = target === "player" ? rand(15, 30) : rand(70, 85);
    const y = rand(25, 55);
    setDamagePops((p) => [...p, { id, x, y, value, crit }]);
    setTimeout(() => setDamagePops((p) => p.filter((d) => d.id !== id)), 900);
  }, []);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Cooldown ticker
  useEffect(() => {
    const iv = setInterval(() => {
      setCooldowns((c) => ({ special: Math.max(0, c.special - 1), heal: Math.max(0, c.heal - 1) }));
      setPlayer((p) => {
        if (p.shieldTimer > 0) {
          const nt = p.shieldTimer - 1;
          return { ...p, shieldTimer: nt, isDefending: nt > 0 };
        }
        return p;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  // Energy regen
  useEffect(() => {
    const iv = setInterval(() => {
      setPlayer((p) => ({ ...p, energy: Math.min(PLAYER_CFG.maxEnergy, p.energy + 6) }));
    }, 800);
    return () => clearInterval(iv);
  }, []);

  // Victory / Defeat check
  useEffect(() => {
    if (isOneToMany) {
      const alive = bots.filter((b) => b.alive);
      if (alive.length === 0 && gameState === "playing") {
        setGameState("victory");
        addLog("ALL BOTS ELIMINATED — VICTORY", "victory");
        soundManager.playSfx("victory");
        onVictory?.(score);
      }
    } else {
      if (opponent.hp <= 0 && gameState === "playing") {
        setGameState("victory");
        addLog("OPPONENT NEUTRALIZED — VICTORY", "victory");
        soundManager.playSfx("victory");
        onVictory?.(score);
      }
    }
    if (player.hp <= 0 && gameState === "playing") {
      setGameState("defeat");
      addLog("YOU WERE ELIMINATED", "defeat");
      soundManager.playSfx("defeat");
      onDefeat?.(score);
    }
  }, [player.hp, opponent.hp, bots, gameState, isOneToMany, addLog, onVictory, onDefeat, score]);

  // AI attacker
  useEffect(() => {
    if (gameState !== "playing") return;
    const attackPlayer = () => {
      if (Math.random() < 0.7) {
        // AI hits player
        const base = rand(BOT_CFG.attack - 4, BOT_CFG.attack + 4);
        const isCrit = Math.random() < 0.12;
        let dmg = isCrit ? Math.floor(base * 1.6) : base;
        setPlayer((p) => {
          let final = Math.max(1, dmg - (p.isDefending ? 12 : PLAYER_CFG.defense) + rand(-3, 3));
          if (p.isDefending) final = Math.floor(final * 0.45);
          const nhp = Math.max(0, p.hp - final);
          popDamage(final, "player", isCrit);
          setShake(true);
          setTimeout(() => setShake(false), 180);
          soundManager.playSfx(isCrit ? "crit" : "hit");
          addLog(`${isOneToMany ? bots[targetBotIdx]?.name || "BOT" : opponent.name} hits you for ${final}${isCrit ? " CRIT!" : ""}`, "damage");
          return { ...p, hp: nhp };
        });
      }
    };

    aiRef.current = setInterval(attackPlayer, isOneToMany ? 1100 : 1400);
    return () => clearInterval(aiRef.current);
  }, [gameState, isOneToMany, opponent.name, bots, targetBotIdx, popDamage, addLog]);

  const handleAttack = () => {
    if (gameState !== "playing") return;
    if (player.energy < 10) {
      soundManager.playSfx("error");
      return addLog("Not enough energy", "warn");
    }
    soundManager.playSfx("attack");
    setPlayer((p) => ({ ...p, energy: p.energy - 10 }));
    const base = rand(PLAYER_CFG.attack - 3, PLAYER_CFG.attack + 6);
    const isCrit = Math.random() < 0.18;
    let dmg = isCrit ? Math.floor(base * 1.7) : base;
    setCombo((c) => c + 1);
    setScore((s) => s + dmg + (isCrit ? 15 : 0));
    if (isOneToMany) {
      setBots((prev) => {
        const next = [...prev];
        let idx = targetBotIdx;
        // find next alive if target dead
        if (!next[idx]?.alive) {
          idx = next.findIndex((b) => b.alive);
          if (idx === -1) return next;
          setTargetBotIdx(idx);
        }
        const bot = next[idx];
        const final = Math.max(1, dmg - BOT_CFG.defense);
        bot.hp = Math.max(0, bot.hp - final);
        if (bot.hp <= 0) {
          bot.alive = false;
          addLog(`${bot.name} eliminated! +${final} dmg${isCrit ? " CRIT" : ""}`, "victory");
          setScore((s) => s + 100);
          // auto target next alive
          const nextAlive = next.findIndex((b) => b.alive);
          if (nextAlive !== -1) setTargetBotIdx(nextAlive);
        } else {
          addLog(`Hit ${bot.name} for ${final}${isCrit ? " CRIT!" : ""}`, "info");
        }
        popDamage(final, "opponent", isCrit);
        soundManager.playSfx(isCrit ? "crit" : "hit");
        setFlash(true);
        setTimeout(() => setFlash(false), 120);
        return next;
      });
    } else {
      const final = Math.max(1, dmg - BOT_CFG.defense);
      setOpponent((o) => ({ ...o, hp: Math.max(0, o.hp - final) }));
      popDamage(final, "opponent", isCrit);
      soundManager.playSfx(isCrit ? "crit" : "hit");
      addLog(`Hit ${opponent.name} for ${final}${isCrit ? " CRIT!" : ""}`, "info");
      setFlash(true);
      setTimeout(() => setFlash(false), 120);
    }
  };

  const handleDefend = () => {
    if (player.energy < 15) {
      soundManager.playSfx("error");
      return addLog("Not enough energy", "warn");
    }
    soundManager.playSfx("shield");
    setPlayer((p) => ({ ...p, energy: p.energy - 15, isDefending: true, shieldTimer: 3 }));
    setCombo(0);
    addLog("Shield up — next damage halved for 3s", "info");
  };

  const handleSpecial = () => {
    if (cooldowns.special > 0) {
      soundManager.playSfx("error");
      return addLog(`Special on cooldown ${cooldowns.special}s`, "warn");
    }
    if (player.energy < 35) {
      soundManager.playSfx("error");
      return addLog("Need 35 energy", "warn");
    }
    soundManager.playSfx("special");
    setPlayer((p) => ({ ...p, energy: p.energy - 35 }));
    setCooldowns((c) => ({ ...c, special: 6 }));
    const dmg = rand(42, 58);
    setScore((s) => s + dmg + 50);
    if (isOneToMany) {
      // AoE hits all alive
      setBots((prev) =>
        prev.map((b) => {
          if (!b.alive) return b;
          const nd = Math.max(1, dmg - 2);
          const nhp = Math.max(0, b.hp - nd);
          if (nhp <= 0) addLog(`${b.name} vaporized by special!`, "victory");
          return { ...b, hp: nhp, alive: nhp > 0 };
        })
      );
      popDamage(dmg, "opponent", true);
      addLog(`NEURAL_BURST hits all for ${dmg} AoE!`, "victory");
    } else {
      const final = Math.max(1, dmg - 1);
      setOpponent((o) => ({ ...o, hp: Math.max(0, o.hp - final) }));
      popDamage(final, "opponent", true);
      addLog(`NEURAL_BURST — ${final} CRIT!`, "victory");
    }
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
  };

  const handleHeal = () => {
    if (cooldowns.heal > 0) {
      soundManager.playSfx("error");
      return addLog(`Heal on cooldown ${cooldowns.heal}s`, "warn");
    }
    if (player.energy < 20) {
      soundManager.playSfx("error");
      return addLog("Need 20 energy", "warn");
    }
    soundManager.playSfx("heal");
    setPlayer((p) => ({ ...p, energy: p.energy - 20, hp: Math.min(PLAYER_CFG.maxHp, p.hp + 28) }));
    setCooldowns((c) => ({ ...c, heal: 8 }));
    setCombo(0);
    addLog("Repair nanites +28 HP", "info");
  };

  const playerHpPct = (player.hp / PLAYER_CFG.maxHp) * 100;
  const oppHpPct = isOneToMany ? null : (opponent.hp / opponent.maxHp) * 100;

  return (
    <div className={`relative w-full overflow-hidden border ${isOneToMany ? "border-secondary/20" : "border-primary/20"} bg-black`} style={{ height: "560px" }}>
      {/* Background grid */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`, backgroundSize: "32px 32px" }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      {flash && <div className="absolute inset-0 bg-white/10 pointer-events-none animate-pulse" />}

      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-start p-3 gap-2">
        {/* Player HUD */}
        <div className="flex-1 max-w-[42%] glass-panel p-3 border border-primary/20 bg-black/70 backdrop-blur">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-headline tracking-widest text-primary">YOU • LVL 12</p>
            <span className={`text-[10px] px-1.5 py-0.5 border font-headline ${player.isDefending ? "bg-primary/20 text-primary border-primary/30 animate-pulse" : "bg-white/5 text-slate-400 border-white/10"}`}>{player.isDefending ? "SHIELDED" : "COMBAT"}</span>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-[10px] font-headline"><span className="text-slate-400">HP</span><span className={`${playerHpPct < 30 ? "text-error" : "text-primary"}`}>{player.hp}/100</span></div>
            <div className="w-full h-3 bg-black border border-white/10 mt-1 overflow-hidden">
              <motion.div animate={{ width: `${playerHpPct}%` }} transition={{ duration: 0.4 }} className="h-full" style={{ background: playerHpPct < 30 ? "#ef4444" : player.isDefending ? "#22c55e" : "var(--color-primary)", boxShadow: player.isDefending ? "0 0 10px #22c55e" : "0 0 10px var(--color-primary)" }} />
            </div>
            <div className="flex justify-between text-[10px] font-headline mt-2"><span className="text-slate-400">ENERGY</span><span className="text-secondary">{player.energy}/100</span></div>
            <div className="w-full h-1.5 bg-black border border-white/5 mt-1 overflow-hidden">
              <motion.div animate={{ width: `${player.energy}%` }} className="h-full bg-secondary" />
            </div>
          </div>
        </div>

        {/* Center — Timer & Combo */}
        <div className="flex flex-col items-center gap-1">
          <div className="bg-black/70 backdrop-blur border border-white/10 px-3 py-1">
            <p className="text-[10px] font-headline tracking-widest text-slate-400 text-center">TIME</p>
            <p className="font-display text-lg leading-none text-center">{String(Math.floor(time / 60)).padStart(2, "0")}:{String(time % 60).padStart(2, "0")}</p>
          </div>
          <div className="bg-primary text-black px-3 py-1">
            <p className="text-[10px] font-headline tracking-widest text-center">SCORE</p>
            <p className="font-bold text-sm text-center leading-none">{score}</p>
          </div>
          {combo >= 3 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-tertiary text-black px-2 py-0.5 text-[10px] font-bold">COMBO x{combo}</motion.div>
          )}
        </div>

        {/* Opponent HUD */}
        <div className="flex-1 max-w-[42%] glass-panel p-3 border border-white/10 bg-black/70 backdrop-blur">
          {isOneToMany ? (
            <>
              <p className="text-[10px] font-headline tracking-widest text-secondary">SQUAD • {bots.filter((b) => b.alive).length}/3 REMAINING</p>
              <div className="grid grid-cols-3 gap-1 mt-2">
                {bots.map((b, idx) => (
                  <button key={b.id} onClick={() => b.alive && setTargetBotIdx(idx)} className={`p-1.5 border text-center ${b.alive ? (targetBotIdx === idx ? "bg-secondary/20 border-secondary/40" : "bg-white/5 border-white/10 hover:border-secondary/30") : "bg-black/40 border-white/5 opacity-40"}`}>
                    <p className="text-[10px] font-bold leading-none truncate">{b.name}</p>
                    <div className="w-full h-1 bg-black mt-1"><div className="h-full bg-tertiary" style={{ width: `${(b.hp / b.maxHp) * 100}%` }} /></div>
                    <p className="text-[10px] mt-1">{b.alive ? `${b.hp} HP` : "DOWN"}</p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-[10px] font-headline tracking-widest text-tertiary">{opponent.name} • AI</p>
              <div className="mt-2">
                <div className="flex justify-between text-[10px] font-headline"><span className="text-slate-400">HP</span><span className={`${oppHpPct < 30 ? "text-error" : "text-tertiary"}`}>{opponent.hp}/{opponent.maxHp}</span></div>
                <div className="w-full h-3 bg-black border border-white/10 mt-1 overflow-hidden">
                  <motion.div animate={{ width: `${oppHpPct}%` }} className="h-full bg-tertiary" style={{ boxShadow: "0 0 10px #ff6e81" }} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Center Arena */}
      <div className={`absolute inset-0 flex items-center justify-center pt-20 pb-24 ${shake ? "animate-[shake_0.18s]" : ""}`}>
        <div className="relative w-full max-w-3xl flex justify-between items-center px-6 md:px-12">
          {/* Player */}
          <motion.div animate={shake ? { x: [0, -6, 6, -4, 4, 0] } : {}} transition={{ duration: 0.18 }} className="flex flex-col items-center">
            <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full border-2 flex items-center justify-center relative ${player.isDefending ? "border-green-500 bg-green-500/10 shadow-[0_0_20px_#22c55e]" : "border-primary bg-primary/10 shadow-[0_0_20px_var(--color-primary)]"}`}>
              <span className="material-symbols-outlined text-5xl text-primary">person</span>
              {player.isDefending && <span className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"><span className="material-symbols-outlined text-sm text-black">shield</span></span>}
            </div>
            <p className="font-display text-xs font-bold mt-2">YOU</p>
            <p className="text-[10px] text-primary">READY</p>
          </motion.div>

          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 1.2 }} className="font-display text-2xl text-slate-600">VS</motion.div>

          {/* Opponent(s) */}
          {isOneToMany ? (
            <div className="flex gap-2">
              {bots.map((b) => (
                <motion.div key={b.id} animate={!b.alive ? { opacity: 0.3, scale: 0.9 } : {}} className="flex flex-col items-center">
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-2 flex items-center justify-center ${!b.alive ? "border-white/10 bg-black/40 grayscale" : targetBotIdx === bots.indexOf(b) ? "border-secondary bg-secondary/10 shadow-[0_0_16px_#d674ff] scale-105" : "border-white/20 bg-white/5"}`}>
                    <span className="material-symbols-outlined text-2xl" style={{ color: b.alive ? "#d674ff" : "#555" }}>{b.alive ? "smart_toy" : "skull"}</span>
                  </div>
                  <p className="text-[10px] font-bold mt-1">{b.name.split("_")[1]}</p>
                  <p className={`text-[10px] ${b.alive ? "text-tertiary" : "text-slate-600"}`}>{b.alive ? `${b.hp} HP` : "DOWN"}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1.6 }} className="flex flex-col items-center">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-tertiary bg-tertiary/10 flex items-center justify-center shadow-[0_0_20px_#ff6e81]">
                <span className="material-symbols-outlined text-5xl text-tertiary">smart_toy</span>
              </div>
              <p className="font-display text-xs font-bold mt-2">{opponent.name}</p>
              <p className="text-[10px] text-tertiary">HOSTILE</p>
            </motion.div>
          )}
        </div>

        {/* Damage pops */}
        <AnimatePresence>
          {damagePops.map((d) => (
            <motion.div
              key={d.id}
              initial={{ y: 0, opacity: 1, scale: 0.8 }}
              animate={{ y: -50, opacity: 0, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className={`absolute font-display font-bold text-xl pointer-events-none ${d.crit ? "text-yellow-400" : d.value > 30 ? "text-tertiary" : "text-white"}`}
              style={{ left: `${d.x}%`, top: `${d.y}%`, textShadow: d.crit ? "0 0 12px #facc15" : "0 0 8px currentColor" }}
            >
              -{d.value} {d.crit && "CRIT!"}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-3 bg-black/80 backdrop-blur-xl border-t border-white/10">
        <div className="grid grid-cols-4 gap-2 max-w-2xl mx-auto">
          <button onClick={handleAttack} className="group relative bg-primary text-black py-3 font-bold uppercase tracking-widest text-xs hover:brightness-110 active:scale-95 flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-lg">swords</span> Attack <span className="text-[10px] opacity-70">10 ⚡</span>
          </button>
          <button onClick={handleDefend} className="bg-surface-container border border-white/10 hover:border-green-500/40 text-white py-3 font-bold uppercase tracking-widest text-xs flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-lg text-green-400">shield</span> Defend <span className="text-[10px] opacity-60">15 ⚡ • 3s</span>
          </button>
          <button
            onClick={handleSpecial}
            disabled={cooldowns.special > 0}
            className={`py-3 font-bold uppercase tracking-widest text-xs flex flex-col items-center gap-1 border ${cooldowns.special > 0 ? "bg-black border-white/5 text-slate-600" : "bg-tertiary text-black border-tertiary hover:brightness-110"}`}
          >
            <span className="material-symbols-outlined text-lg">bolt</span> Special {cooldowns.special > 0 ? `${cooldowns.special}s` : "35 ⚡"}
          </button>
          <button
            onClick={handleHeal}
            disabled={cooldowns.heal > 0}
            className={`py-3 font-bold uppercase tracking-widest text-xs flex flex-col items-center gap-1 border ${cooldowns.heal > 0 ? "bg-black border-white/5 text-slate-600" : "bg-secondary text-white border-secondary hover:brightness-110"}`}
          >
            <span className="material-symbols-outlined text-lg">healing</span> Heal {cooldowns.heal > 0 ? `${cooldowns.heal}s` : "20 ⚡"}
          </button>
        </div>
        <div className="flex justify-between items-center mt-2 max-w-2xl mx-auto">
          <p className="text-[10px] font-label uppercase tracking-widest text-slate-500">{isOneToMany ? "Click bot to target • Special hits all" : "Tap rapidly • Combo builds"} • Energy regens</p>
          <button onClick={onExit} className="text-[10px] font-headline uppercase tracking-widest border border-white/10 px-3 py-1 hover:bg-white/5">Exit</button>
        </div>
      </div>

      {/* Victory / Defeat overlay */}
      <AnimatePresence>
        {gameState !== "playing" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} className={`w-20 h-20 rounded-full border-2 flex items-center justify-center ${gameState === "victory" ? "border-green-500 bg-green-500/10" : "border-error bg-error/10"}`}>
              <span className={`material-symbols-outlined text-4xl ${gameState === "victory" ? "text-green-400" : "text-error"}`}>{gameState === "victory" ? "trophy" : "skull"}</span>
            </motion.div>
            <h3 className={`font-display text-4xl font-bold uppercase mt-4 ${gameState === "victory" ? "text-green-400" : "text-error"}`}>{gameState === "victory" ? "VICTORY" : "DEFEAT"}</h3>
            <p className="text-slate-400 mt-2">Score {score} • Time {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")} • {isOneToMany ? "1vN Squad" : "1v1 Duel"}</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => window.location.reload()} className="px-6 py-3 bg-primary text-black font-bold uppercase tracking-widest">Play Again</button>
              <button onClick={onExit} className="px-6 py-3 border border-white/10 font-bold uppercase tracking-widest hover:bg-white/5">Exit Arena</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Log */}
      <div className="absolute top-[42%] right-3 z-10 hidden lg:block w-56 pointer-events-none">
        <div className="space-y-1">
          {log.slice(0, 4).map((l) => (
            <div key={l.id} className={`text-[10px] font-label px-2 py-1 border backdrop-blur ${l.type === "victory" ? "bg-green-500/10 border-green-500/20 text-green-400" : l.type === "defeat" ? "bg-error/10 border-error/20 text-error" : l.type === "damage" ? "bg-tertiary/10 border-tertiary/20 text-tertiary" : "bg-black/60 border-white/10 text-slate-300"}`}>
              {l.msg}
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes shake { 0%,100%{ transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }`}</style>
    </div>
  );
}
