import { Card, CardContent } from "../ui/card";
import { fetchCurrencyMethod } from "@/db/query";

interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingsRate: number;
}

interface SummaryProps {
  data: SummaryData;
  currency?: string;
}

export default function Summary({ data, currency = "Rs." }: SummaryProps) {
  const formatAmount = (amount: number) => {
    return `${currency} ${(amount / 100).toFixed(2)}`;
  };

  const formatPercentage = (rate: number) => {
    return `${rate.toFixed(1)}%`;
  };

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Total income</span>
            <span className="font-semibold text-green-600">
              {formatAmount(data.totalIncome)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Total expense</span>
            <span className="font-semibold text-red-600">
              {formatAmount(data.totalExpense)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Total balance</span>
            <span className={`font-semibold ${data.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatAmount(data.balance)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Savings rate</span>
            <span className={`font-semibold ${data.savingsRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(data.savingsRate)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
