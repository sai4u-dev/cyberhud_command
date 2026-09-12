import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../../features/auth/authSlice";
import { motion } from "framer-motion";
import gsap from "gsap";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error, isAuthenticated } = useSelector((s) => s.auth);
  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    // Gsap entrance
    gsap.fromTo(".login-card", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (result.meta.requestStatus === "fulfilled") {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-24 relative overflow-hidden">
      <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="login-card w-full max-w-md relative z-10"
      >
        <div className="glass-panel p-8 md:p-10 border border-primary/20 corner-bracket relative">
          <div className="text-center mb-8">
            <span className="material-symbols-outlined text-primary text-4xl">fingerprint</span>
            <h2 className="font-display text-3xl font-bold tracking-tight mt-2">NEURAL_LINK</h2>
            <p className="text-xs font-label tracking-[0.3em] uppercase text-primary/60 mt-1">Authenticate to enter battle zone</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-error/10 border border-error/30 text-error text-sm font-label">
              {typeof error === "string" ? error : JSON.stringify(error)}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] font-headline uppercase tracking-widest text-slate-400">Email_Uplink</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="operator@cyberhud.io"
                className="w-full mt-1 bg-surface-container border border-white/10 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-0 transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-headline uppercase tracking-widest text-slate-400">Access_Code</label>
              <input
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full mt-1 bg-surface-container border border-white/10 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-0 transition-colors"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-primary text-black font-bold uppercase tracking-widest py-4 hover:brightness-110 disabled:opacity-60 transition-all text-sm"
            >
              {status === "loading" ? "Authenticating..." : "ENTER_GRID →"}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-xs font-label uppercase tracking-widest text-slate-500">
            No uplink? <Link to="/register" className="text-primary hover:underline">Initialize_Account</Link>
          </div>

          <div className="mt-6 flex items-center gap-2 justify-center opacity-40">
            <span className="h-px w-12 bg-white/10" />
            <span className="text-[10px] font-label uppercase">Secured by CYBERHUD</span>
            <span className="h-px w-12 bg-white/10" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
