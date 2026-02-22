"use client";

import { motion, AnimatePresence, useAnimationFrame } from "framer-motion";
import { Terminal, ShieldAlert, Server, Zap, Database, ShieldCheck, Cpu } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const PRODUCTION_NODES = [
    { id: 1, icon: <Server className="w-5 h-5" />, label: "West-01" },
    { id: 2, icon: <Database className="w-5 h-5" />, label: "Prod-DB" },
    { id: 3, icon: <Server className="w-5 h-5" />, label: "East-02" },
];

export function ShieldSimulation({ showSource = true }: { showSource?: boolean }) {
    const [pulses, setPulses] = useState<{ id: number; type: 'safe' | 'risk'; targetY: number }[]>([]);
    const [shockwaves, setShockwaves] = useState<{ id: number; x: number; y: number }[]>([]);
    const [stats, setStats] = useState({ blocked: 142, saved: 124800 });
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Constant flow of data
    useEffect(() => {
        const interval = setInterval(() => {
            const isRisk = Math.random() > 0.75;
            const newPulse = {
                id: Math.random() + Date.now(),
                type: (isRisk ? 'risk' : 'safe') as 'risk' | 'safe',
                targetY: Math.random() * 100 - 50 // Random vertical spread
            };
            setPulses(prev => [...prev.slice(-8), newPulse]);
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    const handleCollision = (isRisk: boolean) => {
        if (isRisk) {
            const id = Math.random() + Date.now();
            setShockwaves(prev => [...prev, { id, x: 50, y: 50 }]);
            setStats(prev => ({ blocked: prev.blocked + 1, saved: prev.saved + 2400 }));
            setTimeout(() => setShockwaves(prev => prev.filter(s => s.id !== id)), 1000);
        }
    };

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Neural Defense Grid v4.0</span>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
                            The <span className="gradient-text">Invisible</span> Sentry.
                        </h2>
                    </motion.div>
                </div>

                {/* 3D Perspective Container */}
                <div
                    className="relative h-[600px] w-full rounded-[60px] border border-white/5 bg-[#050510] overflow-hidden perspective-[1500px]"
                    style={{ perspective: '1200px' }}
                >
                    {/* Floating HUD Elements */}
                    <div className="absolute top-8 left-8 z-40 space-y-4">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
                            <div className="flex items-center gap-3 mb-2">
                                <Cpu className="w-4 h-4 text-primary animate-pulse" />
                                <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Risk Engine: Online</span>
                            </div>
                            <div className="text-2xl font-black text-white font-mono">{mounted ? stats.blocked : "---"}</div>
                            <div className="text-[8px] font-bold text-muted uppercase tracking-[0.2em]">Incidents Neutralized</div>
                        </div>
                    </div>

                    <div className="absolute top-8 right-8 z-40">
                        <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 p-4 rounded-2xl">
                            <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Downtime Saved</div>
                            <div className="text-2xl font-black text-emerald-400 font-mono">${mounted ? stats.saved.toLocaleString() : "---"}</div>
                        </div>
                    </div>

                    {/* 3D Scene Wrapper */}
                    <div className="relative w-full h-full preserve-3d rotate-x-[15deg] scale-90 md:scale-100">

                        {/* Floor Grid (Cyber-style) */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/10 to-transparent opacity-20 transform-origin-bottom rotate-x-[90deg] translate-z-[-100px]"
                            style={{ backgroundImage: 'linear-gradient(rgba(124,105,239,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(124,105,239,0.2) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
                        />

                        {/* Components Layout */}
                        <div className="absolute inset-0 flex items-center justify-between px-10 md:px-32">

                            {/* Source: Terminal Node - Only shown if enabled */}
                            {showSource ? (
                                <motion.div className="flex flex-col items-center translate-z-[50px]">
                                    <div className="w-24 h-24 rounded-[32px] bg-secondary border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.5)] relative group cursor-default">
                                        <div className="absolute inset-0 bg-primary/20 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Terminal className="w-10 h-10 text-white relative z-10" />
                                        <div className="absolute -bottom-8 text-[10px] font-bold text-muted uppercase tracking-[0.3em]">Traffic Source</div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="w-24 h-24" /> // Spacing placeholder
                            )}

                            {/* The Holographic Shield */}
                            <div className="relative translate-z-[120px]">
                                {/* Rotating Rings Container */}
                                <motion.div
                                    animate={{
                                        rotateY: [0, 360],
                                    }}
                                    transition={{
                                        duration: 10, repeat: Infinity, ease: "linear"
                                    }}
                                    className="w-48 h-48 rounded-full bg-primary/5 border border-primary/40 flex items-center justify-center relative preserve-3d"
                                >
                                    {/* Geometric Rings */}
                                    <div className="absolute inset-0 border border-primary/20 rounded-full rotate-x-[60deg] animate-[spin_8s_linear_infinite]" />
                                    <div className="absolute inset-0 border border-primary/20 rounded-full rotate-y-[60deg] animate-[spin_12s_linear_infinite_reverse]" />

                                    {/* Hologram Glow */}
                                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-[40px] opacity-40 animate-pulse" />
                                </motion.div>

                                {/* Central Fixed Icon (Upright) */}
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                >
                                    <div className="p-4 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 shadow-[0_0_30px_rgba(124,105,239,0.3)]">
                                        <ShieldCheck className="w-16 h-16 text-primary" />
                                    </div>
                                </motion.div>

                                {/* Shockwaves */}
                                <AnimatePresence>
                                    {shockwaves.map(s => (
                                        <motion.div
                                            key={s.id}
                                            initial={{ opacity: 1, scale: 0.5 }}
                                            animate={{ opacity: 0, scale: 2.5 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-4 border-rose-500/50"
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Destination nodes */}
                            <div className="space-y-8 translate-z-[50px]">
                                {PRODUCTION_NODES.map(node => (
                                    <div key={node.id} className="flex items-center gap-6 group">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">{node.label}</span>
                                            <span className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-widest">Secure</span>
                                        </div>
                                        <div className="w-16 h-16 rounded-2xl bg-secondary border border-white/5 flex items-center justify-center group-hover:border-primary/50 transition-all shadow-xl">
                                            {node.icon}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Flying Data Pulses */}
                        <AnimatePresence>
                            {pulses.map((pulse) => (
                                <motion.div
                                    key={pulse.id}
                                    initial={{
                                        left: "15%",
                                        top: "50%",
                                        x: 0,
                                        y: 0,
                                        z: 50,
                                        opacity: 0
                                    }}
                                    animate={pulse.type === 'risk'
                                        ? {
                                            left: ["15%", "50%"],
                                            opacity: [0, 1, 1, 0],
                                            scale: [0.5, 2, 0],
                                            z: [50, 120]
                                        }
                                        : {
                                            left: ["15%", "90%"],
                                            opacity: [0, 1, 1, 0],
                                            y: [0, pulse.targetY],
                                            z: [50, 50]
                                        }
                                    }
                                    transition={{
                                        duration: pulse.type === 'risk' ? 1.5 : 2.5,
                                        ease: "easeOut",
                                        times: [0, 0.2, 0.45, 1]
                                    }}
                                    onAnimationComplete={() => handleCollision(pulse.type === 'risk')}
                                    className={`absolute flex items-center pointer-events-none translate-y-[-50%] ${pulse.type === 'risk' ? 'z-50' : 'z-30'
                                        }`}
                                >
                                    {/* Pulse Core */}
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${pulse.type === 'risk' ? 'bg-rose-500 shadow-[0_0_30px_#f43f5e]' : 'bg-primary shadow-[0_0_30px_#7c69ef]'
                                        }`}>
                                        <div className={`absolute inset-x-0 w-20 h-px right-full ${pulse.type === 'risk' ? 'bg-gradient-to-l from-rose-500 to-transparent' : 'bg-gradient-to-l from-primary to-transparent'
                                            }`} />
                                    </div>

                                    {/* HUD Marker for Risk */}
                                    {pulse.type === 'risk' && (
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-rose-500 text-white text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-lg">
                                            Malicious Command Blocked
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                    </div>

                    {/* Ground Reflections */}
                    <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
                </div>
            </div>

            <style jsx global>{`
                .perspective-1500 { perspective: 1500px; }
                .preserve-3d { transform-style: preserve-3d; }
                .rotate-x-15 { transform: rotateX(15deg); }
                .translate-z-50 { transform: translateZ(50px); }
                .translate-z-120 { transform: translateZ(120px); }
                .translate-z-negative-100 { transform: translateZ(-100px); }
            `}</style>
        </section>
    );
}
