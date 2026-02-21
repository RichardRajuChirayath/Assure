"use client";

import { motion } from "framer-motion";
import { RiskSimulator } from "@/components/risk-simulator";
import { formatDistanceToNow } from "date-fns";
import { ShieldAlert, Zap, TrendingUp, AlertTriangle, ChevronRight, Activity, Loader2 } from "lucide-react";
import { useRealtime } from "@/lib/useRealtime";

interface DashboardClientProps {
    stats: {
        preventedFailures: number;
        activeWorkflows: number;
        estimatedSavings: number;
        riskScore: number;
    },
    recentEvents: any[]
}

export function DashboardClient({ stats: initialStats, recentEvents: initialEvents }: DashboardClientProps) {
    const { data: realtimeData, connected } = useRealtime();

    // Use realtime data if available, fallback to server-side initial stats
    const displayStats = realtimeData ? {
        preventedFailures: realtimeData.blocked,
        activeWorkflows: initialStats.activeWorkflows, // Not in SSE yet
        estimatedSavings: realtimeData.blocked * 500, // Derived ROI
        riskScore: Math.round(realtimeData.latestEvent?.score || initialStats.riskScore),
    } : initialStats;

    const latestEvent = realtimeData?.latestEvent;

    return (
        <div className="space-y-8 pb-10">
            {/* Connection Status & Alert Banner */}
            <div className="flex flex-col gap-4">
                <AnimatePresence>
                    {!connected && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest"
                        >
                            <Loader2 className="w-3 h-3 animate-spin" /> Intelligence Link Offline - Reconnecting...
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-[20px] bg-amber-500/10 border border-amber-500/30 flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-amber-500/20">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-widest">Global Risk Warning: Friday Window</h4>
                            <p className="text-xs text-amber-500/80 font-medium italic">Engine v4.0 has increased sensitivity due to weekend onset. Proceed with caution.</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Prevented Failures"
                    value={displayStats.preventedFailures.toString()}
                    trend="Live from DB"
                    icon={<ShieldAlert className="w-5 h-5 text-emerald-500" />}
                    color="text-emerald-500"
                />
                <StatCard
                    title="Estimated Savings"
                    value={`$${(displayStats.estimatedSavings / 1000).toFixed(1)}k`}
                    trend="ROI Tracking"
                    icon={<Zap className="w-5 h-5 text-primary" />}
                    color="text-primary"
                />
                <StatCard
                    title="Team Risk Score"
                    value={`${displayStats.riskScore}/100`}
                    trend="Real-time Avg"
                    icon={<Activity className="w-5 h-5 text-blue-500" />}
                    color="text-blue-500"
                />
                <StatCard
                    title="Active Workflows"
                    value={displayStats.activeWorkflows.toString()}
                    trend="Active Polices"
                    icon={<TrendingUp className="w-5 h-5 text-amber-500" />}
                    color="text-amber-500"
                />
            </div>

            {/* Simulation & Intelligence Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                    <RiskSimulator />
                </div>
                <div className="lg:col-span-4">
                    <div className="bg-secondary/40 border border-white/5 rounded-[40px] p-8 h-full flex flex-col">
                        <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                            <Activity className="w-5 h-5 text-primary" /> Recent Activity
                        </h3>
                        <div className="space-y-6 flex-1">
                            {latestEvent ? (
                                <motion.div
                                    key={latestEvent.time}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-4 rounded-2xl bg-white/5 border border-white/10"
                                >
                                    <div className="flex gap-4">
                                        <div className={`w-1 h-10 rounded-full flex-shrink-0 ${latestEvent.verdict === 'BLOCKED' ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' :
                                            latestEvent.verdict === 'ALLOWED' ? 'bg-emerald-500' : 'bg-amber-500'
                                            }`} />
                                        <div>
                                            <div className="text-xs font-black text-white uppercase tracking-tight">{latestEvent.action.replace('_', ' ')}</div>
                                            <div className="text-[10px] text-muted font-bold mb-1">
                                                {latestEvent.verdict} • Score: {latestEvent.score}
                                            </div>
                                            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                                Just now (Live)
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : null}

                            {initialEvents.slice(0, latestEvent ? 3 : 4).map((event) => (
                                <div key={event.id} className="flex gap-4 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                                    <div className={`w-1 h-10 rounded-full flex-shrink-0 ${event.verdict === 'BLOCKED' ? 'bg-rose-500' :
                                        event.verdict === 'ALLOWED' ? 'bg-emerald-500' : 'bg-amber-500'
                                        }`} />
                                    <div>
                                        <div className="text-xs font-bold text-white uppercase tracking-tight">{event.actionType.replace('_', ' ')}</div>
                                        <div className="text-[10px] text-muted font-medium mb-1">
                                            {event.verdict} • Score: {event.riskScore}
                                        </div>
                                        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                            {formatDistanceToNow(new Date(event.createdAt))} ago
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendations / Active Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-secondary/40 border border-white/5 rounded-[40px] p-8">
                    <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-primary" /> Risk Mitigation Tasks
                    </h3>
                    <div className="space-y-4">
                        <TaskItem
                            label="Branch 'feature-gateway' needs sync"
                            priority="Medium"
                            status="Pending"
                        />
                        <TaskItem
                            label="Verify Database MFA for Production"
                            priority="High"
                            status="Action Required"
                            urgent
                        />
                        <TaskItem
                            label="Update Post-Deploy checklist Alpha"
                            priority="Low"
                            status="Sync Needed"
                        />
                    </div>
                </div>

                <div className="bg-secondary/40 border border-white/5 rounded-[40px] p-8">
                    <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                        <Zap className="w-5 h-5 text-primary" /> Engine Insights
                    </h3>
                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 space-y-4">
                        <p className="text-sm text-zinc-300 leading-relaxed italic">
                            "Team fatigue levels typically peak at **Friday 15:45**. Assure recommends enabling 'Manual Handshake' for all production deployments during this window."
                        </p>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Confidence: 94%</span>
                            <button className="text-xs font-bold text-white hover:text-primary transition-colors flex items-center gap-1 group">
                                Apply Policy <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { AnimatePresence } from "framer-motion";

function StatCard({ title, value, trend, icon, color }: any) {
    return (
        <div className="p-6 rounded-3xl bg-secondary/40 border border-white/5 hover:border-primary/20 transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <div className="text-[10px] text-muted font-bold tracking-[0.2em]">{trend}</div>
            </div>
            <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1">{title}</h4>
            <div className={`text-4xl font-black ${color} tracking-tighter`}>{value}</div>
        </div>
    );
}

function TaskItem({ label, priority, status, urgent = false }: any) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
            <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${urgent ? "bg-rose-500 animate-pulse" : "bg-primary"}`} />
                <div>
                    <div className="text-sm font-bold text-white mb-0.5">{label}</div>
                    <div className="text-[10px] font-bold text-muted uppercase tracking-widest">{priority} Priority</div>
                </div>
            </div>
            <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md ${urgent ? "bg-rose-500/20 text-rose-500" : "bg-white/5 text-muted"}`}>
                {status}
            </div>
        </div>
    );
}
