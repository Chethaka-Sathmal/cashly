import TransactionForm from "@/components/transaction-form";
import { fetchCurrencyMethod, fetchCategories } from "@/db/query";
import { fetchTransactionById } from "@/db/query";

export default async function UpdateTransaction({
  searchParams,
}: {
  searchParams: Promise<{ transaction_id: string }>;
}) {
  const params = await searchParams;
  const currency = await fetchCurrencyMethod();
  const category_res = await fetchCategories({ type: "expense" });
  const categories = category_res.data?.map((i) => i.category);
  const transaction = await fetchTransactionById({
    transactionId: params.transaction_id,
  });

  
  return (
    <TransactionForm
      currency={currency.data?.currency}
      categories={categories}
      transaction={transaction.data}
      isUpdate={true}
    />
  );
} 