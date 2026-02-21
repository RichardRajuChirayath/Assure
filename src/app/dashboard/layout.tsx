"use client";

import { Navbar } from "@/components/navbar";
import BackgroundParticles from "@/components/background-particles";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { LayoutDashboard, ShieldCheck, History, Settings, Bell, BarChart3, Home } from "lucide-react";

import { usePathname } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen text-white">
            <BackgroundParticles />

            {/* Sidebar (Optional but recommended for SaaS) */}
            <div className="fixed left-0 top-0 bottom-0 w-20 md:w-64 bg-[#050510]/80 backdrop-blur-xl border-r border-white/5 z-50 flex flex-col pt-24 pb-10">
                <div className="px-6 space-y-8">
                    <div className="space-y-4">
                        <SidebarLink href="/" icon={<Home className="w-5 h-5" />} label="Home" active={false} />
                        <SidebarLink href="/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Overview" active={pathname === "/dashboard"} />
                        <SidebarLink href="/dashboard/workflows" icon={<ShieldCheck className="w-5 h-5" />} label="Workflows" active={pathname === "/dashboard/workflows"} />
                        <SidebarLink href="/dashboard/analytics" icon={<BarChart3 className="w-5 h-5" />} label="Analytics" active={pathname === "/dashboard/analytics"} />
                        <SidebarLink href="/dashboard/audit" icon={<History className="w-5 h-5" />} label="Audit Log" active={pathname === "/dashboard/audit"} />
                        <SidebarLink href="/dashboard/settings" icon={<Settings className="w-5 h-5" />} label="Settings" active={pathname === "/dashboard/settings"} />
                    </div>
                </div>

                <div className="mt-auto px-6">
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
                        <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Engine v4.0</div>
                        <div className="text-[8px] text-muted font-bold uppercase tracking-widest">System Optimal</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="pl-20 md:pl-64 flex flex-col min-h-screen">
                <header className="h-20 border-b border-white/5 bg-[#02020a]/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-black tracking-tighter uppercase italic">Assure <span className="text-primary">Terminal</span></h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <Bell className="w-4 h-4 text-muted" />
                            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
                        </button>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-10 h-10 rounded-xl border border-white/10"
                                }
                            }}
                        />
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

function SidebarLink({ href, icon, label, active = false }: any) {
    return (
        <a
            href={href}
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${active
                ? "bg-primary text-white shadow-[0_0_20px_rgba(124,105,239,0.3)]"
                : "text-muted hover:text-white hover:bg-white/5"
                }`}
        >
            <div className={`${active ? "text-white" : "group-hover:text-primary"} transition-colors`}>
                {icon}
            </div>
            <span className="text-sm font-bold uppercase tracking-widest hidden md:block">
                {label}
            </span>
        </a>
    );
}
