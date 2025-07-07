import { Suspense } from "react";
// import Greeting from "@/components/greeting";
import SummaryData from "@/components/charts/summary-data";
import SummarySkeleton from "@/components/skeleton/summer-skeleton";
import DonutChart from "@/components/charts/donut-chart";
import { LatestTransactions } from "@/components/latest-transactions";
import LatestTransactionsSkeleton from "@/components/skeleton/latest-transactions-skeleton";
import BarChartMultiple from "@/components/charts/bar-chart-multiple";
import InteractiveLineChart from "@/components/charts/interactive-line-chart";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-2">
      <Suspense fallback={<SummarySkeleton />}>
        <SummaryData />
      </Suspense>
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex flex-col gap-2">
          <DonutChart type="income" />
          <DonutChart type="expense" />
        </div>
        <Suspense fallback={<LatestTransactionsSkeleton />}>
          <LatestTransactions />
        </Suspense>
      </div>
      <BarChartMultiple />
      <InteractiveLineChart />
    </div>
  );
}
