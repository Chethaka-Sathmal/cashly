import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DonutChartSkeleton() {
  return (
    <Card className="flex flex-col md:min-w-md">
      <CardHeader className="items-center pb-0">
        <CardTitle>
          <Skeleton className="h-6 w-24" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-32" />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="mx-auto aspect-square max-h-[175px] flex items-center justify-center">
          <Skeleton className="h-[175px] w-[175px] rounded-full" />
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <Skeleton className="h-4 w-48" />
      </CardFooter>
    </Card>
  );
} 