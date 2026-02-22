"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Users, Database, Globe, ArrowDownRight, ArrowUpRight } from "lucide-react";

const teamScores = [
    { name: "Frontend Core", score: 94, trend: "up", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { name: "Infra SRE", score: 82, trend: "down", color: "text-rose-500", bg: "bg-rose-500/10" },
    { name: "Data Science", score: 88, trend: "up", color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "DevOps Pipeline", score: 76, trend: "down", color: "text-amber-500", bg: "bg-amber-500/10" }
];

export function SafetyScorecards() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                        <Users className="w-5 h-5 text-primary" /> Safety Memory: Team Scorecards
                    </h3>
                    <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">Cross-team safety performance mining</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamScores.map((team, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 rounded-[32px] bg-secondary/40 border border-white/5 hover:border-primary/30 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 rounded-2xl ${team.bg} ${team.color} group-hover:scale-110 transition-transform`}>
                                <Shield className="w-5 h-5" />
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-black ${team.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {team.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {team.trend === 'up' ? '+2.4%' : '-1.8%'}
                            </div>
                        </div>
                        <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-2">{team.name}</h4>
                        <div className="flex items-end gap-2">
                            <span className={`text-4xl font-black ${team.color} tracking-tighter`}>{team.score}</span>
                            <span className="text-xs text-muted font-bold mb-1">/100</span>
                        </div>

                        {/* Progress mini-bar */}
                        <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${team.score}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className={`h-full ${team.color === 'text-emerald-500' ? 'bg-emerald-500' : team.color === 'text-rose-500' ? 'bg-rose-500' : team.color === 'text-blue-500' ? 'bg-blue-500' : 'bg-amber-500'}`}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Pattern Mining Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                <div className="p-8 rounded-[40px] bg-secondary/20 border border-white/5 space-y-6">
                    <div className="flex items-center gap-3 text-white font-black uppercase tracking-widest text-sm">
                        <Database className="w-5 h-5 text-indigo-400" /> recurring Failure Patterns
                    </div>
                    <div className="space-y-4">
                        <PatternItem label="Friday Deployment Fatigue" confidence={94} severity="High" />
                        <PatternItem label="Large PR Validation Bypass" confidence={82} severity="Medium" />
                        <PatternItem label="Credential Leak Potential" confidence={67} severity="Critical" urgent />
                    </div>
                </div>

                <div className="p-8 rounded-[40px] bg-secondary/20 border border-white/5 space-y-6">
                    <div className="flex items-center gap-3 text-white font-black uppercase tracking-widest text-sm">
                        <Globe className="w-5 h-5 text-emerald-400" /> Platform-Wide Learning
                    </div>
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 italic text-xs text-muted leading-relaxed">
                        "Across all 14 connected services, the most common root cause of 'Warned' verdicts is the use of the <span className="text-primary font-bold">--force</span> flag on non-critical resources. Assure recommends centralized policy enforcement for this flag."
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black text-primary uppercase tracking-widest">
                        Data Source: 12k+ Analyzed Events
                        <button className="text-white hover:text-primary transition-colors flex items-center gap-1">
                            Share Insights <ArrowUpRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PatternItem({ label, confidence, severity, urgent = false }: any) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
            <div>
                <div className="text-xs font-bold text-white mb-1 uppercase tracking-tight">{label}</div>
                <div className="text-[10px] text-muted font-bold uppercase tracking-widest">Confidence: {confidence}%</div>
            </div>
            <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${urgent ? 'bg-rose-500/20 text-rose-500 animate-pulse' : 'bg-indigo-500/20 text-indigo-400'}`}>
                {severity} Risk
            </div>
        </div>
    );
}
