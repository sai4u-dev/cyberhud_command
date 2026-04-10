import React from 'react'

export default function LandingPage() {
    return (
        <>
            <div className="bg-background text-on-background selection:bg-primary selection:text-on-primary">
                <div class="fixed inset-0 scanlines z-50 opacity-20 pointer-events-none"></div>
                <div className="bg-background text-on-background selection:bg-primary selection:text-on-primary">
                    <div class="fixed inset-0 scanlines z-50 opacity-20 pointer-events-none"></div>
                    <div>
                        {/* <!--  TopAppBar --> */}
                        <header class="fixed top-0 w-full border-b border-cyan-500/10 bg-black/60 backdrop-blur-xl flex justify-between items-center px-6 h-16 z-50 shadow-[0_0_20px_rgba(0,240,255,0.05)]">
                            <div class="flex items-center gap-3">
                                <span class="material-symbols-outlined text-cyan-400" data-icon="terminal">terminal</span>
                                <h1 class="text-xl font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)] font-['Space_Grotesk'] uppercase tracking-widest">CYBERHUD_COMMAND</h1>
                            </div>
                            <nav class="hidden md:flex gap-8 items-center h-full">
                                <a class="font-['Space_Grotesk'] uppercase tracking-widest text-sm text-cyan-400 border-b-2 border-cyan-400 h-full flex items-center transition-all duration-200" href="#">Mission_Control</a>
                                <a class="font-['Space_Grotesk'] uppercase tracking-widest text-sm text-slate-500 hover:bg-cyan-500/10 hover:text-cyan-200 transition-all duration-200 h-full flex items-center" href="#">Arsenal</a>
                                <a class="font-['Space_Grotesk'] uppercase tracking-widest text-sm text-slate-500 hover:bg-cyan-500/10 hover:text-cyan-200 transition-all duration-200 h-full flex items-center" href="#">Market</a>
                                <a class="font-['Space_Grotesk'] uppercase tracking-widest text-sm text-slate-500 hover:bg-cyan-500/10 hover:text-cyan-200 transition-all duration-200 h-full flex items-center" href="#">Neural_Link</a>
                            </nav>
                            <div class="flex items-center gap-4">
                                <div class="bg-surface-container-highest px-3 py-1 border border-primary/20">
                                    <span class="text-xs font-label text-primary/70 block uppercase tracking-tighter">Balance</span>
                                    <span class="text-primary font-bold">0.0042 ETH</span>
                                </div>
                                <button class="material-symbols-outlined text-on-surface hover:text-primary transition-colors" data-icon="account_circle">account_circle</button>
                            </div>
                        </header>
                        <main class="pt-16">
                            {/* <!--  Hero Section --> */}
                            <section class="relative h-[795px] flex items-center justify-center overflow-hidden">
                                <div class="absolute inset-0 z-0">
                                    <div class="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10"></div>
                                    <div class="absolute inset-0 bg-black/40 z-10"></div>
                                    <img class="w-full h-full object-cover grayscale-[0.2] contrast-[1.2]" data-alt="cinematic wide shot of a futuristic cyberpunk city with neon blue and pink lights reflecting off rainy streets and dark metallic skyscrapers" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtQuSRdBg3T_g_weKJgV9JXeTI2USnFgh46sOMzU6Bs23KH-8suRJnCUlrccy1fa8Q6RT0P5DrU0ZNRK3oBsBwapB74B9te32ydtY9Ym2TIeFFBNgwZC3k-J4bBp2xcrQGxSAtdTiyhxAAqIjcVJ2ZxnHY2EBrVWKdfECz3-dFWoIZDc90KLHi5Iu9lZxPZrtl1nM_u9NOcJgdTjnka_hdfCbUV2R0rPasXzr6oBascpR6gvsLrRekznYOUk-Q5U3HQQtTaP7Z1WM" />
                                </div>
                                <div class="relative z-20 text-center px-4 max-w-4xl">
                                    <div class="inline-block mb-6 px-4 py-1 border border-primary/30 bg-primary/5 backdrop-blur-md">
                                        <span class="font-label text-primary text-xs tracking-[0.3em] uppercase">System Status: Optimal</span>
                                    </div>
                                    <h2 class="font-display text-5xl md:text-8xl font-bold tracking-tighter glow-text mb-8 leading-none">
                                        THE FUTURE <br /> OF GAMING
                                    </h2>
                                    <div class="flex flex-col md:flex-row gap-4 justify-center items-center">
                                        <button class="group relative bg-primary text-on-primary px-10 py-4 font-label font-bold uppercase tracking-widest transition-all hover:bg-primary-fixed-dim active:scale-95">
                                            ENTER THE NEURAL LINK
                                            <span class="absolute -right-2 -top-2 w-4 h-4 border-t-2 border-r-2 border-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></span>
                                            <span class="absolute -left-2 -bottom-2 w-4 h-4 border-b-2 border-left-2 border-primary group-hover:-translate-x-1 group-hover:translate-y-1 transition-transform"></span>
                                        </button>
                                        <button class="px-10 py-4 border border-white/20 font-label font-bold uppercase tracking-widest hover:bg-white/5 transition-all text-sm">
                                            View Database
                                        </button>
                                    </div>
                                </div>
                                <div class="absolute bottom-10 left-10 hidden xl:block">
                                    <div class="flex flex-col gap-2 font-label text-[10px] text-primary/40 uppercase tracking-widest">
                                        <span>X: 144.22</span>
                                        <span>Y: 009.41</span>
                                        <span>Z: NEG_01</span>
                                    </div>
                                </div>
                            </section>
                            {/* <!--  Stats Section (Bento Grid) --> */}
                            <section class="py-24 px-6 max-w-7xl mx-auto">
                                <div class="mb-12">
                                    <h3 class="font-display text-2xl uppercase tracking-widest text-primary mb-2">LIVE_TELEMETRY</h3>
                                    <div class="h-1 w-24 bg-primary"></div>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* <!--  Stat Card 1 --> */}
                                    <div class="glass-panel p-8 relative overflow-hidden group">
                                        <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <span class="material-symbols-outlined text-6xl" data-icon="groups">groups</span>
                                        </div>
                                        <p class="font-label text-xs text-slate-500 uppercase tracking-widest mb-1">Active_Operators</p>
                                        <h4 class="font-display text-4xl text-primary mb-6">128,492</h4>
                                        <div class="flex items-end gap-1 h-12">
                                            <div class="w-full h-4 bg-primary/20"></div>
                                            <div class="w-full h-8 bg-primary/40"></div>
                                            <div class="w-full h-6 bg-primary/20"></div>
                                            <div class="w-full h-10 bg-primary/60 shadow-[0_0_10px_rgba(143,245,255,0.5)]"></div>
                                            <div class="w-full h-12 bg-primary"></div>
                                        </div>
                                        <p class="mt-4 text-xs font-label text-primary/60">+12% vs last cycle</p>
                                    </div>
                                    {/* <!--  Stat Card 2 --> */}
                                    <div class="glass-panel p-8 relative overflow-hidden group border-secondary/20">
                                        <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <span class="material-symbols-outlined text-6xl text-secondary" data-icon="payments">payments</span>
                                        </div>
                                        <p class="font-label text-xs text-slate-500 uppercase tracking-widest mb-1">Global_Prize_Pool</p>
                                        <h4 class="font-display text-4xl text-secondary mb-6">4,200 ETH</h4>
                                        <div class="grid grid-cols-6 gap-2">
                                            <div class="h-1 bg-secondary shadow-[0_0_8px_rgba(214,116,255,0.5)]"></div>
                                            <div class="h-1 bg-secondary shadow-[0_0_8px_rgba(214,116,255,0.5)]"></div>
                                            <div class="h-1 bg-secondary/20"></div>
                                            <div class="h-1 bg-secondary shadow-[0_0_8px_rgba(214,116,255,0.5)]"></div>
                                            <div class="h-1 bg-secondary shadow-[0_0_8px_rgba(214,116,255,0.5)]"></div>
                                            <div class="h-1 bg-secondary/20"></div>
                                        </div>
                                        <p class="mt-4 text-xs font-label text-secondary/60">Distributed across 48 tiers</p>
                                    </div>
                                    {/* <!--  Stat Card 3 --> */}
                                    <div class="glass-panel p-8 relative overflow-hidden group border-tertiary/20">
                                        <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <span class="material-symbols-outlined text-6xl text-tertiary" data-icon="swords">swords</span>
                                        </div>
                                        <p class="font-label text-xs text-slate-500 uppercase tracking-widest mb-1">Live_Tournaments</p>
                                        <h4 class="font-display text-4xl text-tertiary mb-6">14 LIVE</h4>
                                        <div class="space-y-2">
                                            <div class="flex justify-between text-[10px] font-label">
                                                <span class="text-slate-400">NEURAL BREACH</span>
                                                <span class="text-tertiary">FINAL STAGE</span>
                                            </div>
                                            <div class="w-full bg-white/5 h-1">
                                                <div class="bg-tertiary h-full w-3/4 shadow-[0_0_8px_rgba(255,110,129,0.5)]"></div>
                                            </div>
                                        </div>
                                        <p class="mt-4 text-xs font-label text-tertiary/60">842 viewers current</p>
                                    </div>
                                </div>
                            </section>
                            {/* <!--  Featured Games Carousel --> */}
                            <section class="py-24 bg-surface-container-low/50">
                                <div class="max-w-7xl mx-auto px-6">
                                    <div class="flex justify-between items-end mb-12">
                                        <div>
                                            <h3 class="font-display text-2xl uppercase tracking-widest text-primary mb-2">FEATURED_SECTORS</h3>
                                            <p class="font-label text-sm text-slate-500 uppercase tracking-tighter">Browse current simulation protocols</p>
                                        </div>
                                        <div class="flex gap-4">
                                            <button class="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all">
                                                <span class="material-symbols-outlined" data-icon="chevron_left">chevron_left</span>
                                            </button>
                                            <button class="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all">
                                                <span class="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {/* <!--  Game Card 1 --> */}
                                        <div class="group relative glass-panel aspect-3/4 overflow-hidden cursor-pointer">
                                            <img class="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110" data-alt="futuristic armored cyber soldier in a rainy neon city environment with glowing visor and complex gear" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDStQJ61nhr4VENvgw7exZaT6lfUgUp2nZIVrNlFG5XrARigKWUo4j0jKK2A912tYlOuy-HZE_Ac0Dh5GUPez2Ao9Xmp0x5aKNSf9kyDC8R_SrflrqeyqmG82rE5UtPMSmo5AIngUjkl0_Spipiy8VCXx6KgvSdn-OK4TymdV_5Vzefr5IBaVNEJnEUDg01gQBM4aEC-9E5qEBjfMfSK339GofhQJ1QnzMCPvATJLGQa4Hj-FVMXbj252UAtQQKwR3cbjrnhnSDw00" />
                                            <div class="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent"></div>
                                            <div class="absolute inset-0 scanlines opacity-0 group-hover:opacity-30 transition-opacity"></div>
                                            <div class="absolute bottom-0 left-0 p-6 w-full">
                                                <span class="font-label text-[10px] text-primary bg-primary/10 px-2 py-0.5 mb-2 inline-block">FPS / TACTICAL</span>
                                                <h5 class="font-display text-xl uppercase mb-1">VOID_WALKER</h5>
                                                <p class="text-xs text-slate-400 font-body opacity-0 group-hover:opacity-100 transition-opacity duration-300">Infiltrate the deep-net infrastructure before neural collapse.</p>
                                            </div>
                                            <div class="absolute top-0 right-0 p-4">
                                                <span class="material-symbols-outlined text-primary drop-shadow-[0_0_5px_rgba(143,245,255,0.8)]" data-icon="bolt">bolt</span>
                                            </div>
                                        </div>
                                        {/* <!--  Game Card 2 --> */}
                                        <div class="group relative glass-panel aspect-3/4 overflow-hidden cursor-pointer">
                                            <img class="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110" data-alt="abstract digital 3D landscape with glowing geometric shapes, data streams, and electric blue light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPgVhMM2GxFkAmJHYUOUkX3-Jww2QPObzKAcfLXLOOaer8_zhqyqeKqKyEz7gpgq-yBOZAVmjcswXs9X0gWcvsbLg7rMx2SDbYxQGLV3ceg-s9sMp3p5wldzAfTz8aqa7yHU_AKVYQQSu7gepk9D5pwdEJLR9WPh-dUA5OFPdvTem2mGsE7-YHhBNsWHEIdV3v88tqHGPqQa97AFhg8DmumQUKw0lAyFrClYN-P1q1FtcrtjLNfMd_7BZEVM-dcW9QUEQJ0BSuCNs" />
                                            <div class="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent"></div>
                                            <div class="absolute inset-0 scanlines opacity-0 group-hover:opacity-30 transition-opacity"></div>
                                            <div class="absolute bottom-0 left-0 p-6 w-full">
                                                <span class="font-label text-[10px] text-secondary bg-secondary/10 px-2 py-0.5 mb-2 inline-block">STRATEGY / NODE</span>
                                                <h5 class="font-display text-xl uppercase mb-1">PROTO_GRID</h5>
                                                <p class="text-xs text-slate-400 font-body opacity-0 group-hover:opacity-100 transition-opacity duration-300">Command neural swarms in high-fidelity grid combat.</p>
                                            </div>
                                        </div>
                                        {/* <!--  Game Card 3 --> */}
                                        <div class="group relative glass-panel aspect-3/4 overflow-hidden cursor-pointer">
                                            <img class="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110" data-alt="cockpit view of a sleek futuristic starship jumping through a neon hyper-tunnel with streaking lights" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXH5uz5o-QsN6rWy6rTCggyaEDF0Gy9k1yyHPHKJcy5ShOooeSuQWupP1l59HxEqT5G6utC18v9buloTQ6QnM5eh7yZrRwbgP5c-jT8TSq94nM1gy7Ffcg2-sVzaYGrKiFPJlIOsDiIvqyhpLSJjWdfdRL1z7A2s1CeyWkSa6jyrDzCfJ8Mpj-Pp-Pp0DsAjEXr4jT32gg-RQ944cgRolPy7Lz3c3tOV8H3VRPp-nQRkFcdBQ6GbrMVBdaEgXdTxdEiKY_AiK6hb0" />
                                            <div class="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent"></div>
                                            <div class="absolute inset-0 scanlines opacity-0 group-hover:opacity-30 transition-opacity"></div>
                                            <div class="absolute bottom-0 left-0 p-6 w-full">
                                                <span class="font-label text-[10px] text-tertiary bg-tertiary/10 px-2 py-0.5 mb-2 inline-block">RACING / HIGH_STAKES</span>
                                                <h5 class="font-display text-xl uppercase mb-1">SYNTH_DRIVE</h5>
                                                <p class="text-xs text-slate-400 font-body opacity-0 group-hover:opacity-100 transition-opacity duration-300">Break the sound barrier in a fully destructible digital city.</p>
                                            </div>
                                        </div>
                                        {/* <!--  Game Card 4 --> */}
                                        <div class="group relative glass-panel aspect-3/4 overflow-hidden cursor-pointer">
                                            <img class="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110" data-alt="futuristic terminal screen displaying complex code, holographic UI elements, and a stylized skull icon" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyVwRF0LagCClPUdverAihKGXpwOnbXtkuaKfxx4aQ6e0PLPMl4Zz6wZsIh6e6VUHQN71awyBZjxBnWE8PK0eT9Xmmm9tSF8ym28_zppMeTmUeTzZeJE_DKjVleq_DFx2jcZBlntXcUuiJJXSmYb3G53t1tUDK6n6yYBRSg9PKj2eKPtuihpV2orHlA02N1kBp-3jxdQtgNB7cq7S5F3UBBEI1Cp6AJyhqB2ifsN0C5H-tjk2_AB4RiIl_9LUx-kQUOpZZatM2udw" />
                                            <div class="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent"></div>
                                            <div class="absolute inset-0 scanlines opacity-0 group-hover:opacity-30 transition-opacity"></div>
                                            <div class="absolute bottom-0 left-0 p-6 w-full">
                                                <span class="font-label text-[10px] text-white bg-white/10 px-2 py-0.5 mb-2 inline-block">RPG / CYBERWARE</span>
                                                <h5 class="font-display text-xl uppercase mb-1">DEEP_LINK</h5>
                                                <p class="text-xs text-slate-400 font-body opacity-0 group-hover:opacity-100 transition-opacity duration-300">Upgrade your digital avatar with black-market neural mods.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            {/* <!--  CTA Section --> */}
                            <section class="py-32 px-6 relative overflow-hidden">
                                <div class="absolute inset-0 bg-primary/5 opacity-30"></div>
                                <div class="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 blur-[120px] rounded-full"></div>
                                <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full"></div>
                                <div class="max-w-4xl mx-auto text-center relative z-10 corner-bracket p-16 bg-surface/40 backdrop-blur-sm">
                                    <h2 class="font-display text-4xl md:text-6xl font-bold uppercase mb-6 tracking-tight">INITIALIZE <br /> YOUR_LEGACY</h2>
                                    <p class="text-slate-400 max-w-xl mx-auto mb-10 font-body text-lg leading-relaxed">
                                        Join the elite operators already carving their path through the neural grid. Secure your unique identification and claim your starting credits.
                                    </p>
                                    <div class="flex flex-col md:flex-row gap-4 justify-center items-center">
                                        <div class="relative w-full md:w-80">
                                            <input class="w-full bg-surface-container-lowest border-0 border-b border-outline-variant py-4 px-4 font-label text-sm uppercase tracking-widest focus:ring-0 focus:border-primary transition-all" placeholder="ENTER_EMAIL_FOR_UPLINK" type="email" />
                                            <div class="absolute bottom-0 left-0 h-0.5 bg-primary w-0 group-focus-within:w-full transition-all"></div>
                                        </div>
                                        <button class="w-full md:w-auto bg-primary text-on-primary px-12 py-4 font-label font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all">
                                            CREATE_ACCOUNT
                                        </button>
                                    </div>
                                    <div class="mt-8 flex justify-center gap-8">
                                        <div class="flex items-center gap-2 opacity-40 grayscale">
                                            <span class="material-symbols-outlined text-sm" data-icon="verified_user">verified_user</span>
                                            <span class="text-[10px] font-label uppercase tracking-widest">Encrypted</span>
                                        </div>
                                        <div class="flex items-center gap-2 opacity-40 grayscale">
                                            <span class="material-symbols-outlined text-sm" data-icon="vpn_key">vpn_key</span>
                                            <span class="text-[10px] font-label uppercase tracking-widest">Secured</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </main>
                        {/* <!--  NavigationDrawer (Mobile Only simulated) --> */}
                        <aside class="hidden fixed left-0 top-0 h-full w-64 border-r border-cyan-500/10 bg-black/80 backdrop-blur-2xl flex-col py-8 z-40 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
                            <div class="px-6 mb-10 flex items-center gap-4">
                                <div class="w-12 h-12 bg-primary/20 border border-primary/40 flex items-center justify-center">
                                    <span class="material-symbols-outlined text-primary" data-icon="person">person</span>
                                </div>
                                <div>
                                    <h6 class="font-headline font-bold text-cyan-400 text-sm">OPERATOR_01</h6>
                                    <div class="flex items-center gap-2">
                                        <span class="text-[10px] font-label text-slate-500">LVL 99</span>
                                        <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                        <span class="text-[10px] font-label text-green-500">ONLINE</span>
                                    </div>
                                </div>
                            </div>
                            <nav class="flex flex-col gap-1">
                                <a class="flex items-center gap-4 px-6 py-4 bg-cyan-500/20 text-cyan-400 border-l-4 border-cyan-400 font-['Space_Grotesk'] font-medium tracking-widest text-xs" href="#">
                                    <span class="material-symbols-outlined" data-icon="dashboard">dashboard</span>
                                    Mission_Control
                                </a>
                                <a class="flex items-center gap-4 px-6 py-4 text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors font-['Space_Grotesk'] font-medium tracking-widest text-xs" href="#">
                                    <span class="material-symbols-outlined" data-icon="sports_esports">sports_esports</span>
                                    Arsenal
                                </a>
                                <a class="flex items-center gap-4 px-6 py-4 text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors font-['Space_Grotesk'] font-medium tracking-widest text-xs" href="#">
                                    <span class="material-symbols-outlined" data-icon="psychology">psychology</span>
                                    Neural_Link
                                </a>
                                <a class="flex items-center gap-4 px-6 py-4 text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors font-['Space_Grotesk'] font-medium tracking-widest text-xs" href="#">
                                    <span class="material-symbols-outlined" data-icon="shopping_cart">shopping_cart</span>
                                    Market
                                </a>
                                <a class="flex items-center gap-4 px-6 py-4 mt-auto text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors font-['Space_Grotesk'] font-medium tracking-widest text-xs" href="#">
                                    <span class="material-symbols-outlined" data-icon="settings">settings</span>
                                    Settings
                                </a>
                            </nav>
                        </aside>
                        {/* <!--  BottomNavBar (Mobile Visible) --> */}
                        <nav class="md:hidden fixed bottom-0 left-0 w-full z-50 flex items-center justify-between px-8 h-16 bg-black/90 border-t border-white/5">
                            <a class="text-cyan-400 flex flex-col items-center gap-1" href="#">
                                <span class="material-symbols-outlined" data-icon="speed">speed</span>
                                <span class="font-['Space_Grotesk'] text-[10px] uppercase font-bold">DASH</span>
                            </a>
                            <a class="text-slate-600 hover:text-cyan-300 flex flex-col items-center gap-1" href="#">
                                <span class="material-symbols-outlined" data-icon="signal_cellular_alt">signal_cellular_alt</span>
                                <span class="font-['Space_Grotesk'] text-[10px] uppercase font-bold">LIVE</span>
                            </a>
                            <a class="text-slate-600 hover:text-cyan-300 flex flex-col items-center gap-1" href="#">
                                <span class="material-symbols-outlined" data-icon="memory">memory</span>
                                <span class="font-['Space_Grotesk'] text-[10px] uppercase font-bold">CORE</span>
                            </a>
                            <a class="text-slate-600 hover:text-cyan-300 flex flex-col items-center gap-1" href="#">
                                <span class="material-symbols-outlined" data-icon="query_stats">query_stats</span>
                                <span class="font-['Space_Grotesk'] text-[10px] uppercase font-bold">DATA</span>
                            </a>
                        </nav>
                        <footer class="py-12 border-t border-white/5 px-6">
                            <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                                <div class="flex items-center gap-4">
                                    <h1 class="text-lg font-bold text-cyan-400 font-['Space_Grotesk'] uppercase tracking-widest">CYBERHUD</h1>
                                    <span class="text-[10px] text-slate-500 font-label uppercase tracking-widest">© 2077 NEURAL SYSTEMS</span>
                                </div>
                                <div class="flex gap-8 text-[10px] font-label uppercase tracking-widest text-slate-400">
                                    <a class="hover:text-primary transition-colors" href="#">Terminals_of_Service</a>
                                    <a class="hover:text-primary transition-colors" href="#">Privacy_Protocol</a>
                                    <a class="hover:text-primary transition-colors" href="#">Security_Log</a>
                                </div>
                                <div class="flex gap-4">
                                    <button class="w-8 h-8 flex items-center justify-center border border-white/10 text-slate-400 hover:border-primary hover:text-primary transition-all">
                                        <span class="material-symbols-outlined text-sm" data-icon="terminal">terminal</span>
                                    </button>
                                    <button class="w-8 h-8 flex items-center justify-center border border-white/10 text-slate-400 hover:border-primary hover:text-primary transition-all">
                                        <span class="material-symbols-outlined text-sm" data-icon="code">code</span>
                                    </button>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </>
    )
}
