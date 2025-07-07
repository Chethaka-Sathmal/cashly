import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { fetchLatestTransactions } from "@/db/query";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

function truncateText(text: string, maxLength: number = 30) {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

export async function LatestTransactions() {
  const result = await fetchLatestTransactions(10);

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
              {result.status === "success" && (result.data?.length ?? 0) > 0 ? (
                (result.data ?? []).map((tx, idx) => (
                  <TableRow key={tx.transaction_id}>
                    <TableCell className="py-4 w-[40px]">{idx + 1}</TableCell>
                    <TableCell className="py-4 capitalize">{tx.type}</TableCell>
                    <TableCell className="py-4">{tx.category}</TableCell>
                    <TableCell className="py-4 hidden sm:table-cell">
                      {truncateText(tx.description)}
                    </TableCell>
                    <TableCell
                      className={`py-4 text-right font-medium ${
                        tx.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {(tx.amount_cents / 100).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-4 text-muted-foreground"
                  >
                    No recent transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${result.data?.[0]?.type ?? "expense"}`} className="flex items-center">
            View all transactions
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
