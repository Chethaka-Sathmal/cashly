import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "../ui/table";

export default function LatestTransactionsSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Latest transactions</CardTitle>
        <CardDescription>Your latest transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableBody>
              {[...Array(10)].map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell className="py-4 w-[40px]">
                    <Skeleton className="h-4 w-6" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="py-4 hidden sm:table-cell">
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <Skeleton className="h-4 w-14 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-2">
        <Skeleton className="h-8 w-36" />
      </CardFooter>
    </Card>
  );
} 