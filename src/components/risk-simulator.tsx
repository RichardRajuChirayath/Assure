"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ShieldAlert, AlertTriangle, CheckCircle2, RefreshCcw, ChevronRight, Zap, Loader2 } from "lucide-react";
import { logRiskEvent, getSettings } from "@/lib/actions";
import { evaluateRisk } from "@/lib/engine";

export function RiskSimulator() {
    const [status, setStatus] = useState<"idle" | "running" | "evaluating" | "blocked" | "success" | "bypassed">("idle");
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const [riskScore, setRiskScore] = useState(0);
    const [engineVerdict, setEngineVerdict] = useState<any>(null);
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        getSettings().then(setSettings);
    }, []);

    const simulationSteps = [
        "Initializing safety handshake...",
        "Scanning command parameters...",
        "Context analysis: Environment = PRODUCTION",
        "Temporal check: Evaluation in progress...",
        "Historical lookup: Analysing past interventions...",
        "Synthesizing risk signals...",
    ];

    async function runSimulation() {
        setStatus("running");
        setLogs([]);
        setRiskScore(0);

        for (let i = 0; i < simulationSteps.length; i++) {
            await new Promise(r => setTimeout(r, 400));
            setLogs(prev => [...prev, simulationSteps[i]]);
            setProgress(((i + 1) / simulationSteps.length) * 100);
        }

        setStatus("evaluating");

        // Call the real Python engine with user threshold
        const result = await evaluateRisk({
            action_type: "DATABASE_MIGRATION",
            environment: "PRODUCTION",
            payload: { branch: "main", risky_flags: ["--force"] },
            threshold: settings?.riskThreshold || 70
        });

        setRiskScore(result.risk_score);
        setEngineVerdict(result);

        if (result.verdict === "ALLOW") {
            await logRiskEvent({
                actionType: "SIMULATED_DEPLOY",
                riskScore: result.risk_score,
                verdict: "ALLOWED",
                reasoning: "Safe score (below configured threshold)",
                context: { environment: "production", engine_verdict: "ALLOW", threshold: settings?.riskThreshold }
            });
            setStatus("success");
        } else {
            // Log the initial block to the real DB
            await logRiskEvent({
                actionType: "SIMULATED_DEPLOY",
                riskScore: result.risk_score,
                verdict: "BLOCKED",
                reasoning: result.reasoning.join(" | "),
                context: { environment: "production", engine_verdict: result.verdict, threshold: settings?.riskThreshold }
            });
            setStatus("blocked");
        }
    }

    async function handleAction(verdict: "ALLOWED" | "OVERRIDDEN") {
        const finalStatus = verdict === "ALLOWED" ? "success" : "bypassed";

        await logRiskEvent({
            actionType: "SIMULATED_DEPLOY",
            riskScore: riskScore,
            verdict: verdict,
            reasoning: verdict === "OVERRIDDEN" ? "Manual bypass by operator" : "Safe patch applied",
            context: { environment: "production", user_action: verdict }
        });

        setStatus(finalStatus);
    }

    function reset() {
        setStatus("idle");
        setProgress(0);
        setLogs([]);
        setRiskScore(0);
    }

    return (
        <div className="bg-secondary/40 border border-white/5 rounded-[40px] p-8 h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                        <Terminal className="w-5 h-5 text-primary" /> Risk Engine Simulator
                    </h3>
                    <p className="text-xs text-muted font-medium mt-1">
                        Sensitivity: {settings?.riskThreshold || 70}/100
                        {settings?.fridayBlock && " • Friday Block Enabled"}
                    </p>
                </div>
                {status !== "idle" && (
                    <button onClick={reset} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <RefreshCcw className="w-4 h-4 text-muted" />
                    </button>
                )}
            </div>

            <div className="flex-1 flex flex-col justify-center min-h-[300px] relative">
                <AnimatePresence mode="wait">
                    {status === "idle" && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-6"
                        >
                            <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <Zap className="w-10 h-10 text-primary animate-pulse" />
                            </div>
                            <button
                                onClick={runSimulation}
                                className="px-8 py-4 bg-primary text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-3"
                            >
                                Trigger Dangerous Deploy
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}

                    {(status === "running" || status === "evaluating") && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="font-mono text-[10px] space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-4 text-emerald-400/80">
                                {logs.map((log, i) => (
                                    <div key={i} className="flex gap-2">
                                        <span className="opacity-30">&gt;</span> {log}
                                    </div>
                                ))}
                                {status === "evaluating" && (
                                    <div className="flex gap-2 text-primary">
                                        <Loader2 className="w-3 h-3 animate-spin" /> Evaluating with engine...
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase text-muted tracking-widest">
                                    <span>Intelligence Link</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-primary shadow-[0_0_10px_#7c69ef]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {status === "blocked" && (
                        <motion.div
                            key="blocked"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 space-y-6"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-2xl bg-rose-500/20">
                                    <ShieldAlert className="w-8 h-8 text-rose-500" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-rose-500 uppercase tracking-tight">Intervention Triggered</h4>
                                    <p className="text-xs text-rose-200/60 font-medium italic">Risk Score: {riskScore}/100 - Deploy window blocked.</p>
                                    {engineVerdict?.reasoning && (
                                        <div className="mt-2 space-y-1">
                                            {engineVerdict.reasoning.map((r: string, idx: number) => (
                                                <div key={idx} className="text-[9px] text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                                    <div className="w-1 h-1 rounded-full bg-rose-500" /> {r}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleAction("ALLOWED")}
                                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Safe Patch</span>
                                </button>
                                <button
                                    onClick={() => handleAction("OVERRIDDEN")}
                                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-500/50 hover:bg-rose-500/5 transition-all group"
                                >
                                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Bypass Engine</span>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {(status === "success" || status === "bypassed") && (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-4"
                        >
                            <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${status === "success" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]" : "bg-amber-500/10 text-amber-500 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]"}`}>
                                {status === "success" ? <CheckCircle2 className="w-10 h-10" /> : <ShieldAlert className="w-10 h-10" />}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                                    {status === "success" ? "Intervention Successful" : "Manual Override Logged"}
                                </h3>
                                <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">Action processed by Assure Control Plane</p>
                            </div>
                            <button onClick={reset} className="px-6 py-2 rounded-full border border-white/10 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/5 transition-all">
                                Run another simulation
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-[0.2em]">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Engine: Connected
                    </div>
                    <div className="text-[10px] font-black text-primary/50 uppercase tracking-widest">
                        v4.0.0
                    </div>
                </div>
            </div>
        </div>
    );
}
