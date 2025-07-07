"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "Monthly Income vs Expense";

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

const chartConfig = {
  income: {
    label: "Income",
    color: "var(--chart-1)",
  },
  expense: {
    label: "Expense",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export default function BarChartMultiple() {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/monthly-totals");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();
        // Reverse the array to show oldest to newest
        setData([...jsonData].reverse());
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate trend percentage
  const calculateTrend = () => {
    if (data.length < 2) return 0;
    
    // Since data is now oldest to newest, last item is current month
    const currentMonth = data[data.length - 1];
    const previousMonth = data[data.length - 2];
    
    const currentTotal = currentMonth.income - currentMonth.expense;
    const previousTotal = previousMonth.income - previousMonth.expense;
    
    if (previousTotal === 0) return 0;
    
    return ((currentTotal - previousTotal) / Math.abs(previousTotal)) * 100;
  };

  const trendPercentage = calculateTrend();
  const trendText = trendPercentage > 0 ? "up" : "down";

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Income vs Expense</CardTitle>
        <CardDescription>Last 8 Months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <ChartTooltip
              cursor={false}
              content={({ payload }) => {
                if (!payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg bg-white p-2 shadow-md">
                    <div className="font-medium">{data.month}</div>
                    <div className="text-sm text-muted-foreground">
                      Income: ${data.income.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Expense: ${data.expense.toLocaleString()}
                    </div>
                  </div>
                );
              }}
            />
            <Bar dataKey="income" fill={chartConfig.income.color} radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill={chartConfig.expense.color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {!isLoading && !error && (
          <>
            <div className="flex gap-2 leading-none font-medium">
              Net income trending {trendText} by {Math.abs(trendPercentage).toFixed(1)}% from last month
            </div>
            <div className="text-muted-foreground leading-none">
              Showing income and expense totals for the last 8 months
            </div>
          </>
        )}
        {error && (
          <div className="text-destructive">
            {error}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
