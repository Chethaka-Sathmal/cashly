"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

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

export const description = "A donut chart";

interface DonutChartProps {
  type: "income" | "expense";
  data: Array<{
    category: string;
    amount: number;
    fill: string;
  }>;
  config: ChartConfig;
}

export default function DonutChart({ type, data, config }: DonutChartProps) {
  console.log(`data: ${JSON.stringify(data)}`);
  const total = data?.reduce((sum, item) => sum + item.amount, 0) || 0;
  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(total);

  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>{type === "income" ? "Income" : "Expense"}</CardTitle>
        <CardDescription>Total: {formattedTotal}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[175px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={({ payload }) => {
                if (!payload?.length) return null;
                const data = payload[0].payload;
                const amount = new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(data.amount);
                return (
                  <div className="rounded-lg bg-white p-2 shadow-md">
                    <div className="font-medium">{data.category}</div>
                    <div className="text-sm text-muted-foreground">
                      {amount}
                    </div>
                  </div>
                );
              }}
            />
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              innerRadius={40}
              width={10}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Showing total {type} by category
        </div>
      </CardFooter>
    </Card>
  );
}
