"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Users, Clock, Zap, Activity, ShieldAlert, Cpu, Share2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

const LOG_ENTRIES = [
    "Analyzing SSH context sync...",
    "Temporal check: Friday 15:12 detected",
    "Human signal: Primary engineer fatigue high",
    "Blast radius: 42% infrastructure nodes",
    "Decision: Force MFA confirmation",
    "Scanning policy: Prod-Access-V4",
    "Blast radius check: Database instance Alpha",
    "Cognitive load exceeds standard threshold (0.82)",
    "Logic: Injecting safety handshake...",
    "Validation: Command 'rm -rf' detected in root",
    "Verdict: Risk score 8.4 [BLOCK]",
];

export function RiskDashboard() {
    const [log, setLog] = useState<string[]>([]);
    const [stats, setStats] = useState({ fatigue: 45, load: 32, radius: 12 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setLog(prev => [LOG_ENTRIES[Math.floor(Math.random() * LOG_ENTRIES.length)], ...prev].slice(0, 6));
            setStats({
                fatigue: 60 + Math.random() * 30,
                load: 70 + Math.random() * 20,
                radius: 40 + Math.random() * 50
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-24 px-6 bg-[#030308] relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Engine Intelligence</span>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">
                            The Anatomy of a <span className="gradient-text">Decision</span>.
                        </h2>
                        <p className="text-muted text-lg max-w-2xl mx-auto font-light leading-relaxed">
                            Assure doesn't just block; it reasons. Our risk engine synthesizes human, temporal, and system signals into a single, proactive verdict.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Left: Signal Convergence */}
                    <div className="lg:col-span-4 space-y-4">
                        <SignalCard
                            icon={<Users className="w-5 h-5" />}
                            title="Human Signal"
                            desc="Engineer experience & fatigue level"
                            color="text-blue-400"
                            active
                        />
                        <SignalCard
                            icon={<Clock className="w-5 h-5" />}
                            title="Temporal Signal"
                            desc="Risk-adjusted time window analysis"
                            color="text-amber-400"
                            active
                        />
                        <SignalCard
                            icon={<Activity className="w-5 h-5" />}
                            title="System Signal"
                            desc="Infrastructure health & past error rates"
                            color="text-emerald-400"
                            active
                        />
                    </div>

                    {/* Center: The Processor */}
                    <div className="lg:col-span-4 relative flex items-center justify-center p-8 rounded-[40px] border border-white/5 bg-white/[0.02] overflow-hidden min-h-[400px]">
                        <div className="absolute inset-0 bg-primary/5 blur-[80px]" />

                        <div className="relative z-10 flex flex-col items-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="w-48 h-48 rounded-full border border-dashed border-primary/40 flex items-center justify-center"
                            >
                                <div className="w-32 h-32 rounded-full border-2 border-primary/20 flex items-center justify-center">
                                    <Cpu className="w-12 h-12 text-primary animate-pulse" />
                                </div>
                            </motion.div>

                            {/* Verdict HUD */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="mt-8 text-center"
                            >
                                <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Live Verdict</div>
                                <div className="px-6 py-2 bg-rose-500/20 border border-rose-500/30 rounded-xl">
                                    <span className="text-2xl font-black text-rose-500 font-mono tracking-tighter">RISK SCORE: 8.4</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Connection Lines (Visual Decor) */}
                        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/5 -translate-x-1/2" />
                        <div className="absolute left-0 right-0 top-1/2 h-px bg-white/5 -translate-y-1/2" />
                    </div>

                    {/* Right: Modern HUD Gauges */}
                    <div className="lg:col-span-4 grid grid-cols-1 gap-4">
                        <div className="p-6 rounded-3xl border border-white/5 bg-secondary/50 flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Cognitive Load</h4>
                                    <p className="text-[10px] text-muted font-bold tracking-widest">REAL-TIME MONITOR</p>
                                </div>
                                <Zap className="w-5 h-5 text-amber-500" />
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${stats.load}%` }}
                                    className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                                />
                            </div>
                            <div className="flex justify-between mt-2 font-mono text-xs font-bold text-amber-500">
                                <span>CRITICAL THRESHOLD</span>
                                <span>{mounted ? stats.load.toFixed(1) : "--"}%</span>
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl border border-white/5 bg-secondary/50 flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Blast Radius</h4>
                                    <p className="text-[10px] text-muted font-bold tracking-widest">PREDICTIVE ANALYZER</p>
                                </div>
                                <Share2 className="w-5 h-5 text-indigo-500" />
                            </div>
                            <div className="flex items-end gap-1 h-12">
                                {[...Array(12)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={mounted ? { height: [`${20 + Math.random() * 80}%`, `${20 + Math.random() * 80}%`] } : { height: "50%" }}
                                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
                                        className="flex-1 bg-indigo-500/50 rounded-t-sm"
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between mt-2 font-mono text-xs font-bold text-indigo-500 uppercase tracking-tighter">
                                <span>Impact Vector</span>
                                <span>High Sensitivity</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom: Logic Stream */}
                    <div className="lg:col-span-12 p-8 rounded-[40px] border border-white/5 bg-black/40 backdrop-blur-md">
                        <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
                            <ShieldAlert className="w-5 h-5 text-primary" />
                            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Engine Logic Stream</h4>
                            <div className="ml-auto flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] text-emerald-500/80 font-black uppercase tracking-widest">Live</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
                            <AnimatePresence mode="popLayout">
                                {log.map((entry, i) => (
                                    <motion.div
                                        key={entry + i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className={`flex items-center gap-3 text-xs font-bold font-mono tracking-tight ${entry.includes("Verdict") || entry.includes("BLOCK") ? "text-rose-500" : "text-muted"
                                            }`}
                                    >
                                        <span className="opacity-30">[{mounted ? new Date().toLocaleTimeString([], { hour12: false }) : "--:--:--"}]</span>
                                        <span className="text-primary opacity-50">&gt;&gt;</span>
                                        {entry}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function SignalCard({ icon, title, desc, color, active }: any) {
    return (
        <div className={`p-6 rounded-[32px] border border-white/5 bg-white/[0.03] transition-all hover:border-primary/20 group`}>
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl bg-white/5 ${color} group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-0.5">{title}</h3>
                    <p className="text-[11px] text-muted font-medium">{desc}</p>
                </div>
            </div>
        </div>
    );
}
