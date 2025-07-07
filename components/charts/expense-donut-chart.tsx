import { fetchExpenseByCategory } from "@/db/query";
import { ChartConfig } from "@/components/ui/chart";
import DonutChart from "./donut-chart";

// Define chart configuration
const chartConfig = {
  amount: {
    label: "Amount",
  },
  food: {
    label: "Food & Dining",
    color: "var(--chart-1)",
  },
  utilities: {
    label: "Utilities",
    color: "var(--chart-2)",
  },
  transportation: {
    label: "Transportation",
    color: "var(--chart-3)",
  },
  entertainment: {
    label: "Entertainment",
    color: "var(--chart-4)",
  },
  miscellaneous: {
    label: "Miscellaneous",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export default async function ExpenseDonutChart() {
  const result = await fetchExpenseByCategory();

  if (result.status === "error" || !result.data) {
    throw new Error(result.error || "Failed to fetch expense data");
  }

  // Sort categories by amount and get top 4
  const sortedData = result.data.sort((a, b) => b.amount - a.amount);
  const topCategories = sortedData.slice(0, 4);
  
  // Sum up remaining categories into "Miscellaneous"
  const otherCategories = sortedData.slice(4);
  const miscTotal = otherCategories.reduce((sum, cat) => sum + cat.amount, 0);

  // Prepare chart data
  const chartData = [
    ...topCategories.map((cat, idx) => ({
      category: cat.category.toLowerCase(),
      amount: cat.amount,
      fill: `var(--chart-${idx + 1})`,
    })),
  ];

  // Add miscellaneous category
  chartData.push({
    category: "miscellaneous",
    amount: miscTotal,
    fill: "var(--chart-5)",
  });

  return <DonutChart type="expense" data={chartData} config={chartConfig} />;
}
