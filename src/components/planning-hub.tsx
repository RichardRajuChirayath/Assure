"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, Zap, ShieldCheck, AlertTriangle, TrendingUp, ChevronRight } from "lucide-react";

interface PlanningHubProps {
    planning: {
        strategies: {
            BIG_BANG: number;
            STAGED: number;
            CANARY: number;
        };
        recommendation: string;
    };
    riskScore: number;
}

export function PlanningHub({ planning, riskScore }: PlanningHubProps) {
    if (!planning) return null;

    const strategies = [
        { id: "BIG_BANG", name: "Big Bang", icon: <Zap className="w-4 h-4" />, color: "text-rose-500", bg: "bg-rose-500/10" },
        { id: "STAGED", name: "Staged Rollout", icon: <TrendingUp className="w-4 h-4" />, color: "text-amber-500", bg: "bg-amber-500/10" },
        { id: "CANARY", name: "Canary Release", icon: <ShieldCheck className="w-4 h-4" />, color: "text-emerald-500", bg: "bg-emerald-500/10" }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                <Target className="w-3.5 h-3.5" /> Assure PlanNet: Strategy Simulation
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {strategies.map((strategy) => {
                    const score = Math.round(planning.strategies[strategy.id as keyof typeof planning.strategies]);
                    const isRecommended = planning.recommendation === strategy.id;

                    return (
                        <div
                            key={strategy.id}
                            className={`p-5 rounded-3xl border transition-all ${isRecommended ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(124,105,239,0.1)]" : "border-white/5 bg-black/20"}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2 rounded-xl ${strategy.bg} ${strategy.color}`}>
                                    {strategy.icon}
                                </div>
                                {isRecommended && (
                                    <span className="text-[8px] font-black bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Recommended</span>
                                )}
                            </div>
                            <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{strategy.name}</h5>
                            <div className="flex items-end gap-2">
                                <span className={`text-2xl font-black font-mono ${score >= 70 ? "text-rose-500" : score >= 40 ? "text-amber-500" : "text-emerald-500"}`}>
                                    {score}
                                </span>
                                <span className="text-[10px] text-muted font-bold mb-1 uppercase tracking-widest">Risk Score</span>
                            </div>

                            {/* Risk Bar */}
                            <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${score}%` }}
                                    className={`h-full ${score >= 70 ? "bg-rose-500" : score >= 40 ? "bg-amber-500" : "bg-emerald-500"}`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-primary/20">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h6 className="text-xs font-black text-white uppercase tracking-widest mb-1">Optimal Safety Path Identified</h6>
                        <p className="text-[10px] text-muted font-medium">
                            PlanNet suggests transitioning to a <span className="text-white font-bold">{planning.recommendation}</span> strategy to reduce blast radius by <span className="text-emerald-500 font-bold">{Math.round(100 - (planning.strategies[planning.recommendation as keyof typeof planning.strategies] / planning.strategies.BIG_BANG * 100))}%</span>.
                        </p>
                    </div>
                </div>
                <button className="whitespace-nowrap px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2 transition-all">
                    Generate Rollout YAML <ChevronRight className="w-3 h-3 text-primary" />
                </button>
            </div>
        </div>
    );
}
