import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../../features/auth/authSlice";
import { motion } from "framer-motion";
import gsap from "gsap";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "", displayName: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, isAuthenticated } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    gsap.fromTo(".register-card", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-24 relative overflow-hidden">
      <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="register-card w-full max-w-lg relative z-10">
        <div className="glass-panel p-8 md:p-10 border border-primary/20 relative">
          <div className="text-center mb-8">
            <span className="material-symbols-outlined text-primary text-4xl">person_add</span>
            <h2 className="font-display text-3xl font-bold tracking-tight mt-2">INITIALIZE_IDENTITY</h2>
            <p className="text-xs font-label tracking-[0.3em] uppercase text-primary/60 mt-1">Create your operator profile</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-error/10 border border-error/30 text-error text-sm font-label">
              {typeof error === "string" ? error : JSON.stringify(error)}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-headline uppercase tracking-widest text-slate-400">Codename</label>
                <input name="username" required value={form.username} onChange={handleChange} placeholder="VOID_WALKER_01"
                  className="w-full mt-1 bg-surface-container border border-white/10 px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="text-[10px] font-headline uppercase tracking-widest text-slate-400">Display_Name</label>
                <input name="displayName" value={form.displayName} onChange={handleChange} placeholder="Operator One"
                  className="w-full mt-1 bg-surface-container border border-white/10 px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-headline uppercase tracking-widest text-slate-400">Email_Uplink</label>
              <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="operator@cyberhud.io"
                className="w-full mt-1 bg-surface-container border border-white/10 px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-headline uppercase tracking-widest text-slate-400">Access_Code</label>
              <input name="password" type="password" required value={form.password} onChange={handleChange} placeholder="Min 8 chars, Upper + Number + Symbol"
                className="w-full mt-1 bg-surface-container border border-white/10 px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors" />
              <p className="text-[10px] text-slate-500 mt-1">Must include uppercase, lowercase, number & symbol</p>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={status === "loading"}
              className="w-full mt-2 bg-primary text-black font-bold uppercase tracking-widest py-4 hover:brightness-110 disabled:opacity-60 transition-all text-sm">
              {status === "loading" ? "Initializing..." : "CREATE_IDENTITY →"}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-xs font-label uppercase tracking-widest text-slate-500">
            Already linked? <Link to="/login" className="text-primary hover:underline">Access_Neural_Link</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
