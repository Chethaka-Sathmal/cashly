import TransactionForm from "@/components/transaction-form";
import { fetchCurrencyMethod, fetchCategories } from "@/db/query";

export default async function CreateTransaction() {
  const currency = await fetchCurrencyMethod();
  const category_res = await fetchCategories({ type: "income" });
  const categories = category_res.data?.map((i) => i.category);

  return (
    <TransactionForm
      title="Add income"
      currency={currency.data?.currency}
      categories={categories}
    />
  );
}
