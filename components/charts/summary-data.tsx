import { fetchSummaryData, fetchCurrencyMethod } from "@/db/query";
import Summary from "./summery";

export default async function SummaryData() {
  const [summaryResult, currencyResult] = await Promise.all([
    fetchSummaryData(),
    fetchCurrencyMethod(),
  ]);

  if (summaryResult.status === "error") {
    throw new Error(summaryResult.error);
  }

  if (currencyResult.status === "error") {
    throw new Error(currencyResult.error);
  }

  return (
    <Summary 
      data={summaryResult.data!} 
      currency={currencyResult.data?.currency} 
    />
  );
} 