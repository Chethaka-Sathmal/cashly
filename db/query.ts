import DBquery from "./connection";
import { auth } from "@clerk/nextjs/server";
import {
  FooterInfoProps_db,
  UserNameProps_db,
  FetchIncomeData_db,
  FetchCurrency_db,
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
