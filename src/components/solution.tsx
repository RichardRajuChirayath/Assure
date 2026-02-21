"use client";

import { motion } from "framer-motion";
import { Brain, FileCheck, ShieldCheck, BarChart3, XCircle, AlertCircle } from "lucide-react";

const solutions = [
    {
        icon: <Brain className="w-8 h-8 text-primary" />,
        title: "Context-Aware Logic",
        description: "It knows if you're deploying to Production on a Friday or a Monday. It knows which files you changed and suggests specific checks."
    },
    {
        icon: <FileCheck className="w-8 h-8 text-primary" />,
        title: "Dynamic Checklists",
        description: "No more static PDFs. Your checklists evolve based on past failures and team history."
    },
    {
        icon: <BarChart3 className="w-8 h-8 text-primary" />,
        title: "Predictive Risk Scoring",
        description: "Get a real-time risk score before every action. If the score is too high, it requires a 'Second Pair of Eyes'."
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-primary" />,
        title: "The Prevention Audit Trail",
        description: "Keep a log not just of what happened, but what was *stopped*. Perfect for compliance and learning."
    }
];

export function Solution() {
    return (
        <section id="solution" className="py-24 px-6 overflow-hidden bg-secondary/50">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <span className="text-primary font-semibold mb-4 block uppercase tracking-widest text-xs">The Solution</span>
                        <h2 className="text-4xl md:text-6xl font-black mb-8 gradient-text tracking-tighter">
                            {"Wait. Think. Then Execute.".split(" ").map((word, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.05 }}
                                    className="inline-block mr-[0.2em]"
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </h2>
                        <p className="text-muted text-lg mb-10 leading-relaxed max-w-xl font-light">
                            Assure acts as a guardrail layer. It doesn't stop you from doing your job; it ensures you do it safely when the stakes are highest.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {solutions.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="mb-4">{item.icon}</div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1 text-white">{item.title}</h3>
                                        <p className="text-muted text-xs leading-relaxed">{item.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-1/2 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="relative p-8 rounded-3xl border border-white/5 bg-secondary shadow-2xl overflow-hidden"
                        >
                            {/* Data Beam Effect */}
                            <motion.div
                                initial={{ top: "-100%" }}
                                animate={{ top: "200%" }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute left-1/2 -translate-x-1/2 w-px h-1/2 bg-gradient-to-b from-transparent via-primary/50 to-transparent z-0"
                            />

                            <div className="absolute top-0 right-0 p-4">
                                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full text-[10px] font-bold uppercase tracking-wider">Active Guardrail</div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                                    <Brain className="w-5 h-5 text-primary" />
                                    <div className="text-xs">
                                        <div className="text-muted uppercase tracking-[0.2em] mb-1 font-bold">Risk Context</div>
                                        <div className="text-white font-bold">Deploying AWS Infrastructure</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-[10px] text-muted font-bold uppercase tracking-widest">Predicted Potential Mistakes</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-2 rounded-lg bg-rose-500/5 border border-rose-500/10 text-[10px] text-rose-500 flex items-center gap-2">
                                            <XCircle className="w-3 h-3" /> Cost Overrun
                                        </div>
                                        <div className="p-2 rounded-lg bg-primary/5 border border-primary/10 text-[10px] text-primary flex items-center gap-2">
                                            <AlertCircle className="w-3 h-3" /> Potential Regress
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5">
                                    <div className="text-[10px] text-muted mb-4 tracking-widest uppercase font-bold">Required Checklist</div>
                                    <div className="space-y-3">
                                        {[
                                            "No hardcoded secrets in TF files?",
                                            "Terraform plan reviewed manually?",
                                            "Is it during maintenance window?",
                                        ].map((step, i) => (
                                            <div key={i} className="flex items-center justify-between text-xs text-muted">
                                                <span>{step}</span>
                                                <div className="w-4 h-4 rounded border border-white/10 bg-black" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
