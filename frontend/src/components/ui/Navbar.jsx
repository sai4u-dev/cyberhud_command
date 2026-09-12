import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../../hooks/useAuth";
import { logoutUser } from "../../features/auth/authSlice";
import { motion } from "framer-motion";

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/");
  };

  return (
    <header className="fixed top-0 w-full border-b border-cyan-500/10 bg-black/60 backdrop-blur-xl flex justify-between items-center px-6 h-16 z-50">
      <Link to="/" className="flex items-center gap-3">
        <span className="material-symbols-outlined text-cyan-400">terminal</span>
        <h1 className="text-xl font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)] font-display uppercase tracking-widest">
          CYBERHUD_COMMAND
        </h1>
      </Link>

      <nav className="hidden md:flex gap-6 items-center h-full font-headline text-sm uppercase tracking-widest">
        <Link to="/" className="text-slate-400 hover:text-cyan-300 transition-colors py-2">Mission_Control</Link>
        <Link to="/battlezone" className="text-slate-400 hover:text-cyan-300 transition-colors py-2">BattleZone</Link>
        <Link to="/achievementsmissions" className="text-slate-400 hover:text-cyan-300 transition-colors py-2">Archive</Link>
        {user?.role === "admin" && (
          <Link to="/admin" className="text-secondary hover:text-secondary/80 transition-colors py-2">Admin</Link>
        )}
      </nav>

      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <div className="hidden sm:flex flex-col items-end bg-surface-container px-3 py-1 border border-primary/20">
              <span className="text-[10px] font-label text-primary/70 uppercase tracking-tighter">{user?.role} • {user?.username}</span>
              <span className="text-primary font-bold text-xs flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" /> ONLINE
              </span>
            </div>
            <Link to="/dashboard" className="w-9 h-9 border border-primary/30 bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-primary text-xl">account_circle</span>
            </Link>
            <button
              onClick={handleLogout}
              className="hidden md:block px-4 py-2 bg-transparent border border-white/10 text-xs font-label uppercase tracking-widest hover:border-primary hover:text-primary transition-all"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-5 py-2 border border-white/10 text-xs font-label uppercase tracking-widest hover:bg-white/5 transition-all">Login</Link>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/register" className="px-5 py-2 bg-primary text-black font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all">
                Initialize
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </header>
  );
}
