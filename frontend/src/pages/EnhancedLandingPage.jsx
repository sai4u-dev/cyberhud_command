import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CyberCore from "../components/canvas/CyberCore";
import anime from "animejs";

gsap.registerPlugin(ScrollTrigger);

export default function EnhancedLandingPage() {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.4]);

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

      {/* HERO with 3D */}
      <motion.section style={{ scale, opacity }} className="relative min-h-[90vh] flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]" alt="cyber city"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtQuSRdBg3T_g_weKJgV9JXeTI2USnFgh46sOMzU6Bs23KH-8suRJnCUlrccy1fa8Q6RT0P5DrU0ZNRK3oBsBwapB74B9te32ydtY9Ym2TIeFFBNgwZC3k-J4bBp2xcrQGxSAtdTiyhxAAqIjcVJ2ZxnHY2EBrVWKdfECz3-dFWoIZDc90KLHi5Iu9lZxPZrtl1nM_u9NOcJgdTjnka_hdfCbUV2R0rPasXzr6oBascpR6gvsLrRekznYOUk-Q5U3HQQtTaP7Z1WM" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-12">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-block mb-6 px-4 py-1 border border-primary/30 bg-primary/5 backdrop-blur-md">
              <span className="font-label text-primary text-xs tracking-[0.3em] uppercase">System Status: Optimal • 128K Operators Online</span>
            </motion.div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] glow-text">
              <span className="hero-word inline-block overflow-hidden">THE</span>{" "}
              <span className="hero-word inline-block overflow-hidden text-primary">FUTURE</span>
              <br />
              <span className="hero-word inline-block overflow-hidden">OF GAMING</span>
            </h1>

            <p className="hero-cta text-slate-300 max-w-xl mt-6 text-base md:text-lg leading-relaxed">
              Enter the neural grid. Battle solo or squad. Climb ranks, claim shards, own the void. Built for high-frequency combat at 120fps.
            </p>

            <div className="hero-cta flex flex-col sm:flex-row gap-4 mt-8">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/register" className="group relative bg-primary text-black px-8 py-4 font-bold uppercase tracking-widest flex items-center gap-2 hover:brightness-110 transition-all">
                  ENTER THE NEURAL LINK
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </motion.div>
              <Link to="/battlezone" className="px-8 py-4 border border-white/20 font-bold uppercase tracking-widest hover:bg-white/5 transition-all text-sm text-center">
                Explore BattleZones
              </Link>
            </div>

            <div className="hero-cta flex gap-6 mt-8 text-[10px] font-label uppercase tracking-widest text-slate-500">
              <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> 14 Tournaments Live</span>
              <span>• 4,200 ETH Prize Pool</span>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="relative">
            <CyberCore className="w-full h-[420px] md:h-[560px]" />
            <div className="absolute bottom-6 left-6 right-6 glass-panel p-4 border border-primary/10 hidden md:block">
              <p className="text-[10px] font-headline tracking-widest text-primary">CYBER_CORE_V2 • 3D REAL-TIME</p>
              <p className="text-xs text-slate-400 mt-1">Drag to orbit • Scroll to explore • Powered by Three.js + React Three Fiber</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

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

      {/* CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full" />
        <div className="max-w-4xl mx-auto text-center relative z-10 glass-panel p-10 md:p-16 border border-primary/10">
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight">INITIALIZE <br /> YOUR_LEGACY</h2>
          <p className="text-slate-400 max-w-xl mx-auto mt-4">Join elite operators carving paths through the neural grid. Secure your ID and claim starting credits.</p>
          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-primary text-black px-10 py-4 font-bold uppercase tracking-widest hover:brightness-110">Create Account</Link>
            <Link to="/login" className="px-10 py-4 border border-white/20 font-bold uppercase tracking-widest hover:bg-white/5 text-sm">Already Linked? Login</Link>
          </div>
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
