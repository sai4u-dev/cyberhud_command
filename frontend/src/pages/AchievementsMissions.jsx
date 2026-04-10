import React from 'react'

export default function AchievementsMissions() {
    return (
        <>
            <div className="bg-surface text-on-surface font-body selection:bg-primary/30 min-h-screen">
                {/* <!-- Scanline Overlay --> */}
                <div className="fixed inset-0 pointer-events-none scanline opacity-20 z-10"></div>
                {/* <!-- TopAppBar --> */}
                <header className="fixed top-0 w-full border-b border-cyan-500/10 bg-black/60 backdrop-blur-xl flex justify-between items-center px-6 h-16 z-50">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-cyan-400" data-icon="terminal">terminal</span>
                        <h1 className="text-xl font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)] font-headline uppercase tracking-[0.1em]">CYBERHUD_COMMAND</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <nav className="hidden md:flex gap-8 font-headline text-sm uppercase tracking-widest">
                            <a className="text-slate-500 hover:bg-cyan-500/10 hover:text-cyan-200 transition-all duration-200 py-2" href="#">Arsenal</a>
                            <a className="text-cyan-400 border-b-2 border-cyan-400 py-2" href="#">Mission_Control</a>
                            <a className="text-slate-500 hover:bg-cyan-500/10 hover:text-cyan-200 transition-all duration-200 py-2" href="#">Market</a>
                        </nav>
                        <div className="bg-surface-container px-4 py-1.5 border border-primary/20 text-cyan-400 font-headline text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-xs" data-icon="account_balance_wallet">account_balance_wallet</span>
                            0.0042 ETH
                        </div>
                    </div>
                </header>
                {/* <!-- NavigationDrawer (Sidebar) --> */}
                <aside className="fixed left-0 top-0 h-full w-64 border-r border-cyan-500/10 bg-black/80 backdrop-blur-2xl hidden md:flex flex-col py-8 z-40 mt-16">
                    <div className="px-6 mb-10 flex items-center gap-4">
                        <div className="w-12 h-12 border border-primary/40 p-1">
                            <img className="w-full h-full object-cover grayscale brightness-125" data-alt="cyberpunk neon portrait of a mysterious operator with glowing digital mask and dark tech-wear" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAksZp9eMez0e1VEUISHG3I-LAUSp6FUEb2Nw6cNsJb44ZzQ9F4Ap6MeAu_xmvfp29ySWDzcvawWtg0Tf73OZfBGm7DlP1hsfwc1Uh2gfmc3f5Aq67HL6hO3CI6-c6iXdAcziybdqgfrDmcZtBlX6ZqnQrh4Mr0fZwKD1bYA0ahUEpA40gNhnygHih5W57tCWuQOBg96I91gTe60KNPblw3yi3_7Z-1pyMBYtdbMksK_ARHeOEtX5B3mYTKyAiLvp6LPuLsxaj5lVU" />
                        </div>
                        <div>
                            <p className="font-headline text-primary text-sm font-bold">OPERATOR_01</p>
                            <p className="text-[10px] text-slate-500 font-headline tracking-tighter">LVL 99 <span className="text-primary ml-2">ONLINE</span></p>
                        </div>
                    </div>
                    <nav className="flex flex-col gap-1">
                        <a className="flex items-center gap-4 px-6 py-4 text-slate-500 hover:bg-white/5 transition-colors font-headline font-medium tracking-widest text-xs" href="#">
                            <span className="material-symbols-outlined text-xl" data-icon="sports_esports">sports_esports</span> Arsenal
                        </a>
                        <a className="flex items-center gap-4 px-6 py-4 bg-cyan-500/20 text-cyan-400 border-l-4 border-cyan-400 font-headline font-medium tracking-widest text-xs" href="#">
                            <span className="material-symbols-outlined text-xl" data-icon="dashboard">dashboard</span> Mission_Control
                        </a>
                        <a className="flex items-center gap-4 px-6 py-4 text-slate-500 hover:bg-white/5 transition-colors font-headline font-medium tracking-widest text-xs" href="#">
                            <span className="material-symbols-outlined text-xl" data-icon="psychology">psychology</span> Neural_Link
                        </a>
                        <a className="flex items-center gap-4 px-6 py-4 text-slate-500 hover:bg-white/5 transition-colors font-headline font-medium tracking-widest text-xs" href="#">
                            <span className="material-symbols-outlined text-xl" data-icon="shopping_cart">shopping_cart</span> Market
                        </a>
                        <a className="flex items-center gap-4 px-6 py-4 text-slate-500 hover:bg-white/5 transition-colors font-headline font-medium tracking-widest text-xs mt-auto" href="#">
                            <span className="material-symbols-outlined text-xl" data-icon="settings">settings</span> Settings
                        </a>
                    </nav>
                </aside>
                {/* <!-- Main Canvas --> */}
                <main className="md:ml-64 pt-24 pb-20 px-6 max-w-7xl mx-auto">
                    {/* <!-- Header / Progress Overview --> */}
                    <section className="relative mb-12">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* <!-- Progress Card --> */}
                            <div className="lg:col-span-2 glass-panel p-8 border-l-4 border-primary relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <span className="material-symbols-outlined text-8xl" data-icon="analytics">analytics</span>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                                    <div className="space-y-2">
                                        <span className="text-primary font-headline text-xs tracking-[0.3em] uppercase">System Integration</span>
                                        <h2 className="text-5xl font-headline font-extrabold text-white">87<span className="text-primary-dim">.4%</span></h2>
                                    </div>
                                    <div className="flex-1 max-w-md w-full">
                                        <div className="flex justify-between text-[10px] font-headline uppercase mb-2 tracking-widest">
                                            <span className="text-slate-400">Completion Path</span>
                                            <span className="text-primary">Tier 5 Protocol</span>
                                        </div>
                                        <div className="h-3 bg-surface-container-highest border border-white/5 relative">
                                            <div className="absolute top-0 left-0 h-full energy-gradient shadow-[0_0_15px_rgba(143,245,255,0.4)] w-7/8"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/5 pt-6">
                                    <div>
                                        <p className="text-slate-500 text-[10px] font-headline uppercase">Missions Cleared</p>
                                        <p className="text-white font-headline text-lg">1,248</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-[10px] font-headline uppercase">Neural Points</p>
                                        <p className="text-secondary font-headline text-lg">42.5k</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-[10px] font-headline uppercase">World Rank</p>
                                        <p className="text-tertiary font-headline text-lg">#012</p>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- Reward Highlight --> */}
                            <div className="glass-panel p-8 border border-white/5 flex flex-col justify-between relative group">
                                <div className="corner-bracket top-0 left-0 border-t border-l"></div>
                                <div className="corner-bracket top-0 right-0 border-t border-r"></div>
                                <div className="corner-bracket bottom-0 left-0 border-b border-l"></div>
                                <div className="corner-bracket bottom-0 right-0 border-b border-r"></div>
                                <div>
                                    <span className="text-secondary font-headline text-xs tracking-[0.3em] uppercase">Active Reward</span>
                                    <h3 className="text-xl font-headline font-bold text-white mt-2">CYBER_BLADE UNLOCK</h3>
                                    <p className="text-slate-400 text-sm mt-2 font-body leading-relaxed">Complete 3 more Daily Missions to claim the legendary Tier 4 asset.</p>
                                </div>
                                <div className="mt-6">
                                    <div className="w-full aspect-video bg-black/40 border border-secondary/20 flex items-center justify-center relative overflow-hidden">
                                        <img className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen group-hover:scale-110 transition-transform duration-700" data-alt="abstract close-up of futuristic geometric metal surface with neon purple glowing circuits and atmospheric mist" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIkA-mrTIJgBQlCChB8A084kI3b4MKJV0hg39wDVmbhAOM-CIRIhkPfAz6VBUXoUpVBtEBF3k0NK2VUbgv_Cz-eUGs8V0tf3wbkot4VgEcWgpYeVEMwIXgf9xwy638n1uXoYU4li4aLJqwdgs_xckT3CZMAg3WocISRQcoZ8m-jwFcsOLntT1jiD2M72_j0nQVHmoKWfbFSiO_ELbLFJb7lz6meVl4zjRiQhvWRYF_gKelecTHMWcqK_lZ668G5QUeKTziOnqj-Ws" />
                                        <span className="material-symbols-outlined text-secondary text-5xl relative z-10" data-icon="swords">swords</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* <!-- Missions & Achievements Grid --> */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                        {/* <!-- Daily Missions (Left Column) --> */}
                        <section className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-headline text-lg font-bold flex items-center gap-3">
                                    <span className="w-2 h-6 bg-primary"></span>
                                    DAILY_OPERATIONS
                                </h3>
                                <div className="flex items-center gap-2 text-slate-500 font-headline text-[10px] tracking-tighter">
                                    <span className="material-symbols-outlined text-sm" data-icon="schedule">schedule</span>
                                    RESET IN: <span className="text-primary font-bold">04:22:18</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {/* <!-- Mission Item: Claimable --> */}
                                <div className="bg-surface-container-low border-l-2 border-primary p-4 flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-primary/10 flex items-center justify-center border border-primary/30">
                                            <span className="material-symbols-outlined text-primary" data-icon="bolt">bolt</span>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-headline font-bold text-white">RECHARGE_CELLS</h4>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Connect to 5 Neural Nodes</p>
                                        </div>
                                    </div>
                                    <button className="bg-primary text-on-primary px-4 py-1 text-[10px] font-headline font-bold tracking-widest hover:brightness-110 active:scale-95 transition-all">CLAIM</button>
                                </div>
                                {/* <!-- Mission Item: Progressing --> */}
                                <div className="bg-surface-container-low border-l-2 border-slate-700 p-4 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-800 flex items-center justify-center border border-white/5">
                                                <span className="material-symbols-outlined text-slate-500" data-icon="search">search</span>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-headline font-bold text-white">DATAVAN_SWEEP</h4>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Infiltrate 3 Sub-levels</p>
                                            </div>
                                        </div>
                                        <span className="text-primary font-headline text-[10px] font-bold">1 / 3</span>
                                    </div>
                                    <div className="h-1 bg-surface-container-highest">
                                        <div className="h-full bg-primary w-2/6"></div>
                                    </div>
                                </div>
                                {/* <!-- Mission Item: Progressing 2 --> */}
                                <div className="bg-surface-container-low border-l-2 border-slate-700 p-4 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-800 flex items-center justify-center border border-white/5">
                                                <span className="material-symbols-outlined text-slate-500" data-icon="terminal">terminal</span>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-headline font-bold text-white">OVERRIDE_GATE</h4>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Perform 10 Success Hacks</p>
                                            </div>
                                        </div>
                                        <span className="text-primary font-headline text-[10px] font-bold">8 / 10</span>
                                    </div>
                                    <div className="h-1 bg-surface-container-highest">
                                        <div className="h-full bg-primary w-4/5"></div>
                                    </div>
                                </div>
                                {/* <!-- Mission Item: Locked --> */}
                                <div className="bg-surface-container/30 border-l-2 border-transparent p-4 flex items-center gap-4 opacity-40">
                                    <div className="w-10 h-10 bg-slate-900 flex items-center justify-center border border-white/5">
                                        <span className="material-symbols-outlined text-slate-600" data-icon="lock">lock</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-headline font-bold text-slate-400">VOID_RUNNER</h4>
                                        <p className="text-[10px] text-slate-600 uppercase tracking-widest">Clear Daily 1-3 to unlock</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* <!-- Milestone Achievements (Right Column) --> */}
                        <section className="lg:col-span-3 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-headline text-lg font-bold flex items-center gap-3">
                                    <span className="w-2 h-6 bg-secondary"></span>
                                    LEGACY_ARCHIVE
                                </h3>
                                <div className="flex gap-2">
                                    <span className="text-[10px] font-headline bg-surface-container-highest px-3 py-1 border border-white/10 text-slate-400">ALL</span>
                                    <span className="text-[10px] font-headline bg-secondary/10 px-3 py-1 border border-secondary/30 text-secondary">UNLOCKED</span>
                                </div>
                            </div>
                            {/* <!-- Bento Grid of Achievements --> */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* <!-- Achievement Card: Unlocked/Legendary --> */}
                                <div className="glass-panel p-6 border border-secondary/20 relative group overflow-hidden">
                                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-secondary/10 rotate-45 flex items-center justify-center border border-secondary/20">
                                        <span className="material-symbols-outlined text-secondary text-xs -rotate-45" data-icon="grade" data-weight="fill">grade</span>
                                    </div>
                                    <div className="w-12 h-12 mb-4 bg-secondary/20 flex items-center justify-center border border-secondary/40 shadow-[0_0_20px_rgba(214,116,255,0.2)]">
                                        <span className="material-symbols-outlined text-secondary" data-icon="military_tech">military_tech</span>
                                    </div>
                                    <h4 className="text-sm font-headline font-bold text-white group-hover:text-secondary transition-colors">GHOST_IN_SHELL</h4>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Complete a sub-level without being detected</p>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="text-[8px] font-headline bg-secondary/20 text-secondary px-2 py-0.5 tracking-tighter">LEGENDARY</span>
                                        <span className="text-[8px] font-headline text-slate-500">0.2% OF PLAYERS</span>
                                    </div>
                                </div>
                                {/* <!-- Achievement Card: Unlocked/Common --> */}
                                <div className="glass-panel p-6 border border-white/5 relative group">
                                    <div className="w-12 h-12 mb-4 bg-slate-800 flex items-center justify-center border border-white/10">
                                        <span className="material-symbols-outlined text-slate-400" data-icon="verified_user">verified_user</span>
                                    </div>
                                    <h4 className="text-sm font-headline font-bold text-white">FIRST_BOOT</h4>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Initialize your neural link for the first time</p>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="text-[8px] font-headline bg-slate-800 text-slate-400 px-2 py-0.5 tracking-tighter">COMMON</span>
                                        <span className="text-[8px] font-headline text-slate-500">98% OF PLAYERS</span>
                                    </div>
                                </div>
                                {/* <!-- Achievement Card: Locked --> */}
                                <div className="glass-panel p-6 border border-white/5 opacity-50 grayscale relative group">
                                    <div className="absolute inset-0 flex items-center justify-center z-20">
                                        <span className="material-symbols-outlined text-slate-400/20 text-6xl" data-icon="lock">lock</span>
                                    </div>
                                    <div className="w-12 h-12 mb-4 bg-slate-900 flex items-center justify-center border border-white/5">
                                        <span className="material-symbols-outlined text-slate-600" data-icon="psychology">psychology</span>
                                    </div>
                                    <h4 className="text-sm font-headline font-bold text-slate-400">NEURAL_DEITY</h4>
                                    <p className="text-[10px] text-slate-600 uppercase tracking-widest mt-1">Reach Level 100 on the Master Path</p>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="text-[8px] font-headline bg-tertiary/10 text-tertiary px-2 py-0.5 tracking-tighter">MYTHIC</span>
                                        <span className="text-[8px] font-headline text-slate-600">LOCKED</span>
                                    </div>
                                </div>
                                {/* <!-- Achievement Card: Locked 2 --> */}
                                <div className="glass-panel p-6 border border-white/5 opacity-50 grayscale relative group">
                                    <div className="absolute inset-0 flex items-center justify-center z-20">
                                        <span className="material-symbols-outlined text-slate-400/20 text-6xl" data-icon="lock">lock</span>
                                    </div>
                                    <div className="w-12 h-12 mb-4 bg-slate-900 flex items-center justify-center border border-white/5">
                                        <span className="material-symbols-outlined text-slate-600" data-icon="diamond">diamond</span>
                                    </div>
                                    <h4 className="text-sm font-headline font-bold text-slate-400">DATA_HOARDER</h4>
                                    <p className="text-[10px] text-slate-600 uppercase tracking-widest mt-1">Collect 1,000,000 neural shards</p>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="text-[8px] font-headline bg-primary/10 text-primary px-2 py-0.5 tracking-tighter">RARE</span>
                                        <span className="text-[8px] font-headline text-slate-600">LOCKED</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
                {/* <!-- BottomNavBar (Mobile only) --> */}
                <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex items-center justify-around px-4 bg-black/90 h-16 border-t border-white/5">
                    <a className="text-cyan-400 flex flex-col items-center gap-1" href="#">
                        <span className="material-symbols-outlined text-2xl" data-icon="speed">speed</span>
                        <span className="font-headline text-[8px] uppercase font-bold">STATUS</span>
                    </a>
                    <a className="text-slate-600 hover:text-cyan-300 flex flex-col items-center gap-1" href="#">
                        <span className="material-symbols-outlined text-2xl" data-icon="signal_cellular_alt">signal_cellular_alt</span>
                        <span className="font-headline text-[8px] uppercase font-bold">FEEDS</span>
                    </a>
                    <a className="text-slate-600 hover:text-cyan-300 flex flex-col items-center gap-1" href="#">
                        <span className="material-symbols-outlined text-2xl" data-icon="memory">memory</span>
                        <span className="font-headline text-[8px] uppercase font-bold">CHIPS</span>
                    </a>
                    <a className="text-slate-600 hover:text-cyan-300 flex flex-col items-center gap-1" href="#">
                        <span className="material-symbols-outlined text-2xl" data-icon="query_stats">query_stats</span>
                        <span className="font-headline text-[8px] uppercase font-bold">INTEL</span>
                    </a>
                </nav>
            </div>

        </>
    )
}
