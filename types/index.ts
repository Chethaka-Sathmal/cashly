import { z, ZodType, ZodSchema } from "zod";
import type { UseFormReturn, FieldValues } from "react-hook-form";
// import {
//   signUpFromSchema,
//   signInFromSchema,
//   onboardingFromSchema,
// } from "@/lib/zod-schema";
import { ClerkAPIError, OAuthStrategy } from "@clerk/types";
import { QueryResultRow } from "pg";

export interface UserProps {
  userID: string;
  userName: string;
  currencyUnit: string;
  // joinedDate: Date;
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

export interface CreateUserOnboardingProps_func {
  // userID: string;
  fName: string;
  lName: string;
  currency: string;
  profilePictureURL: null | string;
  profilePictureKey: null | string;
}

export interface UserTable_db {
  user_id: string;
  f_name: string;
  l_name: string;
  currency: string;
  profile_picture_url: string | null;
  profile_picture_key: string | null;
}

export interface UserCardProps {
  fName: string;
  lName: string;
  email: string;
  currency: string;
  profilePictureUrl: string;
  className?: string;
}

export interface UserDataFormProps_func {
  title: string;
  subTittle?: string;
  buttonTitle: string;
  fName?: string;
  lName?: string;
  currency?: string;
  type: "create" | "edit";
}

export interface EditUserProfileProps_db {
  f_name: string;
  l_name: string;
  currency: string;
}

export interface EditUserProfileProps_func {
  fName: string;
  lName: string;
  currency: string;
}

export interface FooterInfoProps_db {
  f_name: string;
  l_name: string;
  profile_picture_url: string;
}
