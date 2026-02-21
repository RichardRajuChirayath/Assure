"use client";

import { motion } from "framer-motion";
import { Check, X, Shield, Search, Activity, LifeBuoy, Lock, Cpu } from "lucide-react";

const comparisonData = [
    {
        category: "CI/CD & Analysis",
        icon: <Search className="w-5 h-5" />,
        traditional: "Detects syntax/security issues in code during build.",
        limitation: "Operating at PR level misses production-time context.",
        differentiation: "An intelligent sentinel at the point of live execution."
    },
    {
        category: "Observability",
        icon: <Activity className="w-5 h-5" />,
        traditional: "Reactive detection after system failure has started.",
        limitation: "Damage is already occurring by the time you're alerted.",
        differentiation: "Contextual prevention that blocks the incident entirely."
    },
    {
        category: "Incident Mgmt",
        icon: <LifeBuoy className="w-5 h-5" />,
        traditional: "Focuses on Triage and MTTR (Recovery Time).",
        limitation: "Assumes incidents are inevitable; prioritizes coordination.",
        differentiation: "Shifts reliability upstream to prevent the triage loop."
    },
    {
        category: "Security Policy",
        icon: <Lock className="w-5 h-5" />,
        traditional: "Enforces binary rules (Allow/Deny) and compliance.",
        limitation: "Fails to model complex human-risk and operational signals.",
        differentiation: "Dynamic risk modeling based on deep historical patterns."
    },
    {
        category: "AI Dev Assistants",
        icon: <Cpu className="w-5 h-5" />,
        traditional: "Speeds up code generation and initial code review.",
        limitation: "Detached from the operational reality of production flows.",
        differentiation: "The active gatekeeper for high-stakes deployment actions."
    }
];

export function Comparison() {
    return (
        <section id="comparison" className="py-24 px-6 bg-background relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white"
                    >
                        {"Why Assure is Different.".split(" ").map((word, i) => (
                            <motion.span
                                key={i}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.2, 0.65, 0.3, 0.9] }}
                                className="inline-block mr-[0.2em]"
                            >
                                {word === "Assure" ? <span className="gradient-text">{word}</span> : word}
                            </motion.span>
                        ))}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-muted text-lg max-w-2xl mx-auto font-light"
                    >
                        Conventional tools watch the code or the cloud. <br />
                        Assure watches the <span className="text-white font-medium">moment of decision</span>.
                    </motion.p>
                </div>

                {/* Desktop Table */}
                <div className="hidden lg:block overflow-hidden rounded-[40px] border border-white/5 bg-secondary/20 backdrop-blur-xl shadow-2xl">
                    <div className="grid grid-cols-12 border-b border-white/10 bg-white/[0.03]">
                        <div className="col-span-3 p-8 text-[10px] uppercase font-bold tracking-[0.3em] text-muted">Core Category</div>
                        <div className="col-span-4 p-8 text-[10px] uppercase font-bold tracking-[0.3em] text-muted border-l border-white/5">Traditional Solutions</div>
                        <div className="col-span-5 p-8 text-[10px] uppercase font-bold tracking-[0.3em] text-primary flex items-center gap-2 border-l border-white/5 bg-primary/5">
                            <Shield className="w-4 h-4" /> The Assure Differentiation
                        </div>
                    </div>

                    {comparisonData.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="grid grid-cols-12 border-b border-white/5 last:border-0 hover:bg-white/[0.04] transition-all duration-500 group"
                        >
                            <div className="col-span-3 p-8 flex items-center gap-6">
                                <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:scale-110 shadow-lg group-hover:shadow-primary/20">
                                    {item.icon}
                                </div>
                                <span className="font-black text-white text-lg tracking-tight group-hover:translate-x-1 transition-transform duration-500">{item.category}</span>
                            </div>
                            <div className="col-span-4 p-8 flex flex-col justify-center gap-3 border-l border-white/5">
                                <div className="flex items-start gap-3 text-sm text-zinc-300 font-medium">
                                    <Check className="w-4 h-4 text-emerald-500/40 mt-1 flex-shrink-0" />
                                    <span>{item.traditional}</span>
                                </div>
                                <div className="flex items-start gap-3 text-sm text-rose-500/80 font-bold">
                                    <X className="w-4 h-4 mt-1 flex-shrink-0" />
                                    <span>{item.limitation}</span>
                                </div>
                            </div>
                            <div className="col-span-5 p-8 bg-primary/[0.02] flex items-center border-l border-white/5 group-hover:bg-primary/10 transition-colors duration-500">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                                        <Check className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <p className="text-xl text-white font-black leading-tight tracking-tight italic">
                                        "{item.differentiation}"
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile Layout (Cards) */}
                <div className="lg:hidden space-y-6">
                    {comparisonData.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 rounded-3xl border border-white/5 bg-secondary/50 space-y-4 shadow-xl"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                    {item.icon}
                                </div>
                                <h3 className="font-black text-white uppercase text-xs tracking-widest">{item.category}</h3>
                            </div>

                            <div className="space-y-3 p-5 rounded-2xl bg-black/40 border border-white/5">
                                <div className="flex items-start gap-3 text-sm text-zinc-400 font-medium">
                                    <Check className="w-4 h-4 text-emerald-500/30 mt-0.5 flex-shrink-0" />
                                    <span>{item.traditional}</span>
                                </div>
                                <div className="flex items-start gap-3 text-sm text-rose-500/80 font-bold">
                                    <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>{item.limitation}</span>
                                </div>
                            </div>

                            <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 shadow-lg shadow-primary/5">
                                <p className="text-[10px] text-primary uppercase font-bold tracking-[0.2em] mb-3">The Assure Advantage</p>
                                <p className="text-lg text-white font-black italic leading-tight">
                                    "{item.differentiation}"
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
