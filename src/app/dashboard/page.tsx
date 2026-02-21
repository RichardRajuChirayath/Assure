import { getDashboardStats, getRecentRiskEvents } from "@/lib/actions";
import { DashboardClient } from "@/components/dashboard-client";

export default async function DashboardPage() {
    const stats = await getDashboardStats();
    const recentEvents = await getRecentRiskEvents();

    return <DashboardClient stats={stats} recentEvents={recentEvents} />;
}
