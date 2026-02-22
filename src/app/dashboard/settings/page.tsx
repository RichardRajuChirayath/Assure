"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Bell, Fingerprint, Clock, Globe, Lock, Zap, Loader2 } from "lucide-react";
import { getSettings, saveSettings } from "@/lib/actions";

export default function SettingsPage() {
    const [riskThreshold, setRiskThreshold] = useState(70);
    const [fridayBlock, setFridayBlock] = useState(true);
    const [prodOnly, setProdOnly] = useState(true);
    const [notifications, setNotifications] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const settings = await getSettings();
                setRiskThreshold(settings.riskThreshold);
                setFridayBlock(settings.fridayBlock);
                setProdOnly(settings.prodOnly);
                setNotifications(settings.notifications);
            } catch (error) {
                console.error("Failed to fetch settings:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchSettings();
    }, []);

    async function handleSave() {
        setSaving(true);
        try {
            await saveSettings({
                riskThreshold,
                fridayBlock,
                prodOnly,
                notifications,
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error("Failed to save settings:", error);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10 max-w-3xl">
            <div>
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                    Engine <span className="text-primary">Settings</span>
                </h2>
                <p className="text-muted text-sm mt-1">Configure Assure's risk engine behavior and notification preferences.</p>
            </div>

            {saved && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-400 font-bold"
                >
                    ✓ Settings saved successfully.
                </motion.div>
            )}

            {/* Risk Engine Config */}
            <div className="bg-secondary/40 border border-white/5 rounded-[32px] p-8 space-y-8">
                <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" /> Risk Engine
                </h3>

                {/* Risk Threshold Slider */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-white">Block Threshold</label>
                        <span className="text-sm font-black text-primary">{riskThreshold}/100</span>
                    </div>
                    <input
                        type="range" min={10} max={100} value={riskThreshold}
                        onChange={(e) => setRiskThreshold(Number(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none bg-white/10 cursor-pointer accent-primary"
                    />
                    <p className="text-[10px] text-muted italic">Actions with a risk score above this threshold will be automatically blocked.</p>
                </div>

                {/* Toggle: Friday Block */}
                <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <div>
                            <div className="text-sm font-bold text-white">Friday Afternoon Block</div>
                            <div className="text-[10px] text-muted">Auto-block production deploys on Fridays after 2 PM.</div>
                        </div>
                    </div>
                    <button
                        onClick={() => setFridayBlock(!fridayBlock)}
                        className={`w-12 h-6 rounded-full transition-all ${fridayBlock ? 'bg-primary' : 'bg-white/10'} relative`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${fridayBlock ? 'left-6' : 'left-0.5'}`} />
                    </button>
                </div>

                {/* Toggle: Prod Only */}
                <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-blue-500" />
                        <div>
                            <div className="text-sm font-bold text-white">Production Only Mode</div>
                            <div className="text-[10px] text-muted">Only intercept actions targeting production environments.</div>
                        </div>
                    </div>
                    <button
                        onClick={() => setProdOnly(!prodOnly)}
                        className={`w-12 h-6 rounded-full transition-all ${prodOnly ? 'bg-primary' : 'bg-white/10'} relative`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${prodOnly ? 'left-6' : 'left-0.5'}`} />
                    </button>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-secondary/40 border border-white/5 rounded-[32px] p-8 space-y-6">
                <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                    <Bell className="w-5 h-5 text-primary" /> Notifications
                </h3>

                <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-emerald-500" />
                        <div>
                            <div className="text-sm font-bold text-white">Engine Alerts</div>
                            <div className="text-[10px] text-muted">Get notified when the engine blocks a high-risk action.</div>
                        </div>
                    </div>
                    <button
                        onClick={() => setNotifications(!notifications)}
                        className={`w-12 h-6 rounded-full transition-all ${notifications ? 'bg-primary' : 'bg-white/10'} relative`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${notifications ? 'left-6' : 'left-0.5'}`} />
                    </button>
                </div>
            </div>

            {/* Developer API & Ecosystem */}
            <div className="bg-secondary/40 border border-white/5 rounded-[32px] p-8 space-y-6">
                <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                    <Globe className="w-5 h-5 text-primary" /> Developer API & Ecosystem
                </h3>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                    <div>
                        <div className="text-sm font-bold text-white mb-1">Assure Safety Signals API</div>
                        <div className="text-[10px] text-muted">Integrate Assure's risk intelligence into external CLI tools, IDEs, and custom scripts.</div>
                    </div>

                    <div className="bg-black/40 p-3 rounded-lg border border-white/5 font-mono text-[10px] text-zinc-500">
                        <span className="text-emerald-500">POST</span> /v3/risk/evaluate
                    </div>

                    <div className="flex gap-4">
                        <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-white transition-colors">Generate API Key</button>
                        <button className="text-[10px] font-black text-muted uppercase tracking-widest hover:text-white transition-colors">Read Documentation</button>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-4 bg-primary text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Lock className="w-4 h-4" />
                )}
                {saving ? "Saving..." : "Save Configuration"}
            </button>
        </div>
    );
}
