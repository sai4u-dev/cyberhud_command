import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBattleById, joinBattle, leaveBattle, startBattle, finishBattle } from "../../features/battle/battleSlice";
import { motion } from "framer-motion";
import PlayableArena from "../../components/battle/PlayableArena";

export default function BattleRoom() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBattle: battle, status } = useSelector((s) => s.battle);
  const { user } = useSelector((s) => s.auth);
  const [countdown, setCountdown] = useState(null);
  const [playMode, setPlayMode] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchBattleById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (battle?.status === "in_progress" && battle.startedAt) {
      const start = new Date(battle.startedAt).getTime();
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - start) / 1000);
        setCountdown(elapsed);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [battle]);

  // Auto-enter play mode when battle goes in_progress — render-phase
  // adjustment (no setState-in-effect)
  const [prevBattleStatus, setPrevBattleStatus] = useState(battle?.status);
  if (battle?.status !== prevBattleStatus) {
    setPrevBattleStatus(battle?.status);
    if (battle?.status === "in_progress") setPlayMode(true);
  }

  if (!battle && status !== "loading") {
    return <div className="pt-32 text-center text-slate-500">Battle not found. <button onClick={() => navigate("/battles")} className="text-primary underline">Back to lobby</button></div>;
  }
  if (!battle) return <div className="pt-32 text-center text-slate-500">Loading battle room...</div>;

  const isParticipant = battle.participants?.some((p) => p.user?._id === user?._id || p.user === user?._id);
  const isHost = battle.host?._id === user?._id || battle.host === user?._id;

  const handleJoin = async () => {
    const res = await dispatch(joinBattle({ id: battle._id }));
    if (res.meta.requestStatus === "rejected") alert(res.payload);
    else dispatch(fetchBattleById(battle._id));
  };

  const handleLeave = async () => {
    if (!confirm("Leave battle?")) return;
    await dispatch(leaveBattle(battle._id));
    navigate("/battles");
  };

  const handleStart = async () => {
    const res = await dispatch(startBattle(battle._id));
    if (res.meta.requestStatus === "rejected") alert(res.payload);
  };

  const handleFinish = async () => {
    const winnerId = prompt("Enter winner user ID (or leave empty for auto):", battle.winner || battle.host?._id || "");
    const res = await dispatch(finishBattle({ id: battle._id, winnerId: winnerId || undefined }));
    if (res.meta.requestStatus === "rejected") alert(res.payload);
  };

  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left - Battle info */}
        <div className="flex-1">
          <div className="glass-panel p-6 border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full" />
            <div className="relative z-10">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`text-[10px] font-headline px-2 py-1 border ${battle.type === "one_to_one" ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary/10 text-secondary border-secondary/20"}`}>{battle.type === "one_to_one" ? "1 vs 1" : `1 vs ${battle.maxParticipants - 1} • ${battle.type === "one_to_many" ? "SQUAD" : ""}`}</span>
                <span className={`text-[10px] font-headline px-2 py-1 border uppercase ${battle.status === "waiting" ? "bg-green-500/10 text-green-400 border-green-500/20" : battle.status === "in_progress" ? "bg-tertiary/10 text-tertiary border-tertiary/20 animate-pulse" : "bg-white/5 text-slate-400"}`}>{battle.status}</span>
                <span className="text-[10px] font-label text-slate-500 border border-white/10 px-2 py-1">{battle.code}</span>
              </div>
              <h2 className="font-display text-3xl font-bold uppercase">{battle.title}</h2>
              <p className="text-sm text-slate-400 mt-2">{battle.description}</p>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-surface-container p-3 border border-white/5 text-center">
                  <p className="text-[10px] font-headline uppercase tracking-widest text-slate-500">Mode</p>
                  <p className="font-bold text-sm uppercase mt-1">{battle.mode}</p>
                </div>
                <div className="bg-surface-container p-3 border border-white/5 text-center">
                  <p className="text-[10px] font-headline uppercase tracking-widest text-slate-500">Capacity</p>
                  <p className="font-bold text-sm mt-1">{battle.participants.length} / {battle.maxParticipants}</p>
                </div>
                <div className="bg-surface-container p-3 border border-white/5 text-center">
                  <p className="text-[10px] font-headline uppercase tracking-widest text-slate-500">Entry</p>
                  <p className="font-bold text-sm mt-1">{battle.entryFee || 0} CR</p>
                </div>
              </div>

              {battle.status === "in_progress" && countdown !== null && (
                <div className="mt-6 flex items-center gap-3">
                  <span className="w-3 h-3 bg-tertiary rounded-full animate-pulse" />
                  <span className="font-display text-xl text-tertiary">LIVE • {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")}</span>
                  <span className="text-xs text-slate-500">elapsed</span>
                </div>
              )}

              <div className="flex flex-wrap gap-3 mt-6">
                {!isParticipant && battle.status === "waiting" && <button onClick={handleJoin} className="px-6 py-3 bg-primary text-black font-bold uppercase tracking-widest hover:brightness-110">Join_Battle</button>}
                {isParticipant && battle.status === "waiting" && !isHost && <button onClick={handleLeave} className="px-6 py-3 border border-white/10 font-bold uppercase tracking-widest hover:bg-white/5">Leave</button>}
                {isHost && battle.status === "waiting" && <button onClick={handleStart} className="px-6 py-3 bg-tertiary text-black font-bold uppercase tracking-widest hover:brightness-110">Start_Battle →</button>}
                {isHost && battle.status === "in_progress" && <button onClick={handleFinish} className="px-6 py-3 bg-secondary text-white font-bold uppercase tracking-widest hover:brightness-110">Finish & Declare Winner</button>}
                {battle.status === "completed" && battle.winner && <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold">Winner: {typeof battle.winner === "object" ? battle.winner.username : battle.winner}</div>}
              </div>
            </div>
          </div>

          {/* Playable Arena */}
          <div className="mt-6 glass-panel p-4 border border-white/5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-headline text-xs font-bold tracking-widest flex items-center gap-2"><span className="w-2 h-4 bg-primary inline-block" /> BATTLE_ARENA • {battle.type === "one_to_one" ? "1V1" : "1VN"} {playMode ? "— PLAYABLE" : ""}</h3>
              <div className="flex gap-2">
                <button onClick={() => setPlayMode(!playMode)} className={`px-3 py-1 text-[10px] font-headline uppercase tracking-widest border ${playMode ? "bg-primary text-black border-primary" : "border-white/10 hover:border-primary/30"}`}>{playMode ? "Exit Play" : "▶ Play"}</button>
                <span className={`text-[10px] px-2 py-1 border font-headline uppercase ${battle.status === "in_progress" ? "bg-tertiary/10 text-tertiary border-tertiary/20 animate-pulse" : "bg-white/5 text-slate-500"}`}>{battle.status}</span>
              </div>
            </div>

            {playMode ? (
              <PlayableArena
                mode={battle.type}
                onVictory={async () => {
                  // if host, auto-finish battle with victory
                  if (isHost && battle.status === "in_progress") {
                    await dispatch(finishBattle({ id: battle._id, winnerId: user._id }));
                    dispatch(fetchBattleById(battle._id));
                  }
                }}
                onDefeat={async () => {
                  if (isHost && battle.status === "in_progress" && battle.participants.length > 1) {
                    // pick opponent as winner
                    const winner = battle.participants.find((p) => (p.user?._id || p.user) !== user._id);
                    if (winner) await dispatch(finishBattle({ id: battle._id, winnerId: winner.user?._id || winner.user }));
                  }
                }}
                onExit={() => setPlayMode(false)}
              />
            ) : (
              <div className="relative h-64 bg-black/40 border border-white/5 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />
                {battle.status === "waiting" ? (
                  <div className="relative z-10 text-center">
                    <span className="material-symbols-outlined text-5xl text-primary animate-pulse">swords</span>
                    <p className="font-display uppercase mt-2">Awaiting Deployment</p>
                    <p className="text-xs text-slate-500">{battle.participants.length}/{battle.maxParticipants} ready</p>
                    <button onClick={() => setPlayMode(true)} className="mt-3 px-4 py-2 bg-primary text-black text-xs font-bold uppercase tracking-widest">Practice Solo Play</button>
                  </div>
                ) : battle.status === "in_progress" ? (
                  <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="relative z-10 text-center">
                    <p className="font-display text-2xl text-tertiary">COMBAT_ACTIVE</p>
                    <p className="text-xs text-slate-500 mt-1">Click Play to enter arena</p>
                    <button onClick={() => setPlayMode(true)} className="mt-3 px-6 py-2 bg-tertiary text-black font-bold uppercase tracking-widest">Enter Arena →</button>
                  </motion.div>
                ) : (
                  <div className="relative z-10 text-center">
                    <span className="material-symbols-outlined text-5xl text-slate-600">flag</span>
                    <p className="font-display uppercase mt-2">Battle {battle.status}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right - Participants & Log */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="glass-panel p-5 border border-white/5">
            <h3 className="font-headline text-xs font-bold tracking-widest">OPERATORS ({battle.participants.length}/{battle.maxParticipants})</h3>
            <div className="mt-4 space-y-2">
              {battle.participants.map((p, i) => {
                const isMe = (p.user?._id || p.user) === user?._id;
                return (
                  <div key={i} className={`flex items-center gap-3 p-3 border ${isMe ? "bg-primary/10 border-primary/20" : "bg-surface-container border-white/5"}`}>
                    <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center font-bold text-sm border border-white/10">{p.username[0].toUpperCase()}</div>
                    <div className="flex-1">
                      <p className="text-sm font-bold flex items-center gap-1">{p.username} {p.role === "host" && <span className="text-[10px] px-1 bg-primary text-black font-headline">HOST</span>}</p>
                      <p className="text-[10px] text-slate-500">{p.displayName} • {p.isReady ? "READY" : "NOT READY"}</p>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${p.isReady ? "bg-green-500" : "bg-slate-600"}`} />
                  </div>
                );
              })}
              {Array.from({ length: Math.max(0, battle.maxParticipants - battle.participants.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="flex items-center gap-3 p-3 border border-dashed border-white/10 bg-black/20">
                  <div className="w-10 h-10 rounded-full border border-dashed border-white/10 flex items-center justify-center"><span className="material-symbols-outlined text-slate-600 text-sm">add</span></div>
                  <p className="text-sm text-slate-600">Empty Slot</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-5 border border-white/5">
            <h3 className="font-headline text-xs font-bold tracking-widest">BATTLE_LOG</h3>
            <div className="mt-3 space-y-2 max-h-64 overflow-auto">
              {(battle.events || []).slice().reverse().map((e, i) => (
                <div key={i} className="text-xs border-l-2 border-primary/20 pl-3 py-1">
                  <p className="text-slate-300">{e.message}</p>
                  <p className="text-[10px] text-slate-500">{new Date(e.at).toLocaleTimeString()}</p>
                </div>
              ))}
              {(!battle.events || battle.events.length === 0) && <p className="text-xs text-slate-600">No events yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
