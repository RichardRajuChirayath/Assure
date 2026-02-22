"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Search, Hash, Clock, Database, ExternalLink, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export function AuditVerifyClient({ initialId = "" }: { initialId?: string }) {
    const [anchorId, setAnchorId] = useState(initialId);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Auto-verify if an ID is passed in the URL
    useState(() => {
        if (initialId) {
            // Give the UI a split second to render first
            setTimeout(() => executeVerify(initialId), 100);
        }
    });

    const executeVerify = async (idToVerify: string) => {
        if (!idToVerify) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Real call to our bridge API which talks to Polygon
            const response = await fetch(`/api/verify-on-chain?id=${idToVerify}`);
            const data = await response.json();

            if (response.ok) {
                setResult(data);
            } else {
                setError(data.error || "Anchor ID not found on-chain. Please check the ID and try again.");
            }
        } catch (err) {
            setError("Failed to connect to blockchain node.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        await executeVerify(anchorId);
    };

    return (
        <div className="space-y-8">
            <div className="max-w-xl">
                <h1 className="text-3xl font-bold text-white mb-2">Integrity Verification</h1>
                <p className="text-zinc-400">
                    Verify the mathematical integrity of any audit log entry by fetching its hash
                    directly from the Polygon Amoy testnet.
                </p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <form onSubmit={handleVerify} className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Enter On-Chain Anchor ID (e.g. 142)"
                            className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            value={anchorId}
                            onChange={(e) => setAnchorId(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2"
                    >
                        {loading ? "Verifying..." : "Verify on Polygon"}
                    </button>
                </form>
            </div>

            <AnimatePresence mode="wait">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-center gap-3 text-red-400"
                    >
                        <AlertCircle className="h-5 w-5" />
                        {error}
                    </motion.div>
                )}

                {result && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {/* Status Card */}
                        <div className="bg-green-500/5 border border-green-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                            <div className="h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                                <ShieldCheck className="h-10 w-10 text-green-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Cryptographically Verified</h2>
                            <p className="text-zinc-400 text-sm max-w-xs">
                                The log entry matches the hash anchored on the blockchain.
                                It is immutable and has not been tampered with.
                            </p>
                        </div>

                        {/* Details Card */}
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
                            <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Technical Proof</h3>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Hash className="h-4 w-4 text-purple-400" />
                                    <div>
                                        <p className="text-xs text-zinc-500 mb-0.5">Root Hash (Keccak256)</p>
                                        <p className="text-sm font-mono text-white truncate w-64">{result.rootHash}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Clock className="h-4 w-4 text-blue-400" />
                                    <div>
                                        <p className="text-xs text-zinc-500 mb-0.5">Timestamp (On-Chain)</p>
                                        <p className="text-sm text-white">{format(result.timestamp * 1000, "PPP pp")}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Database className="h-4 w-4 text-emerald-400" />
                                    <div>
                                        <p className="text-xs text-zinc-500 mb-0.5">Batch Metadata</p>
                                        <p className="text-sm text-white">{result.metadata}</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 py-2 rounded-lg transition-colors">
                                View on Explorer <ExternalLink className="h-3 w-3" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
