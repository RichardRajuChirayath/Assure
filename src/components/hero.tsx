"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronRight, Play, Zap } from "lucide-react";
import { useEffect } from "react";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";

export function Hero() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
    const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const rect = document.getElementById("hero-section")?.getBoundingClientRect();
            if (rect) {
                mouseX.set(e.clientX - rect.left);
                mouseY.set(e.clientY - rect.top);
            }
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <section id="hero-section" className="relative pt-32 pb-20 px-6 overflow-hidden group">
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                style={{
                    background: useTransform(
                        [springX, springY],
                        ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(124, 105, 239, 0.15), transparent 80%)`
                    ),
                }}
            />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] hero-gradient pointer-events-none" />

            <div className="max-w-7xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 border border-primary/20 rounded-full animate-pulse">
                        🛡️ Critical Safety Layer for Digital Operations
                    </span>
                    <div>
                        <motion.h1
                            style={{ y: useTransform(springY, [0, 1000], [0, -20]) }}
                            className="text-5xl md:text-8xl font-black tracking-tight mb-6 gradient-text leading-[1.1]"
                        >
                            {"Because \"Oops\" shouldn't cost millions.".split(" ").map((word, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.8,
                                        delay: i * 0.1,
                                        ease: [0.2, 0.65, 0.3, 0.9]
                                    }}
                                    className="inline-block mr-[0.2em]"
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </motion.h1>
                    </div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        style={{ y: useTransform(springY, [0, 1000], [0, -10]) }}
                        className="max-w-3xl mx-auto text-lg md:text-2xl text-muted mb-10 leading-relaxed font-light"
                    >
                        Assure is the intelligent pre-flight check that catches human errors at the last responsible moment. Stopped outages. Saved weekends. Total trust.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <SignedOut>
                            <SignUpButton mode="modal">
                                <button className="w-full sm:w-auto px-8 py-5 bg-primary text-white font-black rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 group cursor-pointer">
                                    Start Protecting Your Team
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <a
                                href="/dashboard"
                                className="w-full sm:w-auto px-8 py-5 bg-primary text-white font-black rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 group"
                            >
                                Go to Dashboard
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </SignedIn>
                        <a
                            href="/demo"
                            className="w-full sm:w-auto px-8 py-5 bg-secondary/50 border border-white/5 backdrop-blur-md text-white font-black rounded-2xl hover:bg-white/5 transition-all flex items-center justify-center gap-3"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            Watch Demo
                        </a>
                    </motion.div>
                </motion.div>

                {/* Visual Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-20 max-w-4xl mx-auto p-4 rounded-3xl border border-white/5 bg-secondary glass-morphism shadow-2xl overflow-hidden"
                >
                    <div className="flex items-center gap-2 mb-4 p-2 border-b border-white/5">
                        <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                        <span className="ml-2 text-[10px] text-muted font-mono uppercase tracking-[0.2em]">assure-shield --deploy-prod</span>
                    </div>

                    <div className="p-4 md:p-8 space-y-6 text-left">
                        <div className="flex items-start gap-4">
                            <div className="mt-1 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                                <AlertCircle className="w-5 h-5 text-rose-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">High Risk Detected: Friday Deployment</h3>
                                <p className="text-sm text-muted">Statistically, 40% of outages in your team happen on Fridays after 3 PM.</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 group cursor-pointer hover:bg-white/10 transition-colors">
                                <div className="w-5 h-5 rounded border border-white/10 flex items-center justify-center group-hover:border-primary">
                                    <div className="w-3 h-3 rounded-sm bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <span className="text-sm text-zinc-300">Are environment variables synced for Prod?</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 group cursor-pointer hover:bg-white/10 transition-colors">
                                <div className="w-5 h-5 rounded border border-white/10 flex items-center justify-center group-hover:border-primary text-primary">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <span className="text-sm text-zinc-300 line-through opacity-50">Database backup executed?</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-widest">Risk Score: 78/100</span>
                            </div>
                            <button className="px-4 py-2 text-xs font-bold text-white bg-rose-600 rounded-lg opacity-50 cursor-not-allowed">
                                Action Blocked
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
