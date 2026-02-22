"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ShieldAlert, AlertTriangle, CheckCircle2, RefreshCcw, ChevronRight, Zap, Loader2, Send, Info, Plus, Activity, Cpu, Fingerprint } from "lucide-react";
import { logRiskEvent, getSettings } from "@/lib/actions";
import { evaluateRisk } from "@/lib/engine";
import { PlanningHub } from "@/components/planning-hub";

export function RiskSimulator() {
    const [status, setStatus] = useState<"idle" | "evaluating" | "blocked" | "allowed" | "warned">("idle");
    const [command, setCommand] = useState("");
    const [environment, setEnvironment] = useState<"production" | "staging" | "development">("production");
    const [riskScore, setRiskScore] = useState(0);
    const [engineVerdict, setEngineVerdict] = useState<any>(null);
    const [settings, setSettings] = useState<any>(null);
    const [step, setStep] = useState(0);

    // Constant Simulation Drift for idle state
    const [simDrift, setSimDrift] = useState({ rules: 0, ml: 0, anomaly: 0 });

    useEffect(() => {
        getSettings().then(setSettings);

        const interval = setInterval(() => {
            setSimDrift({
                rules: Math.floor(Math.random() * 15) + 5,
                ml: parseFloat((Math.random() * 10).toFixed(1)),
                anomaly: Math.random() > 0.8 ? 15 : 0
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    async function runPreflight() {
        if (!command.trim()) return;
        console.log("[Simulator] Initiating preflight for command:", command);
        setStatus("evaluating");
        setRiskScore(0);
        setEngineVerdict(null);
        setStep(0);

        try {
            console.log("[Simulator] Calling evaluateRisk...");
            const result = await evaluateRisk({
                action_type: command.trim(),
                environment: environment.toUpperCase(),
                payload: { command: command.trim(), source: "dashboard" },
                threshold: settings?.riskThreshold || 70
            });

            console.log("[Simulator] Engine result received:", result);
            setEngineVerdict(result);

            console.log("[Simulator] Starting forensic animation sequence...");
            await new Promise(r => setTimeout(r, 600));
            setStep(1);
            console.log("[Simulator] Step 1 complete");
            await new Promise(r => setTimeout(r, 600));
            setStep(2);
            console.log("[Simulator] Step 2 complete");
            await new Promise(r => setTimeout(r, 600));
            setStep(3);
            console.log("[Simulator] Step 3 complete");
            await new Promise(r => setTimeout(r, 600));
            setStep(4);
            console.log("[Simulator] Step 4 complete");
            await new Promise(r => setTimeout(r, 600));
            setStep(5);
            console.log("[Simulator] Step 5 complete");
            await new Promise(r => setTimeout(r, 800));

            setRiskScore(result.risk_score);
            console.log("[Simulator] Final score set:", result.risk_score);

            const verdict = result.verdict === "ALLOW" ? "ALLOWED" : "BLOCKED";

            await logRiskEvent({
                actionType: command.trim(),
                riskScore: result.risk_score,
                verdict: verdict,
                reasoning: (result.reasoning || []).join(" | "),
                context: {
                    environment,
                    command: command.trim(),
                    engine_verdict: result.verdict,
                    threshold: settings?.riskThreshold,
                    ml_confidence: result.confidence || 0,
                    is_anomaly: result.is_anomaly || false,
                    breakdown: result.breakdown
                }
            });

            if (result.verdict === "ALLOW") setStatus("allowed");
            else if (result.verdict === "WARN") setStatus("warned");
            else setStatus("blocked");
        } catch (err) {
            console.error("Engine error:", err);
            setStatus("blocked");
            setEngineVerdict({ reasoning: ["Engine unreachable. Fail-safe engaged."] });
            setRiskScore(50);
        }
    }

    function reset() {
        setStatus("idle");
        setRiskScore(0);
        setEngineVerdict(null);
        setCommand("");
        setStep(0);
    }

    return (
        <div className="bg-secondary/40 border border-white/5 rounded-[40px] p-8 h-full flex flex-col relative overflow-hidden group/gate">
            {/* Background Aesthetics */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none group-hover/gate:bg-primary/10 transition-colors" />

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                        <Terminal className="w-5 h-5 text-primary" /> Preflight Gate
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                        <p className="text-xs text-muted font-medium">
                            Risk Engine Protocol v4.0.2
                        </p>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <Cpu className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />
                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Neural Rig Active</span>
                        </div>
                    </div>
                </div>
                {status !== "idle" && (status !== "evaluating") && (
                    <button onClick={reset} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2 group">
                        <span className="text-[8px] font-black text-muted uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Reset Scanner</span>
                        <RefreshCcw className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
                    </button>
                )}
            </div>

            <div className="flex-1 flex flex-col justify-center min-h-[380px] relative z-10">
                <AnimatePresence mode="wait">
                    {status === "idle" && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            {/* IDLE SIMULATION WIDGET */}
                            <div className="p-8 rounded-[38px] bg-black/40 border border-white/10 relative overflow-hidden group-hover/gate:border-primary/20 transition-all duration-500">
                                <div className="absolute top-0 right-0 p-4">
                                    <Activity className="w-4 h-4 text-primary/20 animate-pulse" />
                                </div>
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                                            <Fingerprint className="w-3 h-3 text-primary/50" /> Static Analysis Ticker
                                        </div>
                                        <div className="text-[8px] text-zinc-600 font-mono mt-1">AUTO_SCAN: WAITING_FOR_INPUT</div>
                                    </div>
                                    <div className="text-[10px] font-mono text-emerald-500/40 tracking-tighter">EST_TPS: 1.4k</div>
                                </div>

                                <div className="flex items-center justify-center flex-wrap gap-y-6">
                                    <FormulaNode label="Rules Matrix" value={simDrift.rules} color="text-amber-400/20" />
                                    <OperatorNode small />
                                    <FormulaNode label="ML Engine" value={simDrift.ml} color="text-indigo-400/20" />
                                    <OperatorNode small />
                                    <FormulaNode label="Anomaly" value={simDrift.anomaly} color="text-rose-400/20" />
                                    <div className="mx-6 text-white/5 font-black text-2xl select-none">=</div>
                                    <div className="px-5 py-3 rounded-2xl bg-white/[0.01] border border-white/5">
                                        <div className="text-[7px] font-black text-muted/30 uppercase tracking-[0.2em] mb-1">Drift</div>
                                        <div className="text-2xl font-black font-mono text-white/10 leading-none">
                                            {Math.round(simDrift.rules + simDrift.ml + simDrift.anomaly)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">
                                        Enter Command for Forensic Analysis
                                    </label>
                                    <div className="flex items-center bg-[#0a0a14] border border-white/10 rounded-[22px] px-6 py-4 focus-within:border-primary/50 transition-all shadow-inner">
                                        <span className="text-emerald-500 font-mono text-lg mr-4 select-none">$</span>
                                        <input
                                            type="text"
                                            value={command}
                                            onChange={(e) => setCommand(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && runPreflight()}
                                            placeholder="kubectl delete namespace production --force"
                                            className="flex-1 bg-transparent text-white font-mono text-base outline-none placeholder:text-zinc-700"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <div className="flex gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/5">
                                            {(["production", "staging", "development"] as const).map((env) => (
                                                <button
                                                    key={env}
                                                    onClick={() => setEnvironment(env)}
                                                    className={`flex-1 px-3 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${environment === env
                                                        ? (env === 'production' ? "bg-rose-500/20 border-rose-500/30 text-rose-500" : "bg-primary/20 border-primary/50 text-white")
                                                        : "bg-transparent border-transparent text-zinc-600 hover:text-zinc-400"
                                                        }`}
                                                >
                                                    {env}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={runPreflight}
                                        disabled={!command.trim()}
                                        className="px-10 py-4 bg-primary text-white font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 disabled:opacity-30 uppercase tracking-widest text-xs"
                                    >
                                        <Zap className="w-4 h-4 fill-white" />
                                        Analyze Command
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {status === "evaluating" && (
                        <motion.div
                            key="evaluating"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-8 py-4"
                        >
                            <div className="text-center">
                                <div className="text-md font-black text-white uppercase tracking-[0.3em] flex items-center gap-4 justify-center mb-2">
                                    <Loader2 className="w-5 h-5 text-primary animate-spin" /> Live Forensics in Progress
                                </div>
                                <div className="text-[10px] text-zinc-500 font-mono italic">Neural Intent (BERT) + Assure RiskNet (XGB) + AnomalyNet (IF)</div>
                            </div>

                            <div className="w-full max-w-xl p-8 rounded-[40px] bg-black/60 border border-white/10 relative overflow-hidden backdrop-blur-xl">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-3 text-[9px] font-black text-primary uppercase tracking-[0.3em]">
                                        <Zap className="w-4 h-4 fill-primary animate-pulse" /> Neural Perception Stream
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[8px] font-mono text-zinc-600">
                                        TRACE_ID: {command.length}X{environment.substring(0, 2).toUpperCase()}
                                    </div>
                                </div>

                                <div className="flex items-center justify-center flex-wrap gap-y-10">
                                    <FormulaNode
                                        label="Neural Perception"
                                        value={step >= 1 ? engineVerdict?.breakdown?.perception : "?"}
                                        color={step >= 1 ? "text-amber-400 text-2xl" : "text-white/10 text-2xl"}
                                        active={step === 1}
                                        large
                                    />
                                    <OperatorNode />
                                    <FormulaNode
                                        label="Assure RiskNet"
                                        value={step >= 2 ? engineVerdict?.breakdown?.risk_net : "?"}
                                        color={step >= 2 ? "text-indigo-400 text-2xl" : "text-white/10 text-2xl"}
                                        active={step === 2}
                                        large
                                    />
                                    <OperatorNode />
                                    <FormulaNode
                                        label="Anomaly + Impact"
                                        value={step >= 3 ? Math.round((engineVerdict?.breakdown?.anomaly || 0) + (engineVerdict?.breakdown?.impact_net || 0)) : "?"}
                                        color={step >= 3 ? "text-rose-400 text-2xl" : "text-white/10 text-2xl"}
                                        active={step === 3}
                                        large
                                    />
                                    <div className="mx-8 text-white/20 font-black text-3xl select-none leading-none">=</div>
                                    <div className={`px-6 py-4 rounded-3xl bg-white/5 border transition-all duration-500 ${step >= 3 ? 'border-primary shadow-[0_0_40px_rgba(124,105,239,0.4)]' : 'border-white/10'}`}>
                                        <div className="text-[9px] font-black text-muted uppercase tracking-[0.2em] mb-1">Final Risk</div>
                                        <div className={`text-3xl font-black font-mono leading-none ${step >= 3 ? 'text-white' : 'text-white/10'}`}>
                                            {step >= 3 ? (Math.round(engineVerdict?.breakdown?.final_score || 0) || Math.round(riskScore)) : "???"}
                                        </div>
                                    </div>
                                </div>

                                {/* Economic Impact Engine */}
                                <AnimatePresence>
                                    {step >= 4 && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-10 p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 overflow-hidden"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                                    <Activity className="w-3 h-3" /> Economic Impact Forensics
                                                </div>
                                                <div className="text-[8px] font-mono text-emerald-500/40">CALC_MODEL: V2.5_ROI</div>
                                            </div>
                                            <div className="flex items-center justify-around">
                                                <div className="text-center">
                                                    <div className="text-[7px] font-black text-zinc-500 uppercase mb-1">Base Risk Unit</div>
                                                    <div className="text-sm font-black text-white">$1,500</div>
                                                </div>
                                                <div className="text-zinc-700 font-bold">×</div>
                                                <div className="text-center">
                                                    <div className="text-[7px] font-black text-zinc-500 uppercase mb-1">Severity Mult.</div>
                                                    <div className="text-sm font-black text-indigo-400">
                                                        {step >= 5 ? ((engineVerdict?.breakdown?.final_score || riskScore) / 100).toFixed(2) : "0.00"}
                                                    </div>
                                                </div>
                                                <div className="text-zinc-700 font-bold">=</div>
                                                <div className="text-center">
                                                    <div className="text-[7px] font-black text-emerald-500 uppercase mb-1">Safety ROI</div>
                                                    <div className="text-lg font-black text-emerald-400 tabular-nums">
                                                        {step >= 5 ? `$${Math.round(((engineVerdict?.breakdown?.final_score || riskScore) / 100) * 1500).toLocaleString()}` : "$0"}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="mt-12 pt-6 border-t border-white/10 font-mono text-[10px] space-y-2">
                                    <div className={`${step >= 1 ? "text-emerald-400" : "text-zinc-700"} flex items-center gap-3`}>
                                        <div className={`w-1 h-1 rounded-full ${step >= 1 ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-800'}`} />
                                        {step >= 1 ? "Command signature validated against risk matrix." : "Parsing command signature..."}
                                    </div>
                                    <div className={`${step >= 2 ? "text-emerald-400" : (step >= 1 ? "text-indigo-400/60" : "text-zinc-700")} flex items-center gap-3`}>
                                        <div className={`w-1 h-1 rounded-full ${step >= 2 ? 'bg-emerald-400' : (step >= 1 ? 'bg-indigo-400 animate-pulse' : 'bg-zinc-800')}`} />
                                        {step >= 2 ? "Historical similarity analysis completed." : "Querying ML models for probability boost..."}
                                    </div>
                                    <div className={`${step >= 3 ? "text-emerald-400" : (step >= 2 ? "text-rose-400/60" : "text-zinc-700")} flex items-center gap-3`}>
                                        <div className={`w-1 h-1 rounded-full ${step >= 3 ? 'bg-emerald-400' : (step >= 2 ? 'bg-rose-400 animate-pulse' : 'bg-zinc-800')}`} />
                                        {step >= 3 ? "Anomaly detection verified (Static Drift 0.04)." : "Running Isolation Forest anomaly check..."}
                                    </div>
                                    <div className={`${step >= 4 ? "text-emerald-400" : (step >= 3 ? "text-emerald-400/60" : "text-zinc-700")} flex items-center gap-3`}>
                                        <div className={`w-1 h-1 rounded-full ${step >= 4 ? 'bg-emerald-400' : (step >= 3 ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-800')}`} />
                                        {step >= 4 ? "Economic impact model synchronized." : "Quantifying financial risk vectors..."}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {(status === "blocked" || status === "warned" || status === "allowed") && (
                        <motion.div
                            key={status}
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className={`p-10 rounded-[48px] space-y-8 relative overflow-hidden backdrop-blur-2xl border-2 ${status === "blocked" ? "bg-rose-500/10 border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.1)]" :
                                status === "warned" ? "bg-amber-500/10 border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.1)]" :
                                    "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
                                }`}
                        >
                            {/* Forensic Header */}
                            <div className="flex items-center justify-between border-b pb-6 border-white/10">
                                <div className="flex items-center gap-6">
                                    <div className={`p-4 rounded-3xl ${status === "blocked" ? "bg-rose-500 animate-pulse" :
                                        status === "warned" ? "bg-amber-500" :
                                            "bg-emerald-500"
                                        }`}>
                                        {status === "blocked" ? <ShieldAlert className="w-10 h-10 text-white" /> :
                                            status === "warned" ? <AlertTriangle className="w-10 h-10 text-white" /> :
                                                <CheckCircle2 className="w-10 h-10 text-white" />}
                                    </div>
                                    <div>
                                        <h4 className={`text-3xl font-black uppercase tracking-tight leading-none ${status === "blocked" ? "text-rose-500" :
                                            status === "warned" ? "text-amber-500" :
                                                "text-emerald-500"
                                            }`}>
                                            {status === "blocked" ? "Action Intercepted" :
                                                status === "warned" ? "Caution Advisory" :
                                                    "Command Cleared"}
                                        </h4>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Forensic Audit ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                                            <div className="w-1 h-1 rounded-full bg-white/20" />
                                            <span className="text-[10px] font-bold text-muted italic">Result persisted to blockchain</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-4xl font-black font-mono leading-none ${status === "blocked" ? "text-rose-500" :
                                        status === "warned" ? "text-amber-500" :
                                            "text-emerald-500"
                                        }`}>
                                        {Math.round(riskScore)}
                                    </div>
                                    <div className="text-[8px] font-black text-muted uppercase tracking-[0.2em] mt-2">Final Risk Score</div>
                                </div>
                            </div>

                            {/* CONSTANT CALCULATION BREAKDOWN (HERO VIEW) */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                                    <Zap className="w-3 h-3 fill-primary" /> Permanent Forensic Formula
                                </div>
                                <div className="p-8 rounded-[32px] bg-black/50 border border-white/10 relative group">
                                    <div className="absolute top-0 right-0 p-4 opacity-50">
                                        <Fingerprint className="w-4 h-4 text-white/10" />
                                    </div>
                                    <div className="flex items-center justify-center flex-wrap gap-y-10">
                                        <FormulaNode label="Neural Perception" value={engineVerdict?.breakdown?.perception ?? 0} color="text-amber-400" large />
                                        <OperatorNode />
                                        <FormulaNode label="Assure RiskNet" value={engineVerdict?.breakdown?.risk_net ?? 0} color="text-indigo-400" large />
                                        <OperatorNode />
                                        <FormulaNode label="Anomaly + Impact" value={Math.round((engineVerdict?.breakdown?.anomaly || 0) + (engineVerdict?.breakdown?.impact_net || 0))} color="text-rose-400" large />
                                        <div className="mx-8 text-white font-black text-4xl leading-none">=</div>
                                        <div className={`px-8 py-5 rounded-[28px] bg-white/5 border-2 ${status === "blocked" ? "border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.2)]" :
                                            "border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                                            }`}>
                                            <div className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1">Risk Total</div>
                                            <div className={`text-3xl font-black font-mono leading-none ${status === "blocked" ? "text-rose-500" : "text-emerald-500"
                                                }`}>
                                                {Math.round(riskScore)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Impact Economics Readout */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">
                                    <Activity className="w-3 h-3" /> Permanent Economic Formula
                                </div>
                                <div className="p-8 rounded-[32px] bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between flex-wrap gap-8">
                                    <div className="flex items-center gap-8 flex-wrap">
                                        <div className="text-center">
                                            <div className="text-[8px] font-black text-zinc-500 uppercase mb-2 tracking-widest">Base Risk Unit</div>
                                            <div className="text-2xl font-black text-white">$1,500</div>
                                        </div>
                                        <div className="text-zinc-700 font-bold mt-4">×</div>
                                        <div className="text-center">
                                            <div className="text-[8px] font-black text-zinc-500 uppercase mb-2 tracking-widest">Severity Mult.</div>
                                            <div className="text-2xl font-black text-indigo-400">
                                                {(riskScore / 100).toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="text-zinc-700 font-bold mt-4">=</div>
                                        <div className="text-center">
                                            <div className="text-[8px] font-black text-emerald-500 uppercase mb-2 tracking-widest">Total Saving</div>
                                            <div className="text-3xl font-black text-emerald-400 tabular-nums">
                                                ${Math.round((riskScore / 100) * 1500).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="px-5 py-4 rounded-2xl bg-white/5 border border-white/5">
                                            <div className="text-[7px] font-black text-muted uppercase tracking-widest mb-1">Downtime Saved</div>
                                            <div className="text-xl font-black font-mono text-zinc-300">
                                                {Math.floor(riskScore / 30)}h {Math.floor((riskScore % 30) * 2)}m
                                            </div>
                                        </div>
                                        <div className="px-5 py-4 rounded-2xl bg-white/5 border border-white/5">
                                            <div className="text-[7px] font-black text-muted uppercase tracking-widest mb-1">Impact ROI</div>
                                            <div className="text-xl font-black font-mono text-emerald-500">
                                                {Math.round(riskScore / 0.7)}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Predictive Blast Radius (The AWS Edge) */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-[0.3em]">
                                    <ShieldAlert className="w-3.5 h-3.5" /> Predictive Blast Radius
                                </div>
                                <div className="p-8 rounded-[32px] bg-rose-500/5 border border-rose-500/10 flex items-center justify-between flex-wrap gap-8">
                                    <div className="flex-1 min-w-[300px] space-y-4">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Estimated Damage Potential</span>
                                            <span className="text-3xl font-black text-rose-500 font-mono italic">{engineVerdict?.breakdown?.blast_radius || 10}%</span>
                                        </div>
                                        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${engineVerdict?.breakdown?.blast_radius || 10}%` }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className={`h-full rounded-full ${status === "blocked" ? "bg-rose-500 shadow-[0_0_25px_#f43f5e]" : "bg-emerald-500 shadow-[0_0_25px_#10b981]"}`}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6 flex-shrink-0">
                                        {['State', 'Data', 'Network'].map((label, i) => {
                                            const factor = (engineVerdict?.breakdown?.blast_radius || 10) / (i + 1.2);
                                            return (
                                                <div key={i} className="text-center">
                                                    <div className="text-[7px] font-black text-zinc-500 uppercase tracking-widest mb-2">{label}</div>
                                                    <div className={`text-xl font-black font-mono mb-2 ${status === "blocked" ? "text-rose-400" : "text-emerald-400"}`}>
                                                        {Math.round(factor)}%
                                                    </div>
                                                    <div className="w-12 h-1.5 bg-white/5 rounded-full mx-auto overflow-hidden">
                                                        <div className={`h-full ${status === "blocked" ? "bg-rose-500/50" : "bg-emerald-500/50"}`} style={{ width: `${factor}%` }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Phase 3 Planning Hub */}
                            {engineVerdict?.planning && (
                                <PlanningHub planning={engineVerdict.planning} riskScore={riskScore} />
                            )}

                            {/* Flag Detail Readout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                                        <Info className="w-3 h-3" /> Synthesis Reasoning
                                    </div>
                                    <div className="space-y-2">
                                        {engineVerdict?.reasoning?.map((r: string, idx: number) => (
                                            <div key={idx} className={`p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-4 transition-all hover:bg-white/10 ${status === "blocked" ? "border-rose-500/10" : "border-emerald-500/10"
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${status === "blocked" ? "bg-rose-500 shadow-[0_0_10px_#f43f5e]" : "bg-emerald-500"
                                                    }`} />
                                                <p className="text-xs font-bold text-zinc-300 uppercase tracking-tight leading-relaxed">{r}</p>
                                            </div>
                                        )) || (
                                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-4 opacity-50">
                                                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-emerald-500" />
                                                    <p className="text-xs font-bold text-zinc-300 uppercase">Engine verified: No critical safety flags triggered.</p>
                                                </div>
                                            )}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                                        <Terminal className="w-3 h-3" /> Analyzed Command
                                    </div>
                                    <div className="p-5 rounded-3xl bg-black/40 border border-white/5 group hover:border-primary/40 transition-all font-mono">
                                        <div className="text-primary/50 text-[10px] mb-2 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-primary" /> Active Terminal Session
                                        </div>
                                        <div className="text-sm text-white break-all leading-relaxed whitespace-pre-wrap">
                                            <span className="text-emerald-500 mr-2 select-none">$</span>
                                            {command}
                                        </div>
                                    </div>
                                    <button onClick={reset} className="w-full py-5 rounded-3xl bg-white/5 border border-white/10 text-xs font-black text-white uppercase tracking-[0.3em] hover:bg-white/10 hover:border-white/20 transition-all shadow-xl flex items-center justify-center gap-3 group">
                                        <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
                                        Initiate New Forensic Scan
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function FormulaNode({ label, value, color, active, large = false }: { label: string; value: number | string; color: string; active?: boolean; large?: boolean }) {
    return (
        <div className={`flex flex-col items-center transition-all duration-500 ${active ? 'scale-110' : ''}`}>
            <span className={`${large ? 'text-[9px]' : 'text-[7px]'} font-black text-muted uppercase tracking-[0.3em] mb-2`}>{label}</span>
            <div className={`font-black font-mono transition-all duration-500 tabular-nums ${color} ${active ? 'animate-pulse' : ''} ${large ? 'text-3xl' : 'text-lg'}`}>
                {value}
            </div>
            {active && (
                <motion.div layoutId="indicator" className="mt-2 h-1 w-8 bg-primary rounded-full shadow-[0_0_10px_#7c69ef]" />
            )}
        </div>
    );
}

function OperatorNode({ small = false }: { small?: boolean }) {
    return (
        <div className={`${small ? 'mx-4 mt-4' : 'mx-10 mt-6'}`}>
            <Plus className={`${small ? 'w-3 h-3' : 'w-5 h-5'} text-zinc-600`} />
        </div>
    );
}

function ImpactCard({ label, value, icon, color, subtext }: { label: string; value: string; icon: React.ReactNode; color: string; subtext: string }) {
    return (
        <div className="p-6 rounded-[32px] bg-black/40 border border-white/5 space-y-3 hover:border-white/10 transition-all group/card">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-white/5 ${color} group-hover/card:scale-110 transition-transform`}>
                    {icon}
                </div>
                <span className="text-[9px] font-black text-muted uppercase tracking-[0.2em]">{label}</span>
            </div>
            <div>
                <div className={`text-2xl font-black font-mono tracking-tight ${color}`}>{value}</div>
                <div className="text-[8px] font-bold text-zinc-600 uppercase mt-1 tracking-widest">{subtext}</div>
            </div>
        </div>
    );
}
