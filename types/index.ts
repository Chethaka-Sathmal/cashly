import { z, ZodType, ZodSchema } from "zod";
import type { UseFormReturn, FieldValues } from "react-hook-form";
import {
  signUpFromSchema,
  signInFromSchema,
  onboardingFromSchema,
} from "@/lib/zod-schema";
import { ClerkAPIError, OAuthStrategy } from "@clerk/types";

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

// export type SignUpFromSchemaProps = z.infer<typeof signUpFromSchema>;
// export type SignInFromSchemaProps = z.infer<typeof signInFromSchema>;
// export type OnboardingFromSchemaProps = z.infer<typeof onboardingFromSchema>;

export interface AuthFormProps<T extends FieldValues> {
  className?: string;
  variant: "sign-in" | "sign-up";
  onSubmit: (data: T) => void;
  authenticateWith: (strategy: OAuthStrategy) => void;
  schema: ZodType<T>;
  defaultValues?: T;
  errors: (ClerkAPIError | string)[];
}
