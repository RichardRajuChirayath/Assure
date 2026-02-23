"use client";

import { useState, useEffect } from "react";
import { createWorkflow, getWorkflows, deleteWorkflow } from "@/lib/actions";
import { ShieldCheck, Plus, Terminal, Database, Server, ChevronRight, Loader2, Trash2, Info, Lock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

export default function WorkflowsPage() {
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [workflows, setWorkflows] = useState<any[]>([]);
    const [fetching, setFetching] = useState(true);
    const [showProtected, setShowProtected] = useState<string | null>(null);


    useEffect(() => {
        async function loadWorkflows() {
            try {
                const data = await getWorkflows();
                setWorkflows(data);
            } catch (error) {
                console.error("Failed to load workflows:", error);
            } finally {
                setFetching(false);
            }
        }
        loadWorkflows();
    }, []);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        try {
            await createWorkflow(formData);
            setIsCreating(false);
            const data = await getWorkflows();
            setWorkflows(data);
        } catch (error) {
            console.error(error);
            alert("Failed to create workflow.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to decommission this safety layer?")) return;
        try {
            await deleteWorkflow(id);
            setWorkflows(prev => prev.filter(wf => wf.id !== id));
        } catch (error) {
            console.error("Delete failed:", error);
        }
    }


    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Safety <span className="text-primary">Workflows</span></h2>
                    <p className="text-muted text-sm mt-1">Manage the intelligent checklists that guard your production units.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="px-6 py-3 bg-primary text-white font-black rounded-xl hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> New Workflow
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-3xl bg-primary/5 border border-primary/20 flex items-start gap-6"
            >
                <div className="p-3 rounded-2xl bg-primary/10">
                    <Info className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">In-Editor Enforcement</h4>
                    <p className="text-xs text-zinc-400 font-medium leading-relaxed italic">
                        Workflows convert your organizational safety policies into **Real-time Checklists**. When a developer triggers a protected action in VS Code, the engine pulls these rules to guide their decision-making process.
                    </p>
                </div>
            </motion.div>

            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
                    >
                        <div className="bg-secondary border border-white/10 p-8 rounded-[32px] w-full max-w-lg shadow-2xl">
                            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Create Safety Layer</h3>
                            <form action={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Workflow Name</label>
                                    <input
                                        name="name"
                                        required
                                        placeholder="e.g. Production Deployment Shield"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Action Type</label>
                                    <select
                                        name="type"
                                        className="w-full bg-[#0c0c16] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                                    >
                                        <option value="DEPLOY">📦 Deployment</option>
                                        <option value="DATABASE">💾 Database Migration</option>
                                        <option value="CONFIG">⚙️ Config Change</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Description (Optional)</label>
                                    <textarea
                                        name="description"
                                        rows={3}
                                        placeholder="What does this protect?"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreating(false)}
                                        className="flex-1 px-6 py-4 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-6 py-4 bg-primary text-white font-black rounded-xl hover:scale-105 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                                    >
                                        {loading ? "Initializing..." : "Activate Layer"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}

                {showProtected && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowProtected(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-[#0c0c16] border border-primary/30 p-10 rounded-[48px] w-full max-w-lg shadow-[0_0_100px_rgba(124,105,239,0.2)] text-center relative overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Lock className="w-40 h-40" />
                            </div>

                            <div className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                                <Lock className="w-10 h-10 text-primary" />
                            </div>

                            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter italic">Enterprise Protection</h3>
                            <p className="text-zinc-400 text-sm font-medium leading-relaxed mb-10">
                                This management console is protected by <span className="text-primary font-black uppercase">Multi-Sig Authentication</span>.
                                Elevated privileges are required to modify the criteria of <span className="text-white">"{showProtected}"</span>.
                            </p>

                            <button
                                onClick={() => setShowProtected(null)}
                                className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30 uppercase tracking-widest text-xs"
                            >
                                Acknowledge & Return
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {fetching ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4 text-muted italic">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    Synthesizing forensic workflows...
                </div>
            ) : workflows.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[40px] text-muted italic">
                    No safety workflows active. Create one to protect your production.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {workflows.map((wf) => (
                        <WorkflowCard
                            key={wf.id}
                            id={wf.id}
                            name={wf.name}
                            type={wf.type}
                            status={wf.status}
                            checks={wf.type === "DEPLOY" ? 12 : wf.type === "DATABASE" ? 5 : 8}
                            lastRun={wf.updatedAt ? `${formatDistanceToNow(new Date(wf.updatedAt))} ago` : "Never"}
                            onDelete={handleDelete}
                            onManage={() => setShowProtected(wf.name)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function WorkflowCard({ id, name, type, status, checks, lastRun, onDelete, onManage }: any) {
    const Icon = type === "DEPLOY" ? Server : type === "DATABASE" ? Database : Terminal;

    return (
        <div className="p-8 rounded-[32px] bg-secondary/40 border border-white/5 hover:border-primary/20 transition-all group relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon className="w-24 h-24 text-primary" />
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onDelete(id)}
                            className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                            title="Delete Workflow"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full h-fit self-center">
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{status}</span>
                        </div>
                    </div>
                </div>

                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight italic">{name}</h3>
                <div className="flex items-center gap-6 text-[10px] font-bold text-muted uppercase tracking-widest">
                    <span className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-primary" /> {checks} Safety Checks</span>
                    <span className="flex items-center gap-3"><Plus className="w-3 h-3 opacity-20" /> Last run: {lastRun}</span>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                    <button
                        onClick={onManage}
                        className="text-xs font-bold text-white hover:text-primary transition-colors flex items-center gap-1 group/btn px-4 py-2 rounded-xl border border-white/5 hover:border-primary/20"
                    >
                        Manage Workflow <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
