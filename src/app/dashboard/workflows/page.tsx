"use client";

import { useState } from "react";
import { createWorkflow } from "@/lib/actions";
import { ShieldCheck, Plus, Terminal, Database, Server, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WorkflowsPage() {
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        try {
            await createWorkflow(formData);
            setIsCreating(false);
            // In a real app, you'd use revalidatePath or update local state
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Failed to create workflow. Is your user synced in the database?");
        } finally {
            setLoading(false);
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
            </AnimatePresence>

            {/* Empty State / Placeholder for List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WorkflowCard
                    name="Global API Guardian"
                    type="DEPLOY"
                    status="ACTIVE"
                    checks={12}
                    lastRun="2m ago"
                />
                <WorkflowCard
                    name="DB Migration Shield"
                    type="DATABASE"
                    status="ACTIVE"
                    checks={5}
                    lastRun="1h ago"
                />
            </div>
        </div>
    );
}

function WorkflowCard({ name, type, status, checks, lastRun }: any) {
    const Icon = type === "DEPLOY" ? Server : type === "DATABASE" ? Database : Terminal;

    return (
        <div className="p-8 rounded-[32px] bg-secondary/40 border border-white/5 hover:border-primary/20 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon className="w-24 h-24" />
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                        <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{status}</span>
                    </div>
                </div>

                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">{name}</h3>
                <div className="flex items-center gap-6 text-[10px] font-bold text-muted uppercase tracking-widest">
                    <span className="flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-primary" /> {checks} Safety Checks</span>
                    <span className="flex items-center gap-2"><Plus className="w-3 h-3" /> Last run: {lastRun}</span>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                    <button className="text-xs font-bold text-white hover:text-primary transition-colors flex items-center gap-1 group/btn">
                        Manage Workflow <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
