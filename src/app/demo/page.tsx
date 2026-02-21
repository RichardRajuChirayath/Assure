"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldAlert,
    CheckCircle2,
    Terminal as TerminalIcon,
    AlertTriangle,
    Database,
    History,
    RefreshCcw,
    TrendingDown,
    DollarSign,
    Zap,
    Lock,
    ChevronRight,
    Play
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import BackgroundParticles from "@/components/background-particles";

export default function DemoPage() {
    const [step, setStep] = useState(0); // 0: Idle, 1: Typing, 2: Analyzing, 3: Blocked, 4: Success, 5: Failed (Outage)
    const [terminalLines, setTerminalLines] = useState<{ type: 'cmd' | 'info' | 'error' | 'success' | 'warn', text: string }[]>([]);
    const [currentText, setCurrentText] = useState("");
    const [riskScore, setRiskScore] = useState(0);
    const [lossTicker, setLossTicker] = useState(0);
    const terminalEndRef = useRef<HTMLDivElement>(null);

    const fullCommand = "npx prisma migrate deploy --preview-feature --force";

    useEffect(() => {
        if (step === 1) {
            let i = 0;
            const interval = setInterval(() => {
                setCurrentText(fullCommand.slice(0, i));
                i++;
                if (i > fullCommand.length) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setTerminalLines(prev => [...prev, { type: 'cmd', text: fullCommand }]);
                        setCurrentText("");
                        setStep(2);
                    }, 600);
                }
            }, 40);
            return () => clearInterval(interval);
        }
    }, [step]);

    useEffect(() => {
        if (step === 2) {
            let score = 0;
            const interval = setInterval(() => {
                score += 1;
                setRiskScore(score);
                setLossTicker(prev => prev + (score * 12));
                if (score >= 92) {
                    clearInterval(interval);
                    setStep(3);
                }
            }, 20);
            return () => clearInterval(interval);
        }
    }, [step]);

    const startDemo = () => {
        setStep(1);
        setTerminalLines([
            { type: 'info', text: "Assure Intelligence Layer v3.4.2 [CONNECTED]" },
            { type: 'info', text: "Current Context: Branch 'production' | Time: Friday 16:58" },
            { type: 'warn', text: "Scanning sensitive migration scripts..." }
        ]);
        setRiskScore(0);
        setLossTicker(0);
        setCurrentText("");
    };

    const runAnyway = () => {
        setStep(5);
        setTerminalLines(prev => [
            ...prev,
            { type: 'error', text: "OVERRIDE: Execution initiated despite high risk score..." },
            { type: 'error', text: "DB_PROCESS_01: DEADLOCK DETECTED" },
            { type: 'error', text: "API_GATEWAY: 502 BAD GATEWAY" }
        ]);
    };

    const reset = () => {
        setStep(0);
        setTerminalLines([]);
        setCurrentText("");
        setRiskScore(0);
        setLossTicker(0);
    };

    return (
        <main className="min-h-screen bg-[#02020a] relative font-sans">
            <BackgroundParticles />
            <Navbar />

            {/* Content Container */}
            <div className="pt-32 pb-24 px-6 relative z-10 max-w-7xl mx-auto">
                <div className="mb-8">
                    <a href="/" className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest mb-6 group">
                        <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </a>
                </div>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center justify-center md:justify-start gap-2 text-primary mb-2">
                            <Lock className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Secure Simulation Environment</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                            The <span className="gradient-text">Profit Protector</span>
                        </h1>
                        <p className="text-muted text-sm mt-2 max-w-md">
                            Experience how Assure catches the 4:55 PM Friday deployment that would have cost your company $245k in downtime.
                        </p>
                    </motion.div>

                    <div className="flex gap-4 self-center md:self-auto">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
                            <div className="text-[10px] uppercase font-bold text-muted mb-1 flex items-center gap-2">
                                <DollarSign className="w-3 h-3 text-emerald-500" />
                                Potential Outage Cost
                            </div>
                            <div className="text-2xl font-black text-white font-mono">
                                ${lossTicker.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Panel: Analytics */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        <div className="bg-secondary/40 border border-white/5 rounded-3xl p-6 flex-1 flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted flex items-center gap-2">
                                    <TrendingDown className="w-4 h-4" /> Real-time Risk Analysis
                                </h3>
                                <div className="p-1 px-2 rounded-md bg-rose-500/10 text-rose-500 text-[8px] font-bold animate-pulse">
                                    LIVE FEED
                                </div>
                            </div>

                            <div className="flex-grow flex flex-col justify-center items-center relative py-8">
                                <div className="relative">
                                    <svg className="w-48 h-48 -rotate-90">
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            fill="transparent"
                                            stroke="rgba(255,255,255,0.05)"
                                            strokeWidth="12"
                                        />
                                        <motion.circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            fill="transparent"
                                            stroke={riskScore > 80 ? "#f43f5e" : "#7c69ef"}
                                            strokeWidth="12"
                                            strokeDasharray={2 * Math.PI * 88}
                                            animate={{ strokeDashoffset: (2 * Math.PI * 88) * (1 - riskScore / 100) }}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                        <span className={`text-6xl font-black font-mono tracking-tighter ${riskScore > 80 ? 'text-rose-500' : 'text-white'}`}>
                                            {riskScore}
                                        </span>
                                        <span className="text-[10px] uppercase font-bold text-muted tracking-widest">Risk Score</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className={`p-4 rounded-2xl border transition-all ${riskScore > 50 ? 'bg-rose-500/10 border-rose-500/20' : 'bg-white/5 border-white/5'}`}>
                                    <div className="flex items-center gap-3">
                                        <History className={`w-4 h-4 ${riskScore > 50 ? 'text-rose-500' : 'text-primary'}`} />
                                        <div className="text-xs">
                                            <p className="text-white font-bold">Time Context Alpha</p>
                                            <p className="text-muted text-[10px]">Deploying within 30m of weekend onset.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={`p-4 rounded-2xl border transition-all ${riskScore > 80 ? 'bg-rose-500/10 border-rose-500/20' : 'bg-white/5 border-white/5'}`}>
                                    <div className="flex items-center gap-3">
                                        <Database className={`w-4 h-4 ${riskScore > 80 ? 'text-rose-500' : 'text-primary'}`} />
                                        <div className="text-xs">
                                            <p className="text-white font-bold">Schema Integrity Risk</p>
                                            <p className="text-muted text-[10px]">Command contains '--force' on production.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: The Command Center */}
                    <div className="lg:col-span-8 flex flex-col relative">
                        <div className="bg-[#050510] border border-white/10 rounded-3xl flex-grow overflow-hidden flex flex-col shadow-2xl relative">

                            {/* Window Header */}
                            <div className="bg-white/5 p-4 flex items-center justify-between border-b border-white/5">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-rose-500/30" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/30" />
                                </div>
                                <div className="text-[10px] font-mono text-muted uppercase tracking-widest flex items-center gap-2">
                                    <TerminalIcon className="w-3 h-3" /> production-node-01 (bash)
                                </div>
                                <div className="w-12" />
                            </div>

                            {/* Terminal Body */}
                            <div className="flex-grow p-8 font-mono text-sm overflow-y-auto space-y-3 custom-scrollbar">
                                {terminalLines.map((line, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        key={idx}
                                        className="flex gap-4"
                                    >
                                        <span className="opacity-20 text-muted min-w-[20px]">{idx + 1}</span>
                                        {line.type === 'cmd' ? (
                                            <span className="text-white"><span className="text-emerald-500">$</span> {line.text}</span>
                                        ) : line.type === 'error' ? (
                                            <span className="text-rose-400 flex items-center gap-2 font-bold"><AlertTriangle className="w-3 h-3" /> {line.text}</span>
                                        ) : line.type === 'warn' ? (
                                            <span className="text-yellow-500 flex items-center gap-2"><AlertCircle className="w-3 h-3" /> {line.text}</span>
                                        ) : (
                                            <span className="text-primary italic opacity-70">{line.text}</span>
                                        )}
                                    </motion.div>
                                ))}

                                {step === 1 && (
                                    <div className="flex gap-4">
                                        <span className="opacity-20 text-muted min-w-[20px]">{terminalLines.length + 1}</span>
                                        <span className="text-white">
                                            <span className="text-emerald-500">$</span> {currentText}
                                            <span className="w-2 h-4 bg-primary inline-block animate-pulse ml-1 align-middle" />
                                        </span>
                                    </div>
                                )}

                                {/* Intervention UI */}
                                <AnimatePresence>
                                    {step === 3 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-8 p-1 rounded-3xl bg-gradient-to-br from-rose-500 to-transparent shadow-[0_20px_40px_rgba(244,63,94,0.15)]"
                                        >
                                            <div className="bg-[#0c0c16] rounded-[22px] p-8">
                                                <div className="flex items-start gap-6 mb-8">
                                                    <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                                                        <ShieldAlert className="w-8 h-8 text-rose-500" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-bold text-white mb-2">High-Stakes Intervention</h4>
                                                        <p className="text-sm text-muted leading-relaxed">
                                                            Assure has paused this deployment. This specific command has caused failures in **Production** 3 times in other teams today.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                                    <button
                                                        onClick={() => setStep(4)}
                                                        className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group"
                                                    >
                                                        <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                                                        <span className="text-xs font-bold text-white uppercase tracking-widest">Verify & Patch</span>
                                                        <span className="text-[10px] text-muted">Safe path (Recommended)</span>
                                                    </button>
                                                    <button
                                                        onClick={runAnyway}
                                                        className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-500/50 hover:bg-rose-500/5 transition-all group"
                                                    >
                                                        <AlertTriangle className="w-6 h-6 text-rose-500 mb-2" />
                                                        <span className="text-xs font-bold text-white uppercase tracking-widest">Run Anyway</span>
                                                        <span className="text-[10px] text-muted">Bypass safety (Not advised)</span>
                                                    </button>
                                                </div>

                                                <div className="text-[10px] text-center text-muted font-mono bg-white/5 py-3 rounded-xl border border-white/5">
                                                    INCIDENT PROBABILITY: <span className="text-rose-500 font-bold">88.4%</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div ref={terminalEndRef} />
                            </div>

                            {/* Successful Save Overlay */}
                            {step === 4 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 z-50 bg-[#02020a]/90 backdrop-blur-xl flex flex-col items-center justify-center text-center p-12"
                                >
                                    <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-8 border border-emerald-500/20">
                                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                    </div>
                                    <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">DISASTER PREVENTED</h2>
                                    <p className="max-w-md text-muted mb-10 text-lg leading-relaxed font-light">
                                        Instead of executing a forced migration, you chose to verify. You avoided an 8-hour database outage.
                                    </p>
                                    <div className="bg-secondary/80 p-6 rounded-2xl border border-white/5 mb-10 w-full max-w-sm">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] uppercase font-bold text-muted tracking-widest">Incident Prevention Audit</span>
                                            <Zap className="w-3 h-3 text-emerald-500" />
                                        </div>
                                        <div className="text-sm text-left text-white leading-relaxed font-mono">
                                            <span className="text-emerald-500">✓</span> Target: PROD_CATALOG<br />
                                            <span className="text-emerald-500">✓</span> Action: BLOCKED/VERIFIED<br />
                                            <span className="text-emerald-500">✓</span> Estimated Saving: <span className="text-emerald-400 font-bold">$18,400</span>
                                        </div>
                                    </div>
                                    <button onClick={reset} className="px-10 py-4 bg-primary text-white font-black rounded-xl hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center gap-3">
                                        <RefreshCcw className="w-5 h-5" /> RESTART DEMO
                                    </button>
                                </motion.div>
                            )}

                            {/* Failure Overlay */}
                            {step === 5 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 z-50 bg-rose-950 flex flex-col items-center justify-center text-center p-12 overflow-hidden"
                                >
                                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                                        {[...Array(20)].map((_, i) => (
                                            <div key={i} className="absolute text-rose-200 font-mono text-xs whitespace-nowrap animate-pulse" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s` }}>
                                                FATAL_EXCEPTION_0x{Math.random().toString(16).slice(2, 6).toUpperCase()}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-8 animate-bounce">
                                        <ShieldAlert className="w-12 h-12 text-white" />
                                    </div>
                                    <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">SUCCESSFUL DEPLOY...</h2>
                                    <p className="max-w-md text-rose-200 mb-6 text-lg font-bold">
                                        Wait, logs just turned red.
                                    </p>
                                    <p className="max-w-md text-white/70 mb-10 text-sm leading-relaxed font-light">
                                        Database is locked. Checkout is broken globally. <br /> Total estimated loss in next 60m: <span className="text-white font-bold">$124,000+</span>
                                    </p>
                                    <button onClick={reset} className="px-10 py-4 bg-white text-rose-900 font-black rounded-xl hover:scale-105 transition-all shadow-2xl relative z-10 flex items-center gap-3 font-mono">
                                        <RefreshCcw className="w-5 h-5" /> ATTEMPT RECOVERY
                                    </button>
                                </motion.div>
                            )}

                            {/* Idle Overlay */}
                            {step === 0 && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10 p-12">
                                    <div className="max-w-md text-center mb-10">
                                        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                            <Play className="w-6 h-6 text-primary fill-current" />
                                        </div>
                                        <h3 className="text-2xl font-black text-white mb-2">Ready to ship?</h3>
                                        <p className="text-muted text-sm leading-relaxed">
                                            Initiate the production migration. Assure will run in the background as your silent guardian.
                                        </p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={startDemo}
                                        className="bg-primary text-white px-12 py-5 rounded-2xl font-black text-lg flex items-center gap-4 shadow-[0_0_50px_rgba(124,105,239,0.3)] group"
                                    >
                                        START SIMULATION
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </div>
                            )}
                        </div>

                        {/* Status Bar */}
                        <div className="mt-4 flex items-center justify-between text-[10px] text-muted font-mono px-4">
                            <div className="flex gap-4 font-bold tracking-widest">
                                <span className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    NODES: 12
                                </span>
                                <span className="text-primary font-black uppercase">Assure Protocol: Shielding</span>
                            </div>
                            <div className="flex gap-4 opacity-50">
                                <span>VER: 3.4.2</span>
                                <span>LATENCY: 8ms</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .gradient-text {
                    background: linear-gradient(to right, #7c69ef, #a29bfe);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(124, 105, 239, 0.2);
                    border-radius: 10px;
                }
            `}</style>
        </main>
    );
}

const AlertCircle = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
);
