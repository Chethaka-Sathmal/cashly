import TransactionForm from "@/components/transaction-form";
import {
  fetchCurrencyMethod,
  fetchCategories,
  fetchTransactionById,
} from "@/db/query";

export default async function UpdateTransaction({
  searchParams,
}: {
  searchParams: { transaction_id: string };
}) {
  const currency = await fetchCurrencyMethod();
  const category_res = await fetchCategories({ type: "income" });
  const categories = category_res.data?.map((i) => i.category);

  const transaction = await fetchTransactionById({
    transactionId: searchParams.transaction_id,
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
