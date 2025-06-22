import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { FetchIncomeData_db } from "@/types";
import formatDate from "@/utils/format-date";
import { Trash2, PencilLine } from "lucide-react";

export default function TransactionTable({
  data,
  type,
  currency,
}: {
  data: FetchIncomeData_db[] | undefined;
  type: string;
  currency: string | undefined;
}) {
  let index = 0; // table row number

  console.log(`data: ${JSON.stringify(data)}`);

  return (
    <div className="bg-white rounded-lg ring-sidebar-ring ring-[0.1px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">#</TableHead>
            <TableHead className="text-center">Date</TableHead>
            <TableHead className="text-right w-[40px]">
              Amount ({currency})
            </TableHead>
            <TableHead className="hidden md:table-cell">Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.length > 0 ? (
            data?.map((i) => (
              <TableRow key={i.transaction_id}>
                <TableCell className="text-left">{++index}</TableCell>
                <TableCell>{formatDate(i.transaction_date)}</TableCell>
                <TableCell className="text-right w-[40px]">
                  {(i.amount_cents / 100).toFixed(2)}
                </TableCell>
                <TableCell className="hidden md:block">{type}</TableCell>
                <TableCell>{i.category}</TableCell>
                <TableCell className="hidden md:block">
                  {i.description}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex gap-5">
                    <Button size={"sm"} variant={"themeLight"}>
                      <PencilLine />
                    </Button>
                    <Button size={"sm"} variant={"destructiveLight"}>
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableCell colSpan={7}>
              <div className="flex flex-col items-center gap-4 w-full py-12">
                <h2 className="text-3xl">Oopsie daisy 🥀</h2>
                <p className="text-lg">No transaction records found</p>
              </div>
            </TableCell>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
