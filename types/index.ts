import Expense from "@/app/(dashboard)/expense/page";

export interface UserProps {
  userID: string;
  userName: string;
  currencyUnit: string;
  joinedDate: Date;
}

interface BaseTransaction {
  transactionID: string;
  userID: string;
  amountInCents: number;
  type: "income" | "expense";
  createdDate: Date;
  transactionDate: Date;
  description: string;
}

type IncomeCategory =
  | "salary"
  | "freelance"
  | "investments"
  | "gifts"
  | "other";

type ExpenseCategory =
  | "food"
  | "transport"
  | "shopping"
  | "entertainment"
  | "bills"
  | "health"
  | "other";

interface IncomeTransaction extends BaseTransaction {
  type: "income";
  category: IncomeCategory;
}

interface ExpenseTransaction extends BaseTransaction {
  type: "expense";
  category: ExpenseCategory;
}

export type TransactionProps = IncomeTransaction | ExpenseTransaction;
