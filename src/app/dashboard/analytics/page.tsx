import { getRiskTrendData, getVerdictDistribution } from "@/lib/actions";
import { AnalyticsClient } from "@/components/analytics-client";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
    const [trendData, verdictData] = await Promise.all([
        getRiskTrendData(),
        getVerdictDistribution()
    ]);

    return <AnalyticsClient trendData={trendData} verdictData={verdictData} />;
}
