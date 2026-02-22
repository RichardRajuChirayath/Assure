"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, ShieldAlert, CheckCircle2, Zap, User, Fingerprint, Lock, AlertTriangle, Terminal, ChevronDown, ChevronUp, Info, Plus, ExternalLink, ShieldCheck, Loader2 } from "lucide-react";
import { anchorAuditLogs } from "@/lib/actions";
import { formatDistanceToNow, format } from "date-fns";
import { getExplorerUrl } from "@/lib/blockchain";

interface AuditClientProps {
    auditLogs: any[];
    riskEvents: any[];
}

export function AuditClient({ auditLogs, riskEvents }: AuditClientProps) {
    const [anchoring, setAnchoring] = useState(false);
    const [anchorResult, setAnchorResult] = useState<string | null>(null);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Build a unified audit log from riskEvents (the real source of truth)
    const anchorMap = new Map<string, any>();
    auditLogs.forEach((log) => {
        if (log.riskEventId) {
            anchorMap.set(log.riskEventId, log);
        }
    });

    const pendingCount = riskEvents.filter(e => !anchorMap.has(e.id)).length;

    // Auto-Sync Background Routine
    useEffect(() => {
        if (pendingCount > 0 && !anchoring) {
            console.log(`[Integrity] Detected ${pendingCount} pending logs. Initiating background sync...`);
            handleManualSync();
        }
    }, [pendingCount]);

    async function handleManualSync() {
        setAnchoring(true);
        try {
            const result = await anchorAuditLogs();
            setAnchorResult(result.message);
            setTimeout(() => window.location.reload(), 2000);
        } catch (err) {
            setAnchorResult("Sync failed. Check connection.");
        } finally {
            setAnchoring(false);
        }
    }

    const toggleRow = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    if (!isMounted) return <div className="min-h-screen animate-pulse bg-secondary/20 rounded-[40px]" />;

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                        Forensic <span className="text-primary">Ledger v3.0</span>
                    </h2>
                    <p className="text-muted text-xs font-bold uppercase tracking-widest mt-1">
                        Phase 3 Intelligence: Neural Intent & Immutable Proof Online.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {pendingCount > 0 ? (
                        <button
                            onClick={handleManualSync}
                            disabled={anchoring}
                            className="px-6 py-3 bg-white/5 border border-white/10 text-white font-black rounded-xl hover:bg-white/10 transition-all flex items-center gap-3 disabled:opacity-50 text-xs"
                        >
                            {anchoring ? <Loader2 className="w-3 h-3 animate-spin" /> : <Lock className="w-3 h-3 text-amber-500" />}
                            Sync {pendingCount} Pending Logs
                        </button>
                    ) : (
                        <div className="px-5 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Autonomous Sync Active</span>
                        </div>
                    )}
                </div>
            </div>

            {anchorResult && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-sm text-indigo-300 font-medium"
                >
                    {anchorResult}
                </motion.div>
            )}

            <div className="bg-secondary/40 border border-white/5 rounded-[32px] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/10">
                                <th className="px-6 py-5 text-[10px] font-black text-muted uppercase tracking-[0.2em] w-12"></th>
                                <th className="px-6 py-5 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Timestamp</th>
                                <th className="px-6 py-5 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Event Forensics</th>
                                <th className="px-6 py-5 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Operator</th>
                                <th className="px-6 py-5 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Verdict</th>
                                <th className="px-6 py-5 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Risk</th>
                                <th className="px-6 py-5 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Provenance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {riskEvents.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="p-4 rounded-full bg-white/5">
                                                <Terminal className="w-10 h-10 text-zinc-700" />
                                            </div>
                                            <div>
                                                <p className="text-md font-black text-zinc-500 uppercase tracking-widest">No Intelligence Logs</p>
                                                <p className="text-xs text-zinc-600 mt-2 italic max-w-sm mx-auto">
                                                    Infrastructure is silent. Execute preflight commands to generate forensic data.
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                riskEvents.map((event) => {
                                    const anchorLog = anchorMap.get(event.id);
                                    const isExpanded = expandedRow === event.id;
                                    const source = event.actionType === "CLI_COMMAND" ? "CLI" :
                                        (event.context as any)?.source === "dashboard" ? "Dashboard" : "API";

                                    const reasons = event.reasoning ? event.reasoning.split(" | ") : [];
                                    const breakdown = (event.context as any)?.breakdown;

                                    return (
                                        <React.Fragment key={event.id}>
                                            <tr
                                                className={`hover:bg-white/[0.03] transition-colors cursor-pointer ${isExpanded ? 'bg-white/[0.03]' : ''}`}
                                                onClick={() => toggleRow(event.id)}
                                            >
                                                <td className="px-6 py-6 text-center">
                                                    {isExpanded ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="text-sm font-black text-white">
                                                        {formatDistanceToNow(new Date(event.createdAt))} ago
                                                    </div>
                                                    <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-tighter">
                                                        {format(new Date(event.createdAt), 'HH:mm:ss.SS')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-2.5 rounded-xl border ${source === "CLI" ? "bg-emerald-500/10 border-emerald-500/20" : "bg-primary/10 border-primary/20"
                                                            }`}>
                                                            {source === "CLI" ? (
                                                                <Terminal className="w-5 h-5 text-emerald-500" />
                                                            ) : (
                                                                <Zap className="w-5 h-5 text-primary" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-3">
                                                                {event.actionType.replace(/_/g, " ")}
                                                                <span className={`text-[8px] px-2 py-0.5 rounded-full font-black ${source === "CLI" ? "bg-emerald-500/20 text-emerald-500" : "bg-primary/20 text-primary"
                                                                    }`}>
                                                                    {source}
                                                                </span>
                                                            </div>
                                                            <div className="text-[10px] text-muted max-w-xs truncate font-medium mt-1">
                                                                {reasons[0] || "No anomalies flagged"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
                                                            <User className="w-3.5 h-3.5 text-indigo-400" />
                                                        </div>
                                                        <span className="text-xs font-bold text-zinc-300">
                                                            {event.user?.name || "System Auth"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <VerdictBadge verdict={event.verdict} />
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                            <div
                                                                className={`h-full ${event.riskScore > 70 ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : event.riskScore > 40 ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'}`}
                                                                style={{ width: `${Math.min(event.riskScore, 100)}%` }}
                                                            />
                                                        </div>
                                                        <span className={`text-md font-black font-mono ${event.riskScore > 70 ? 'text-rose-500' : event.riskScore > 40 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                                            {Math.round(event.riskScore)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    {anchorLog?.blockchainHash ? (
                                                        <a
                                                            href={getExplorerUrl(anchorLog.blockchainHash)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                                                        >
                                                            <Fingerprint className="w-3 h-3 text-emerald-500" />
                                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.1em]">
                                                                Verified
                                                            </span>
                                                            <ExternalLink className="w-2.5 h-2.5 text-emerald-500/50 group-hover:text-emerald-500 transition-colors" />
                                                        </a>
                                                    ) : (
                                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 opacity-40">
                                                            <Loader2 className="w-3 h-3 text-zinc-500 animate-spin" />
                                                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                                                Syncing
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.tr
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="bg-black/20"
                                                    >
                                                        <td colSpan={7} className="px-8 py-10">
                                                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                                                <div className="lg:col-span-7 space-y-8">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="p-2 rounded-lg bg-primary/10">
                                                                            <ShieldCheck className="w-4 h-4 text-primary" />
                                                                        </div>
                                                                        <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Forensic Reconstruction</h4>
                                                                    </div>

                                                                    {/* FORMULA VIEW */}
                                                                    {breakdown && (
                                                                        <div className="p-8 rounded-[38px] bg-black/40 border border-white/5 relative overflow-hidden">
                                                                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                                                                <Zap className="w-12 h-12 text-primary" />
                                                                            </div>
                                                                            <div className="flex items-center justify-center flex-wrap gap-y-10">
                                                                                <FormulaNode label="Rules Matrix" value={breakdown.rules} color="text-amber-400" />
                                                                                <OperatorNode />
                                                                                <FormulaNode label="ML Boost" value={breakdown.ml_boost} color="text-indigo-400" />
                                                                                <OperatorNode />
                                                                                <FormulaNode label="Anomaly" value={breakdown.anomaly_penalty} color="text-rose-400" />
                                                                                <div className="mx-8 text-white/20 font-black text-2xl leading-none">=</div>
                                                                                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[8px] font-mono text-zinc-600">
                                                                                    TRACE_ID: {event.id.substring(0, 12).toUpperCase()}
                                                                                </div>
                                                                                <div className="px-6 py-4 rounded-3xl bg-white/[0.03] border border-white/10">
                                                                                    <div className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">Score</div>
                                                                                    <div className="text-2xl font-black font-mono text-white">
                                                                                        {Math.round(event.riskScore)}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    <div className="space-y-3">
                                                                        {reasons.map((reason: string, i: number) => (
                                                                            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all">
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_#7c69ef] mt-1.5 flex-shrink-0" />
                                                                                <p className="text-xs text-zinc-300 font-bold uppercase tracking-tight leading-relaxed">
                                                                                    {reason}
                                                                                </p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div className="lg:col-span-5 space-y-6">
                                                                    <div className="flex items-center gap-3 text-[10px] font-black text-muted uppercase tracking-[0.3em]">
                                                                        <Fingerprint className="w-3.5 h-3.5" /> Immutable Fingerprint
                                                                    </div>

                                                                    <div className="p-6 rounded-3xl bg-black/40 border border-white/5 space-y-6">
                                                                        <div className="grid grid-cols-2 gap-6">
                                                                            <MetadataItem label="Environment" value={(event.context as any)?.environment || "Production"} />
                                                                            <MetadataItem label="Confidence" value={`${Math.round((event.context as any)?.ml_confidence * 100 || 0)}%`} />
                                                                            <MetadataItem label="Action ID" value={event.id.substring(0, 12).toUpperCase()} />
                                                                            <MetadataItem label="Sync Status" value={anchorLog?.blockchainHash ? "Anchored" : "Pending Sync"} />
                                                                        </div>

                                                                        {anchorLog?.blockchainHash && (
                                                                            <div className="pt-4 border-t border-white/5">
                                                                                <div className="text-[8px] font-black text-muted uppercase tracking-widest mb-2">Transaction Proof</div>
                                                                                <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 font-mono text-[9px] text-indigo-400 break-all select-all">
                                                                                    {anchorLog.blockchainHash}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        <div className="p-4 rounded-2xl bg-black/[0.2] border border-white/5 font-mono text-[9px] text-zinc-600 overflow-x-auto">
                                                                            <div className="text-emerald-500/40 mb-2 font-black tracking-widest uppercase text-[8px] flex items-center gap-2">
                                                                                <div className="w-1 h-1 rounded-full bg-emerald-500" /> context_stream
                                                                            </div>
                                                                            {JSON.stringify(event.context, null, 2)}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                )}
                                            </AnimatePresence>
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer */}
            <div className="p-8 rounded-[40px] bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="p-3 rounded-2xl bg-indigo-500/10">
                        <History className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">Blockchain Continuity Protocol</h4>
                        <p className="text-xs text-indigo-300/40 font-medium">
                            The Forensic Ledger is automatically synchronized with the <span className="text-indigo-400 font-bold">Polygon Amoy Testnet</span>.
                            Anchors occur in background threads to ensure zero-latency for system operators.
                        </p>
                    </div>
                </div>
                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-3">
                    Ledger Integrity <Fingerprint className="w-4 h-4 shadow-[0_0_10px_#818cf8]" />
                </div>
            </div>
        </div>
    );
}

function FormulaNode({ label, value, color }: { label: string; value: number | string; color: string }) {
    return (
        <div className="flex flex-col items-center min-w-[70px]">
            <span className="text-[7px] font-black text-muted uppercase tracking-[0.3em] mb-2">{label}</span>
            <span className={`text-md font-black font-mono tracking-tighter ${color}`}>{value}</span>
        </div>
    );
}

function OperatorNode() {
    return (
        <div className="mx-4 mt-4">
            <Plus className="w-4 h-4 text-zinc-700" />
        </div>
    );
}

function MetadataItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-1.5">
            <div className="text-[8px] font-black text-muted uppercase tracking-[0.2em]">{label}</div>
            <div className="text-[11px] font-bold text-white uppercase tracking-tight">{value}</div>
        </div>
    );
}

function VerdictBadge({ verdict }: { verdict: string }) {
    const v = verdict.trim().toUpperCase();
    if (v === "BLOCKED") {
        return (
            <div className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-xl inline-flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Intercepted</span>
            </div>
        );
    }
    if (v === "ALLOWED") {
        return (
            <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl inline-flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Cleared</span>
            </div>
        );
    }
    if (v === "OVERRIDDEN") {
        return (
            <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl inline-flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Override</span>
            </div>
        );
    }
    return null;
}
