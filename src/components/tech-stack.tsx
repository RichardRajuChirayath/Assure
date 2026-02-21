"use client";

import { motion } from "framer-motion";
import {
    Layout,
    Server,
    Database as DbIcon,
    BrainCircuit,
    Code2,
    Zap,
    ShieldCheck,
    Globe,
    Cpu,
    Workflow,
    Lock,
    Search
} from "lucide-react";

const techStack = [
    {
        category: "The Interface",
        sub: "Frontend Architecture",
        icon: <Layout className="w-5 h-5" />,
        color: "text-blue-400",
        items: [
            { name: "Next.js 16", desc: "Core Framework" },
            { name: "Tailwind CSS", desc: "Styling Engine" },
            { name: "D3 & Recharts", desc: "Data Viz" },
            { name: "shadcn/ui", desc: "Component System" },
            { name: "WebSockets", desc: "Real-time Sync" }
        ]
    },
    {
        category: "The Core",
        sub: "Backend & APIs",
        icon: <Server className="w-5 h-5" />,
        color: "text-purple-400",
        items: [
            { name: "Node.js (Fastify)", desc: "High Perf Runtime" },
            { name: "OAuth 2.0 / JWT", desc: "Security Layer" },
            { name: "Zod", desc: "Schema Validation" },
            { name: "FastAPI", desc: "Python Bridge" },
            { name: "Vercel Edge", desc: "Deployment" }
        ]
    },
    {
        category: "The Memory",
        sub: "Storage & Persistence",
        icon: <DbIcon className="w-5 h-5" />,
        color: "text-emerald-400",
        items: [
            { name: "PostgreSQL", desc: "Primary Database" },
            { name: "Prisma", desc: "Type-safe ORM" },
            { name: "Redis Cache", desc: "Near-zero Latency" },
            { name: "Prisma Accelerate", desc: "Connection Pooling" }
        ]
    },
    {
        category: "The Intelligence",
        sub: "AI / ML & Risk Engine",
        icon: <BrainCircuit className="w-5 h-5" />,
        color: "text-rose-400",
        items: [
            { name: "Python / FastAPI", desc: "ML Services" },
            { name: "XGBoost & Scikit", desc: "Modeling" },
            { name: "Isolation Forest", desc: "Anomaly Detection" },
            { name: "SHAP", desc: "AI Explainability" },
            { name: "ONNX Runtime", desc: "Fast Inference" },
            { name: "YAML Policy Engine", desc: "Edge Logic" }
        ]
    }
];

export function TechStack() {
    return (
        <section id="tech-stack" className="py-24 px-6 bg-[#030308] relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Production-Grade Infrastructure</span>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
                            Built for <span className="gradient-text">Zero Compromise</span>.
                        </h2>
                        <p className="text-muted text-lg max-w-2xl mx-auto font-light leading-relaxed">
                            Assure is engineered with the most modern, scalable, and secure technologies available today.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {techStack.map((category, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group p-8 rounded-[32px] border border-white/5 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`p-3 rounded-2xl bg-white/5 ${category.color} group-hover:scale-110 transition-transform duration-500`}>
                                    {category.icon}
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">{category.category}</h3>
                                    <p className="text-xs text-muted font-bold tracking-tight">{category.sub}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {category.items.map((item, i) => (
                                    <div key={i} className="flex flex-col gap-1 relative pl-4 border-l border-white/5 group/item hover:border-primary/50 transition-colors">
                                        <div className="text-sm font-black text-white group-hover/item:text-primary transition-colors">{item.name}</div>
                                        <div className="text-[10px] text-muted font-bold uppercase tracking-widest">{item.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Technical Badges */}
                <div className="mt-20 flex flex-wrap justify-center gap-4 md:gap-12 opacity-40">
                    <Badge icon={<ShieldCheck className="w-4 h-4" />} text="Enterprise Security" />
                    <Badge icon={<Zap className="w-4 h-4" />} text="99.99% Reliability" />
                    <Badge icon={<Workflow className="w-4 h-4" />} text="AI-Driven Prevention" />
                    <Badge icon={<Globe className="w-4 h-4" />} text="Global Edge Network" />
                </div>
            </div>
        </section>
    );
}

function Badge({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-[0.2em]">
            <span className="text-primary">{icon}</span>
            {text}
        </div>
    );
}
