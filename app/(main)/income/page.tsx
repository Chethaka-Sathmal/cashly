import QueryBar from "@/components/query-bar";
import TransactionTable from "@/components/transaction-table";
import PaginationComponent from "@/components/pagination";
import { fetchCurrencyMethod, fetchIncomeData } from "@/db/query";
import { toast } from "sonner";

export default async function Income(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const result_1 = await fetchIncomeData({ query, currentPage });
  const result_2 = await fetchCurrencyMethod();

  if (
    !result_1 ||
    result_1.status === "error" ||
    !result_2 ||
    result_2.status === "error"
  ) {
    toast.error("Error fetching income data", {
      description: result_1.error,
    });
  }

  return (
    <div>
      <QueryBar />
      <TransactionTable
        data={result_1.data}
        currency={result_2.data?.currency}
      />
      <PaginationComponent />
    </div>
  );
}
