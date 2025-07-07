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

export async function fetchTableData({
  query,
  currentPage,
  type,
  pageSize = 12,
}: {
  query: string;
  currentPage: number;
  type: "income" | "expense";
  pageSize?: number;
}) {
  console.log(`query: ${query}`);
  console.log(`currentPage: ${currentPage}`);
  try {
    const { userId } = await auth();
    const offset = (currentPage - 1) * pageSize;

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
              -- Search in dollar format (12.50)
              (t.amount_cents / 100.0)::text ILIKE '%' || $3 || '%' OR
              -- Search in cents format (1250)
              t.amount_cents::text ILIKE '%' || $3 || '%' OR
              -- Search in category
              c.category ILIKE '%' || $3 || '%' OR
              -- Search in description
              t.description ILIKE '%' || $3 || '%' OR
              -- Search in various date formats
              TO_CHAR(t.transaction_date, 'YYYY-MM-DD') ILIKE '%' || $3 || '%' OR
              TO_CHAR(t.transaction_date, 'MM/DD/YYYY') ILIKE '%' || $3 || '%' OR
              TO_CHAR(t.transaction_date, 'DD/MM/YYYY') ILIKE '%' || $3 || '%' OR
              TO_CHAR(t.transaction_date, 'Month DD, YYYY') ILIKE '%' || $3 || '%'
            )
          )
        ORDER BY t.transaction_date DESC
        LIMIT $4 OFFSET $5;
      `;

    const result = await DBquery<FetchIncomeData_db>({
      text: queryString,
      params: [userId, type, query, pageSize, offset],
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

export async function fetchRowCount({
  query,
  type,
}: {
  query: string;
  type: "income" | "expense";
}) {
  try {
    const { userId } = await auth();

    const queryString = `
      SELECT COUNT(*) as total
      FROM transactions t
      JOIN categories c ON t.category_id = c.category_id
      WHERE t.user_id = $1
        AND t.type = $2
        AND (
          $3 = '' OR (
            t.amount_cents::text ILIKE $3 OR
            c.category ILIKE $3 OR
            t.description ILIKE $3 OR
            TO_CHAR(t.transaction_date, 'YYYY-MM-DD') ILIKE $3 OR
            TO_CHAR(t.transaction_date, 'MM/DD/YYYY') ILIKE $3 OR
            TO_CHAR(t.transaction_date, 'DD/MM/YYYY') ILIKE $3
          )
        );
      `;

    const result = await DBquery<{ total: string }>({
      text: queryString,
      params: [userId, type, query],
    });

    if (!result?.length)
      return { status: "error", error: "Unknown error occurred" };
    return { status: "success", data: parseInt(result[0].total) };
  } catch (error) {
    console.error(`Error fetching income data count: ${JSON.stringify(error)}`);
    return {
      status: "error",
      error:
        error instanceof Error
          ? error.message.toString()
          : "Error fetching data count",
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

export async function fetchExpenseData({
  query,
  currentPage,
  pageSize = 12,
}: {
  query: string;
  currentPage: number;
  pageSize?: number;
}) {
  console.log(`query: ${query}`);
  console.log(`currentPage: ${currentPage}`);
  try {
    const { userId } = await auth();
    const offset = (currentPage - 1) * pageSize;

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
            t.description ILIKE $3 OR
            TO_CHAR(t.transaction_date, 'YYYY-MM-DD') ILIKE $3 OR
            TO_CHAR(t.transaction_date, 'MM/DD/YYYY') ILIKE $3 OR
            TO_CHAR(t.transaction_date, 'DD/MM/YYYY') ILIKE $3
          )
        )
      ORDER BY t.transaction_date DESC
      LIMIT $4 OFFSET $5;
      `;

    const result = await DBquery<FetchIncomeData_db>({
      text: queryString,
      params: [userId, "expense", query, pageSize, offset],
    });

    if (!result) return { status: "error", error: "Unknown error occurred" };
    return { status: "success", data: result };
  } catch (error) {
    console.error(`Error fetching expense data: ${JSON.stringify(error)}`);
    return {
      status: "error",
      error:
        error instanceof Error
          ? error.message.toString()
          : "Error fetching data",
    };
  }
}

export async function fetchExpenseDataCount({ query }: { query: string }) {
  try {
    const { userId } = await auth();

    const queryString = `
      SELECT COUNT(*) as total
      FROM transactions t
      JOIN categories c ON t.category_id = c.category_id
      WHERE t.user_id = $1
        AND t.type = $2
        AND (
          $3 = '' OR (
            t.amount_cents::text ILIKE $3 OR
            c.category ILIKE $3 OR
            t.description ILIKE $3 OR
            TO_CHAR(t.transaction_date, 'YYYY-MM-DD') ILIKE $3 OR
            TO_CHAR(t.transaction_date, 'MM/DD/YYYY') ILIKE $3 OR
            TO_CHAR(t.transaction_date, 'DD/MM/YYYY') ILIKE $3
          )
        );
      `;

    const result = await DBquery<{ total: string }>({
      text: queryString,
      params: [userId, "expense", query],
    });

    if (!result?.length)
      return { status: "error", error: "Unknown error occurred" };
    return { status: "success", data: parseInt(result[0].total) };
  } catch (error) {
    console.error(
      `Error fetching expense data count: ${JSON.stringify(error)}`
    );
    return {
      status: "error",
      error:
        error instanceof Error
          ? error.message.toString()
          : "Error fetching data count",
    };
  }
}

export async function fetchSummaryData() {
  try {
    const { userId } = await auth();

    const queryString = `
SELECT 
  COALESCE(SUM(CASE WHEN type = 'income' THEN amount_cents ELSE 0 END), 0) as total_income_cents,
  COALESCE(SUM(CASE WHEN type = 'expense' THEN amount_cents ELSE 0 END), 0) as total_expense_cents
FROM transactions 
WHERE user_id = $1;
    `;

    const result = await DBquery<{
      total_income_cents: string;
      total_expense_cents: string;
    }>({
      text: queryString,
      params: [userId],
    });

    if (!result?.length) {
      return {
        status: "success",
        data: {
          totalIncome: 0,
          totalExpense: 0,
          balance: 0,
          savingsRate: 0,
        },
      };
    }

    const totalIncome = parseInt(result[0].total_income_cents);
    const totalExpense = parseInt(result[0].total_expense_cents);
    const balance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

    return {
      status: "success",
      data: {
        totalIncome,
        totalExpense,
        balance,
        savingsRate: Math.round(savingsRate * 100) / 100, // Round to 2 decimal places
      },
    };
  } catch (error) {
    console.error(`Error fetching summary data: ${JSON.stringify(error)}`);
    return {
      status: "error",
      error:
        error instanceof Error
          ? error.message.toString()
          : "Error fetching summary data",
    };
  }
}

export async function fetchLatestTransactions(limit: number = 10) {
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
      WHERE t.user_id = $1
      ORDER BY t.transaction_date DESC, t.transaction_id DESC
      LIMIT $2;
    `;
    const result = await DBquery<{
      transaction_id: string;
      transaction_date: string;
      amount_cents: number;
      type: string;
      category_id: string;
      category: string;
      description: string;
    }>({
      text: queryString,
      params: [userId, limit],
    });
    return { status: "success", data: result };
  } catch (error) {
    console.error(
      `Error fetching latest transactions: ${JSON.stringify(error)}`
    );
    return {
      status: "error",
      error:
        error instanceof Error
          ? error.message.toString()
          : "Error fetching latest transactions",
    };
  }
}

export async function fetchIncomeByCategory() {
  try {
    const { userId } = await auth();

    const queryString = `
      SELECT 
        c.category,
        COALESCE(SUM(t.amount_cents), 0) as total_amount_cents
      FROM transactions t
      JOIN categories c ON t.category_id = c.category_id
      WHERE t.user_id = $1 AND t.type = 'income'
      GROUP BY c.category
      ORDER BY total_amount_cents DESC;
    `;

    const result = await DBquery<{
      category: string;
      total_amount_cents: string;
    }>({
      text: queryString,
      params: [userId],
    });

    if (!result?.length) {
      return {
        status: "success",
        data: [],
      };
    }

    return {
      status: "success",
      data: result.map((row) => ({
        category: row.category,
        amount: parseInt(row.total_amount_cents) / 100,
      })),
    };
  } catch (error) {
    console.error(
      `Error fetching income by category: ${JSON.stringify(error)}`
    );
    return {
      status: "error",
      error:
        error instanceof Error
          ? error.message.toString()
          : "Error fetching income by category",
    };
  }
}

export async function fetchExpenseByCategory() {
  try {
    const { userId } = await auth();

    const queryString = `
      SELECT 
        c.category,
        COALESCE(SUM(t.amount_cents), 0) as total_amount_cents
      FROM transactions t
      JOIN categories c ON t.category_id = c.category_id
      WHERE t.user_id = $1 AND t.type = 'expense'
      GROUP BY c.category
      ORDER BY total_amount_cents DESC;
    `;

    const result = await DBquery<{
      category: string;
      total_amount_cents: string;
    }>({
      text: queryString,
      params: [userId],
    });

    if (!result?.length) {
      return {
        status: "success",
        data: [],
      };
    }

    return {
      status: "success",
      data: result.map((row) => ({
        category: row.category,
        amount: parseInt(row.total_amount_cents) / 100,
      })),
    };
  } catch (error) {
    console.error(
      `Error fetching expense by category: ${JSON.stringify(error)}`
    );
    return {
      status: "error",
      error:
        error instanceof Error
          ? error.message.toString()
          : "Error fetching expense by category",
    };
  }
}

export async function fetchMonthlyTotals() {
  try {
    const { userId } = await auth();
    
    const queryString = `
      WITH months AS (
        SELECT generate_series(
          date_trunc('month', current_date) - interval '7 months',
          date_trunc('month', current_date),
          interval '1 month'
        )::date as month_start
      )
      SELECT 
        to_char(m.month_start, 'Month') as month,
        COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount_cents ELSE 0 END) / 100.0, 0) as income,
        COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount_cents ELSE 0 END) / 100.0, 0) as expense
      FROM months m
      LEFT JOIN transactions t ON 
        t.user_id = $1 AND
        date_trunc('month', t.transaction_date) = m.month_start
      GROUP BY m.month_start
      ORDER BY m.month_start DESC;
    `;

    const result = await DBquery<{
      month: string;
      income: string;
      expense: string;
    }>({
      text: queryString,
      params: [userId],
    });

    if (!result?.length) {
      return { 
        status: "success", 
        data: [] 
      };
    }

    return { 
      status: "success", 
      data: result.map(row => ({
        month: row.month.trim(), // Remove extra spaces from month name
        income: parseFloat(row.income),
        expense: parseFloat(row.expense)
      }))
    };
  } catch (error) {
    console.error(`Error fetching monthly totals: ${JSON.stringify(error)}`);
    return {
      status: "error",
      error: error instanceof Error ? error.message.toString() : "Error fetching monthly totals",
    };
  }
}
