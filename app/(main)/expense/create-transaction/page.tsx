import TransactionForm from "@/components/transaction-form";
import { fetchCurrencyMethod, fetchCategories } from "@/db/query";

export default async function CreateTransaction() {
  const currency = await fetchCurrencyMethod();
  const category_res = await fetchCategories({ type: "expense" });
  const categories = category_res.data?.map((i) => i.category);

  return (
    <TransactionForm
      currency={currency.data?.currency}
      categories={categories}
    />
  );
}
