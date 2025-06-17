import Greeting from "@/components/greeting";
import Summery from "@/components/charts/summery";
import DonutChart from "@/components/charts/donut-chart";
import BarChartMultiple from "@/components/charts/bar-chart-multiple";
import InteractiveLineChart from "@/components/charts/interactive-line-chart";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-2">
      {/* <Greeting /> */}
      <Summery />

      {/*
       * Include recent transactions next to donut
       * Push bar chart below
       */}

      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex flex-col gap-2">
          <DonutChart title="Income" />
          <DonutChart title="Expense" />
        </div>
        <BarChartMultiple />
      </div>
      <InteractiveLineChart />
    </div>
  );
}
