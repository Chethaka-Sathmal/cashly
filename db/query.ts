import DBquery from "./connection";
import { auth } from "@clerk/nextjs/server";
import {
  FooterInfoProps_db,
  UserNameProps_db,
  FetchIncomeData_db,
  FetchCurrency_db,
  fetchCategories_db,
} from "@/types";

export async function fetchUserInfo() {
  try {
    const { userId } = await auth();
    const queryString = `
        SELECT f_name, l_name, currency, profile_picture_url FROM users
        WHERE user_id = $1;
    `;

    const result = await DBquery({ text: queryString, params: [userId] });

    if (!result) return { status: "error", error: "Unknown error occurred" };
    return { status: "success", data: result[0] };
  } catch (error) {
    console.error(`Error fetching user data ${JSON.stringify(error)}`);
    return {
      status: "error",
      error:
        error instanceof Error
          ? error.message.toString()
          : "Error fetching data",
    };
  }
}

export async function fetchEditableInfo() {
  try {
    const { userId } = await auth();
    const queryString = `
      SELECT f_name, l_name, currency FROM users
      WHERE user_id = $1;
    `;

    const result = await DBquery({ text: queryString, params: [userId] });

    if (!result) return { status: "error", error: "Unknown error occurred" };
    return { status: "success", data: result[0] };
  } catch (error) {
    console.error(`Error fetching editable data ${JSON.stringify(error)}`);
    return {
      status: "error",
      error:
        error instanceof Error
          ? error.message.toString()
          : "Error fetching data",
    };
  }
}

export async function fetchFooterInfo() {
  try {
    const { userId } = await auth();
    const queryString = `
      SELECT f_name, l_name, profile_picture_url FROM users
      WHERE user_id = $1;
    `;

    const result = await DBquery<FooterInfoProps_db>({
      text: queryString,
      params: [userId],
    });

    if (!result) return { status: "error", error: "Unknown error occurred" };
    return { status: "success", data: result[0] };
  } catch (error) {
    console.error(`Error fetching footer information ${JSON.stringify(error)}`);
    return {
      status: "error",
      error:
        error instanceof Error
          ? error.message.toString()
          : "Error fetching data",
    };
  }
}

export async function fetchUserName() {
  try {
    const { userId } = await auth();
    const queryString = `
      SELECT f_name FROM users 
      WHERE user_id = $1;
    `;

    const result = await DBquery<UserNameProps_db>({
      text: queryString,
      params: [userId],
    });
    if (!result) return { status: "error", error: "Unknown error occurred" };
    return { status: "success", data: result[0] };
  } catch (error) {
    console.error(`Error fetching user name: ${JSON.stringify(error)}`);
    return {
      status: "error",
      error:
        error instanceof Error
          ? error.message.toString()
          : "Error fetching data",
    };
  }
}

export async function fetchIncomeData({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  console.log(`query: ${query}`);
  console.log(`currentPage: ${currentPage}`);
  try {
    const { userId } = await auth();
    const queryString = `
SELECT
  t.transaction_id,
  t.transaction_date,
  t.amount_cents,
  t.category_id,
  c.category,
  t.description
FROM transactions t
JOIN categories c ON t.category_id = c.category_id
WHERE t.user_id = $1
  AND t.type = $2
  AND (
    $3 = '' OR (
      t.amount_cents::text ILIKE $3 OR
      c.category ILIKE $3 OR
      t.description ILIKE $3
    )
  )
ORDER BY t.transaction_date DESC
LIMIT 15;
      `;

    const result = await DBquery<FetchIncomeData_db>({
      text: queryString,
      params: [userId, "income", query],
    });

    if (!result) return { status: "error", error: "Unknown error occurred" };
    return { status: "success", data: result };
  } catch (error) {
    console.error(`Error fetching income data: ${JSON.stringify(error)}`);
    return {
      status: "error",
      error:
        error instanceof Error
          ? error.message.toString()
          : "Error fetching data",
    };
  }
}

export async function fetchCurrencyMethod() {
  try {
    const { userId } = await auth();
    const queryString = `
      SELECT currency 
      FROM users
      WHERE user_id = $1;
    `;

    const result = await DBquery<FetchCurrency_db>({
      text: queryString,
      params: [userId],
    });

    if (!result) return { status: "error", error: "Unknown error occurred" };
    return { status: "success", data: result[0] };
  } catch (error) {
    console.error(`Error fetching currency: ${JSON.stringify(error)}`);
    return {
      status: "error",
      error:
        error instanceof Error
          ? error.message.toString()
          : "Error fetching data",
    };
  }
}

export async function fetchCategories({ type }: { type: string }) {
  try {
    const { userId } = await auth();
    const queryString = `
      SELECT category 
      FROM categories
      WHERE type = $1 AND (user_id = $2 OR user_id = $3);
    `;

    const result = await DBquery<fetchCategories_db>({
      text: queryString,
      params: [type, userId, "system"],
    });

    if (!result) return { status: "error", error: "Unknown error occurred" };
    return { status: "success", data: result };
  } catch (error) {
    console.error(`Error fetching categories: ${JSON.stringify(error)}`);
    return {
      status: "error",
      error:
        error instanceof Error
          ? error.message.toString()
          : "Error fetching data",
    };
  }
}

export async function getCategoryId({
  category,
  type,
  userId,
}: {
  category: string;
  type: string;
  userId: string;
}) {
  try {
    const queryString = `
      SELECT category_id 
      FROM categories
      WHERE category = $1 AND type = $2 AND (user_id = $3 OR user_id = $4);
    `;

    const result = await DBquery<{ category_id: number }>({
      text: queryString,
      params: [category, type, userId, "system"],
    });

    if (!result?.length) {
      throw new Error("Category not found");
    }

    return {
      status: "success" as const,
      data: result[0].category_id,
    };
  } catch (error) {
    console.error(`Error fetching category ID: ${error}`);
    return {
      status: "error" as const,
      error:
        error instanceof Error
          ? error.message.toString()
          : "Failed to fetch category ID",
    };
  }
}

export async function fetchTransactionById({
  transactionId,
}: {
  transactionId: string;
}) {
  try {
    const { userId } = await auth();
    const queryString = `
      SELECT 
        t.transaction_id,
        t.transaction_date,
        t.amount_cents,
        t.type,
        t.category_id,
        c.category,
        t.description
      FROM transactions t
      JOIN categories c ON t.category_id = c.category_id
      WHERE t.transaction_id = $1 AND t.user_id = $2;
    `;

    const result = await DBquery({
      text: queryString,
      params: [transactionId, userId],
    });

    if (!result?.length) {
      return { status: "error", error: "Transaction not found" };
    }

    return { status: "success", data: result[0] };
  } catch (error) {
    console.error(`Error fetching transaction: ${JSON.stringify(error)}`);
    return {
      status: "error",
      error:
        error instanceof Error
          ? error.message.toString()
          : "Error fetching transaction",
    };
  }
}
