"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { TrendingUp, PieChart as PieIcon, BarChart3 } from "lucide-react";
import { SafetyScorecards } from "@/components/safety-scorecards";

interface AnalyticsClientProps {
    trendData: { index: number; score: number; time: string; verdict: string }[];
    verdictData: { name: string; value: number; fill: string }[];
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-[#0a0a1a] border border-white/10 rounded-xl p-3 shadow-xl">
                <p className="text-xs font-black text-white">Score: {data.score}</p>
                <p className="text-[10px] text-muted uppercase">{data.verdict}</p>
                <p className="text-[10px] text-zinc-500">{format(new Date(data.time), 'Pp')}</p>
            </div>
        );
    }
    return null;
};

export function AnalyticsClient({ trendData, verdictData }: AnalyticsClientProps) {
    const totalEvents = verdictData.reduce((a, b) => a + b.value, 0);
    const avgScore = trendData.length > 0
        ? Math.round(trendData.reduce((a, b) => a + b.score, 0) / trendData.length)
        : 0;
    const maxScore = trendData.length > 0 ? Math.max(...trendData.map(d => d.score)) : 0;

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                    Risk <span className="text-primary">Analytics</span>
                </h2>
                <p className="text-muted text-sm mt-1">Real-time intelligence from the Assure engine.</p>
            </div>

            {/* Quick Stat Chips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="p-5 rounded-2xl bg-secondary/40 border border-white/5">
                    <div className="text-[10px] text-muted font-black uppercase tracking-[0.2em] mb-2">Total Events</div>
                    <div className="text-3xl font-black text-white">{totalEvents}</div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="p-5 rounded-2xl bg-secondary/40 border border-white/5">
                    <div className="text-[10px] text-muted font-black uppercase tracking-[0.2em] mb-2">Avg Risk Score</div>
                    <div className="text-3xl font-black text-blue-400">{avgScore}<span className="text-lg text-muted">/100</span></div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="p-5 rounded-2xl bg-secondary/40 border border-white/5">
                    <div className="text-[10px] text-muted font-black uppercase tracking-[0.2em] mb-2">Peak Risk</div>
                    <div className="text-3xl font-black text-rose-400">{maxScore}<span className="text-lg text-muted">/100</span></div>
                </motion.div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Area Chart — Risk Trend */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    className="lg:col-span-8 bg-secondary/40 border border-white/5 rounded-[32px] p-8">
                    <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-primary" /> Risk Score Trend
                    </h3>
                    {trendData.length === 0 ? (
                        <div className="h-[300px] flex items-center justify-center text-zinc-500 italic text-sm">
                            No data yet. Execute commands via CLI or Dashboard to populate the chart.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7c69ef" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#7c69ef" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="index" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} />
                                <YAxis domain={[0, 100]} tick={{ fill: '#555', fontSize: 10 }} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#7c69ef"
                                    strokeWidth={2}
                                    fill="url(#scoreGradient)"
                                    dot={{ r: 3, fill: '#7c69ef', strokeWidth: 0 }}
                                    activeDot={{ r: 6, fill: '#7c69ef', stroke: '#fff', strokeWidth: 2 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </motion.div>

                {/* Pie Chart — Verdict Distribution */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                    className="lg:col-span-4 bg-secondary/40 border border-white/5 rounded-[32px] p-8">
                    <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                        <PieIcon className="w-5 h-5 text-primary" /> Verdicts
                    </h3>
                    {totalEvents === 0 ? (
                        <div className="h-[300px] flex items-center justify-center text-zinc-500 italic text-sm">
                            No verdicts yet.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={verdictData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    strokeWidth={0}
                                >
                                    {verdictData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Legend
                                    verticalAlign="bottom"
                                    formatter={(value: string) => (
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{value}</span>
                                    )}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0a0a1a',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        color: '#fff'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </motion.div>
            </div>

            {/* Phase 3: Safety Memory Scorecards */}
            <div className="mt-12">
                <SafetyScorecards totalEvents={totalEvents} />
            </div>
        </div>
    );
}
