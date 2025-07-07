import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Define fixed heights for the bars to create a realistic loading appearance
const barHeights = [
  { income: "h-32", expense: "h-24" },
  { income: "h-40", expense: "h-28" },
  { income: "h-36", expense: "h-20" },
  { income: "h-44", expense: "h-32" },
  { income: "h-28", expense: "h-16" },
  { income: "h-48", expense: "h-36" },
  { income: "h-36", expense: "h-24" },
  { income: "h-40", expense: "h-28" },
];

export default function BarChartSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-40" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-24" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] flex flex-col justify-end space-y-2">
          {/* Create bars for the skeleton */}
          <div className="flex items-end justify-between gap-2 px-6">
            {barHeights.map((height, i) => (
              <div key={i} className="space-y-1 w-full">
                <Skeleton className={`w-full ${height.income}`} />
                <Skeleton className={`w-full ${height.expense}`} />
                <Skeleton className="h-4 w-8 mx-auto mt-2" />
              </div>
            ))}
          </div>
          {/* X-axis line */}
          <Skeleton className="h-[1px] w-full" />
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-48" />
      </CardFooter>
    </Card>
  );
} 