import { Suspense } from "react";
// import Greeting from "@/components/greeting";
import SummaryData from "@/components/charts/summary-data";
import SummarySkeleton from "@/components/skeleton/summer-skeleton";
import IncomeDonutChart from "@/components/charts/income-donut-chart";
import ExpenseDonutChart from "@/components/charts/expense-donut-chart";
import DonutChartSkeleton from "@/components/skeleton/donut-chart-skeleton";
import { LatestTransactions } from "@/components/latest-transactions";
import LatestTransactionsSkeleton from "@/components/skeleton/latest-transactions-skeleton";
import BarChartMultiple from "@/components/charts/bar-chart-multiple";
import BarChartSkeleton from "@/components/skeleton/bar-chart-skeleton";
import InteractiveLineChart from "@/components/charts/interactive-line-chart";
import InteractiveLineChartSkeleton from "@/components/skeleton/interactive-line-chart-skeleton";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-2">
      <Suspense fallback={<SummarySkeleton />}>
        <SummaryData />
      </Suspense>
      <div className="flex flex-col md:flex-row gap-2">
        <Suspense fallback={<DonutChartSkeleton />}>
          <IncomeDonutChart />
        </Suspense>
        <Suspense fallback={<DonutChartSkeleton />}>
          <ExpenseDonutChart />
        </Suspense>
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        <Suspense fallback={<LatestTransactionsSkeleton />}>
          <LatestTransactions />
        </Suspense>
        <Suspense fallback={<BarChartSkeleton />}>
          <BarChartMultiple />
        </Suspense>
      </div>
      <Suspense fallback={<InteractiveLineChartSkeleton />}>
        <InteractiveLineChart />
      </Suspense>
    </div>
  );
}
