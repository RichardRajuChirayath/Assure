"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { History, ShieldAlert, CheckCircle2, Zap, User, Fingerprint, Lock, AlertTriangle } from "lucide-react";
import { anchorAuditLogs } from "@/lib/actions";
import { formatDistanceToNow } from "date-fns";

interface AuditClientProps {
    auditLogs: any[];
    riskEvents: any[];
}

export function AuditClient({ auditLogs, riskEvents }: AuditClientProps) {
    const [anchoring, setAnchoring] = useState(false);
    const [anchorResult, setAnchorResult] = useState<string | null>(null);

    async function handleAnchor() {
        setAnchoring(true);
        try {
            const result = await anchorAuditLogs();
            setAnchorResult(result.message);
            // Refresh the page to show new entries
            setTimeout(() => window.location.reload(), 2000);
        } catch (err) {
            setAnchorResult("Anchoring failed. Check server logs.");
        } finally {
            setAnchoring(false);
        }
    }

    // Merge: show audit logs if they exist, otherwise show raw risk events
    const displayData = auditLogs.length > 0 ? auditLogs : riskEvents;
    const isAuditView = auditLogs.length > 0;

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                        Engine <span className="text-primary">Audit Log</span>
                    </h2>
                    <p className="text-muted text-sm mt-1">
                        Immutable record of all intercepted actions and engine verdicts.
                    </p>
                </div>
                <button
                    onClick={handleAnchor}
                    disabled={anchoring}
                    className="px-6 py-3 bg-indigo-600 text-white font-black rounded-xl hover:scale-105 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2 disabled:opacity-50"
                >
                    <Lock className="w-4 h-4" />
                    {anchoring ? "Anchoring..." : "Anchor to Blockchain"}
                </button>
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

            {/* Table */}
            <div className="bg-secondary/40 border border-white/5 rounded-[32px] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="px-6 py-4 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Timestamp</th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Event</th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Operator</th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Verdict</th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Risk</th>
                                <th className="px-6 py-4 text-[10px] font-black text-muted uppercase tracking-[0.2em]">Integrity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {displayData.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-zinc-500 italic">
                                        No forensic data yet. Use the Simulator to generate risk events first.
                                    </td>
                                </tr>
                            ) : isAuditView ? (
                                auditLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="text-sm font-bold text-white">
                                                {formatDistanceToNow(new Date(log.createdAt))} ago
                                            </div>
                                            <div className="text-[10px] text-zinc-500 font-mono">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                                                    <Zap className="w-4 h-4 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-white uppercase tracking-tight">
                                                        {log.event}
                                                    </div>
                                                    <div className="text-[10px] text-muted max-w-xs truncate italic">
                                                        {log.details}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                                                    <User className="w-3 h-3 text-muted" />
                                                </div>
                                                <span className="text-xs text-white">
                                                    {log.riskEvent?.user?.name || "System"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <VerdictBadge verdict={log.event.split(":")[0]} />
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${(log.riskEvent?.riskScore ?? 0) > 70 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                                        style={{ width: `${log.riskEvent?.riskScore ?? 0}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-black text-white">
                                                    {log.riskEvent?.riskScore ?? "-"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {log.blockchainHash ? (
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                                    <Fingerprint className="w-3 h-3 text-emerald-500" />
                                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                                        Anchored
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                                                    <Lock className="w-3 h-3 text-zinc-500" />
                                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                                        Pending
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                // Fallback: show raw risk events
                                riskEvents.map((event) => (
                                    <tr key={event.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="text-sm font-bold text-white">
                                                {formatDistanceToNow(new Date(event.createdAt))} ago
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-sm font-black text-white uppercase">
                                                {event.actionType.replace("_", " ")}
                                            </div>
                                            <div className="text-[10px] text-muted italic">{event.reasoning}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs text-white">{event.user?.name || "System"}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <VerdictBadge verdict={event.verdict} />
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-black text-white">{event.riskScore}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 inline-flex items-center gap-2">
                                                <AlertTriangle className="w-3 h-3 text-amber-500" />
                                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                                                    Not Logged
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <History className="w-5 h-5 text-indigo-400" />
                    <p className="text-xs text-indigo-200/60 font-medium">
                        Audit logs are append-only. Click <span className="text-indigo-400 font-bold">"Anchor to Blockchain"</span> to hash and submit a batch to the Polygon testnet.
                    </p>
                </div>
                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-1">
                    Integrity Protocol <Fingerprint className="w-3 h-3" />
                </div>
            </div>
        </div>
    );
}

function VerdictBadge({ verdict }: { verdict: string }) {
    const v = verdict.trim().toUpperCase();
    if (v === "BLOCKED") {
        return (
            <div className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-lg inline-flex items-center gap-2">
                <ShieldAlert className="w-3 h-3 text-rose-500" />
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Blocked</span>
            </div>
        );
    }
    if (v === "ALLOWED") {
        return (
            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg inline-flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Safe Patch</span>
            </div>
        );
    }
    if (v === "OVERRIDDEN") {
        return (
            <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg inline-flex items-center gap-2">
                <Zap className="w-3 h-3 text-amber-500" />
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Overridden</span>
            </div>
        );
    }
    return null;
}
