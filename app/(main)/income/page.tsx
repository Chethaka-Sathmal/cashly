import QueryBar from "@/components/query-bar";
import TransactionTable from "@/components/transaction-table";
import {
  fetchCurrencyMethod,
  fetchIncomeData,
  fetchIncomeDataCount,
} from "@/db/query";

export default async function Income(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 12;

  const [result_1, result_2, result_3] = await Promise.all([
    fetchIncomeData({ query, currentPage, pageSize }),
    fetchCurrencyMethod(),
    fetchIncomeDataCount({ query }),
  ]);

  if (result_1.status === "error") {
    throw new Error(result_1.error);
  }

  if (result_2.status === "error") {
    throw new Error(result_2.error);
  }

  if (result_3.status === "error") {
    throw new Error(result_3.error);
  }

  return (
    <div>
      <QueryBar />
      <TransactionTable
        data={result_1.data}
        currency={result_2.data?.currency}
        totalCount={result_3.data || 0}
        currentPage={currentPage}
        pageSize={pageSize}
        // onPageChange={(page) => {
        //   // This will be handled by the client component
        // }}
      />
    </div>
  );
}
