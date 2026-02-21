"use client";

import { motion } from "framer-motion";
import { XCircle, Clock, Database, Globe } from "lucide-react";

const problems = [
    {
        icon: <Database className="w-6 h-6 text-primary" />,
        title: "Wrong Env Variables",
        description: "Accidentally pointing to Staging DB in a Production deploy. A classic, costly error."
    },
    {
        icon: <Clock className="w-6 h-6 text-primary" />,
        title: "The Rushed Deploy",
        description: "Skipping local tests because there's a 'hotfix' needed. 2 minutes saved, 2 hours of downtime."
    },
    {
        icon: <XCircle className="w-6 h-6 text-primary" />,
        title: "Missing Approvals",
        description: "Executing a sensitive script before the senior team has reviewed the impact."
    },
    {
        icon: <Globe className="w-6 h-6 text-primary" />,
        title: "Forgotten Steps",
        description: "Manual steps in a playbook that a tired human skipped. Not caught by any automated test."
    }
];

export function Problem() {
    return (
        <section id="problem" className="py-24 px-6 bg-secondary">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        className="text-3xl md:text-5xl font-black mb-4 tracking-tighter text-white"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {"Most failures aren't exotic bugs.".split(" ").map((word, i) => (
                            <motion.span
                                key={i}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                transition={{ duration: 0.5, delay: i * 0.05 }}
                                className="inline-block mr-[0.2em]"
                            >
                                {word}
                            </motion.span>
                        ))}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-muted text-lg font-light"
                    >
                        They're boring, human mistakes that tools miss.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {problems.map((problem, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-8 rounded-2xl border border-white/5 bg-background hover:border-primary/30 transition-all group cursor-default"
                        >
                            <div className="mb-4 p-3 rounded-xl bg-secondary w-fit group-hover:scale-110 transition-transform">
                                {problem.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white">{problem.title}</h3>
                            <p className="text-sm text-muted leading-relaxed">{problem.description}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 p-8 rounded-3xl border-2 border-dashed border-white/5 text-center">
                    <p className="text-muted italic font-medium opacity-60">"Existing tools catch errors after damage. Assure prevents the damage entirely."</p>
                </div>
            </div>
        </section>
    );
}
