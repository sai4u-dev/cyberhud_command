import { useEffect, useRef, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CyberWarrior from "../components/canvas/CyberWarrior";
import { TrustedBy, HowItWorks, ModesExpanded, LiveBattlesStrip, Operators, TournamentPrize, ArsenalTease, Roadmap, Community, FAQ } from "../components/landing/LandingSections";
import anime from "animejs";

gsap.registerPlugin(ScrollTrigger);

export default function EnhancedLandingPage() {
  const heroRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // HERO stagger with anime + gsap combo
      anime({
        targets: ".hero-word",
        translateY: [80, 0],
        opacity: [0, 1],
        delay: anime.stagger(120),
        duration: 1000,
        easing: "easeOutExpo",
      });

      gsap.fromTo(".hero-cta",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 0.8 }
      );

      // Stats parallax
      gsap.fromTo(".stat-card",
        { y: 60, opacity: 0, rotationX: 10 },
        {
          y: 0, opacity: 1, rotationX: 0, duration: 0.7, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: statsRef.current, start: "top 85%" }
        }
      );

      // Featured cards
      gsap.fromTo(".feature-card",
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: ".features-section", start: "top 80%" }
        }
      );

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="bg-background text-on-surface selection:bg-primary selection:text-black overflow-x-hidden">
      <div className="fixed inset-0 scanlines z-50 opacity-10 pointer-events-none" />

      {/* HERO — Full Width / Full Screen 3D with THE FUTURE OF GAMING + Playable Warrior */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* 3D Warrior — Full Screen Background (playable) */}
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<div className="w-full h-full bg-black flex items-center justify-center text-slate-500">Loading Warrior…</div>}>
            <CyberWarrior className="w-full h-full" enableZoom={false} />
          </Suspense>
          {/* Subtle city overlay behind warrior for depth — low opacity */}
          <img className="absolute inset-0 w-full h-full object-cover grayscale-[0.35] contrast-[1.15] opacity-[0.18] pointer-events-none" alt="cyber city"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtQuSRdBg3T_g_weKJgV9JXeTI2USnFgh46sOMzU6Bs23KH-8suRJnCUlrccy1fa8Q6RT0P5DrU0ZNRK3oBsBwapB74B9te32ydtY9Ym2TIeFFBNgwZC3k-J4bBp2xcrQGxSAtdTiyhxAAqIjcVJ2ZxnHY2EBrVWKdfECz3-dFWoIZDc90KLHi5Iu9lZxPZrtl1nM_u9NOcJgdTjnka_hdfCbUV2R0rPasXzr6oBascpR6gvsLrRekznYOUk-Q5U3HQQtTaP7Z1WM" />
          {/* Gradient for text readability — keeps warrior visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/45 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        </div>

        {/* THE FUTURE OF GAMING — Centered on 3D model (playable warrior behind) */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col items-center text-center py-20 pointer-events-none">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 border border-primary/30 bg-black/55 backdrop-blur-md pointer-events-auto">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-label text-primary text-xs tracking-[0.3em] uppercase">System Status: Optimal • 128K Operators Online • Playable 3D</span>
          </motion.div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-[88px] font-bold tracking-tighter leading-[0.88] glow-text drop-shadow-[0_2px_24px_rgba(0,0,0,0.85)] pointer-events-none">
            <span className="hero-word inline-block">THE</span>{" "}
            <span className="hero-word inline-block text-primary">FUTURE</span>
            <br />
            <span className="hero-word inline-block">OF GAMING</span>
          </h1>

          <p className="hero-cta text-slate-200 max-w-2xl mt-5 text-base md:text-[18px] leading-relaxed drop-shadow-[0_1px_12px_rgba(0,0,0,0.9)] bg-black/25 backdrop-blur-sm px-4 py-2 border border-white/5 pointer-events-none">
            Enter the neural grid. <span className="text-white font-bold">Play</span> with the warrior — <span className="text-primary">WASD</span> to move, <span className="text-primary">Click / Space</span> to slash, <span className="text-primary">Drag</span> to orbit. Battle solo or squad at 120fps.
          </p>

          <div className="hero-cta flex flex-col sm:flex-row gap-3 mt-7 pointer-events-auto">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/register" className="group relative bg-primary text-black px-8 py-4 font-black uppercase tracking-widest flex items-center gap-2 hover:brightness-110 transition-all shadow-[0_0_24px_rgba(143,245,255,0.35)] pointer-events-auto">
                ENTER THE NEURAL LINK
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </motion.div>
            <Link to="/battlezone" className="px-8 py-4 bg-black/60 backdrop-blur-md border border-white/20 font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-sm text-center text-white pointer-events-auto">
              Explore BattleZones
            </Link>
          </div>

          <div className="hero-cta flex flex-wrap justify-center gap-4 md:gap-6 mt-6 text-[11px] font-label uppercase tracking-widest pointer-events-none">
            <span className="flex items-center gap-2 bg-black/55 backdrop-blur px-3 py-1.5 border border-white/10 text-slate-300"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> 14 Tournaments Live</span>
            <span className="flex items-center gap-2 bg-black/55 backdrop-blur px-3 py-1.5 border border-white/10 text-slate-300">4,200 ETH Prize Pool</span>
            <span className="hidden md:flex items-center gap-2 bg-primary/15 backdrop-blur px-3 py-1.5 border border-primary/20 text-primary">▶ PLAYABLE — WASD + CLICK</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-[10px] font-headline tracking-[0.2em] uppercase text-slate-400">Scroll ↓</span>
          <span className="w-px h-8 bg-gradient-to-b from-slate-400 to-transparent animate-pulse" />
        </motion.div>
      </section>

      {/* STATS */}
      <section ref={statsRef} className="py-16 px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h3 className="font-display text-2xl uppercase tracking-widest text-primary">LIVE_TELEMETRY</h3>
          <div className="h-1 w-24 bg-primary mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stat-card glass-panel p-8 relative overflow-hidden group hover:border-primary/20 transition-colors">
            <p className="text-xs font-label uppercase tracking-widest text-slate-500">Active_Operators</p>
            <h4 className="font-display text-4xl text-primary mt-2">128,492</h4>
            <div className="flex items-end gap-1 h-12 mt-4">
              {[16, 32, 24, 40, 48].map((h, i) => (
                <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: h }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }} className="w-full bg-primary/60" style={{ height: h }} />
              ))}
            </div>
            <p className="mt-3 text-xs font-label text-primary/60">+12% vs last cycle</p>
          </div>
          <div className="stat-card glass-panel p-8 border-secondary/20 hover:border-secondary/30 transition-colors">
            <p className="text-xs font-label uppercase tracking-widest text-slate-500">Global_Prize_Pool</p>
            <h4 className="font-display text-4xl text-secondary mt-2">4,200 ETH</h4>
            <div className="grid grid-cols-6 gap-2 mt-6">
              {[1, 1, 0.2, 1, 1, 0.2].map((o, i) => (
                <div key={i} className="h-1 bg-secondary" style={{ opacity: o }} />
              ))}
            </div>
            <p className="mt-3 text-xs font-label text-secondary/60">Distributed across 48 tiers</p>
          </div>
          <div className="stat-card glass-panel p-8 border-tertiary/20 hover:border-tertiary/30 transition-colors">
            <p className="text-xs font-label uppercase tracking-widest text-slate-500">Live_Tournaments</p>
            <h4 className="font-display text-4xl text-tertiary mt-2">14 LIVE</h4>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-[10px] font-label">
                <span className="text-slate-400">NEURAL BREACH</span><span className="text-tertiary">FINAL STAGE</span>
              </div>
              <div className="w-full bg-white/5 h-1">
                <motion.div initial={{ width: 0 }} whileInView={{ width: "75%" }} transition={{ duration: 1, delay: 0.5 }} className="bg-tertiary h-full" />
              </div>
            </div>
            <p className="mt-3 text-xs font-label text-tertiary/60">842 viewers</p>
          </div>
        </div>
      </section>

      {/* FEATURED SECTORS */}
      <section className="features-section py-20 bg-surface-container/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h3 className="font-display text-2xl uppercase tracking-widest text-primary">FEATURED_SECTORS</h3>
              <p className="text-sm text-slate-500 uppercase tracking-tighter mt-1">Choose your battlefield</p>
            </div>
            <Link to="/battlezone" className="hidden md:flex items-center gap-2 text-xs font-label uppercase tracking-widest border border-white/10 px-4 py-2 hover:border-primary hover:text-primary transition-colors">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "VOID_WALKER", tag: "FPS / TACTICAL", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDStQJ61nhr4VENvgw7exZaT6lfUgUp2nZIVrNlFG5XrARigKWUo4j0jKK2A912tYlOuy-HZE_Ac0Dh5GUPez2Ao9Xmp0x5aKNSf9kyDC8R_SrflrqeyqmG82rE5UtPMSmo5AIngUjkl0_Spipiy8VCXx6KgvSdn-OK4TymdV_5Vzefr5IBaVNEJnEUDg01gQBM4aEC-9E5qEBjfMfSK339GofhQJ1QnzMCPvATJLGQa4Hj-FVMXbj252UAtQQKwR3cbjrnhnSDw00", color: "primary" },
              { title: "PROTO_GRID", tag: "STRATEGY / NODE", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPgVhMM2GxFkAmJHYUOUkX3-Jww2QPObzKAcfLXLOOaer8_zhqyqeKqKyEz7gpgq-yBOZAVmjcswXs9X0gWcvsbLg7rMx2SDbYxQGLV3ceg-s9sMp3p5wldzAfTz8aqa7yHU_AKVYQQSu7gepk9D5pwdEJLR9WPh-dUA5OFPdvTem2mGsE7-YHhBNsWHEIdV3v88tqHGPqQa97AFhg8DmumQUKw0lAyFrClYN-P1q1FtcrtjLNfMd_7BZEVM-dcW9QUEQJ0BSuCNs", color: "secondary" },
              { title: "SYNTH_DRIVE", tag: "RACING / HIGH_STAKES", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXH5uz5o-QsN6rWy6rTCggyaEDF0Gy9k1yyHPHKJcy5ShOooeSuQWupP1l59HxEqT5G6utC18v9buloTQ6QnM5eh7yZrRwbgP5c-jT8TSq94nM1gy7Ffcg2-sVzaYGrKiFPJlIOsDiIvqyhpLSJjWdfdRL1z7A2s1CeyWkSa6jyrDzCfJ8Mpj-Pp-Pp0DsAjEXr4jT32gg-RQ944cgRolPy7Lz3c3tOV8H3VRPp-nQRkFcdBQ6GbrMVBdaEgXdTxdEiKY_AiK6hb0", color: "tertiary" },
              { title: "DEEP_LINK", tag: "RPG / CYBERWARE", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyVwRF0LagCClPUdverAihKGXpwOnbXtkuaKfxx4aQ6e0PLPMl4Zz6wZsIh6e6VUHQN71awyBZjxBnWE8PK0eT9Xmmm9tSF8ym28_zppMeTmUeTzZeJE_DKjVleq_DFx2jcZBlntXcUuiJJXSmYb3G53t1tUDK6n6yYBRSg9PKj2eKPtuihpV2orHlA02N1kBp-3jxdQtgNB7cq7S5F3UBBEI1Cp6AJyhqB2ifsN0C5H-tjk2_AB4RiIl_9LUx-kQUOpZZatM2udw", color: "primary" },
            ].map((card) => (
              <motion.div key={card.title} whileHover={{ y: -6 }} className="feature-card group relative glass-panel aspect-[3/4] overflow-hidden cursor-pointer border border-white/5 hover:border-primary/20">
                <img className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt={card.title} src={card.img} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <span className={`text-[10px] px-2 py-0.5 mb-2 inline-block ${card.color === "primary" ? "text-primary bg-primary/10" : card.color === "secondary" ? "text-secondary bg-secondary/10" : "text-tertiary bg-tertiary/10"}`}>{card.tag}</span>
                  <h5 className="font-display text-xl uppercase">{card.title}</h5>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TrustedBy />
      <HowItWorks />
      <ModesExpanded />
      <LiveBattlesStrip />
      <Operators />
      <TournamentPrize />
      <ArsenalTease />
      <Roadmap />
      <Community />
      <FAQ />

      {/* CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full" />
        <div className="max-w-4xl mx-auto text-center relative z-10 glass-panel p-10 md:p-16 border border-primary/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-black text-[11px] font-black tracking-widest mb-4">SMOOTH 60FPS • READY TO PLAY</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight">INITIALIZE <br /> YOUR_LEGACY</h2>
          <p className="text-slate-400 max-w-xl mx-auto mt-4">Join elite operators carving paths through the neural grid. Secure your ID and claim starting credits. Instant payouts.</p>
          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-primary text-black px-10 py-4 font-bold uppercase tracking-widest hover:brightness-110">Create Account</Link>
            <Link to="/login" className="px-10 py-4 border border-white/20 font-bold uppercase tracking-widest hover:bg-white/5 text-sm">Already Linked? Login</Link>
          </div>
          <p className="text-[11px] text-slate-600 mt-4">Terms & Privacy apply • Play responsibly</p>
        </div>
      </section>

      <footer className="py-10 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="font-display font-bold text-cyan-400 tracking-widest">CYBERHUD</span>
            <span className="text-[10px] text-slate-500 uppercase">© 2077 NEURAL SYSTEMS</span>
          </div>
          <div className="flex gap-6 text-[10px] font-label uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-primary">Terminals_of_Service</a>
            <a href="#" className="hover:text-primary">Privacy_Protocol</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
