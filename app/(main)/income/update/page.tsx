import TransactionForm from "@/components/transaction-form";
import {
  fetchCurrencyMethod,
  fetchCategories,
  fetchTransactionById,
} from "@/db/query";

export default async function UpdateTransaction({
  searchParams,
}: {
  searchParams: Promise<{ transaction_id: string }>;
}) {
  const params = await searchParams;
  const [currency, category_res, transaction] = await Promise.all([
    fetchCurrencyMethod(),
    fetchCategories({ type: "income" }),
    fetchTransactionById({
      transactionId: params.transaction_id,
    }),
  ]);

  const categories = category_res.data?.map((i) => i.category);

  return (
    <TransactionForm
      currency={currency.data?.currency}
      categories={categories}
      transaction={transaction.data}
      isUpdate={true}
    />
  );
}
