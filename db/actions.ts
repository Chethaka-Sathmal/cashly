"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import DBquery from "./connection";
import {
  CreateUserOnboardingProps_func,
  UserTable_db,
  EditUserProfileProps_func,
  EditUserProfileProps_db,
  CreateNewTransaction_func,
} from "@/types";
import { getCategoryId } from "./query";

export async function createUserOnboarding({
  fName,
  lName,
  currency,
  profilePictureURL,
  profilePictureKey,
}: CreateUserOnboardingProps_func) {
  try {
    // 1. Authentication
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    const queryString = `
        INSERT INTO users (user_id, f_name, l_name, currency, profile_picture_url, profile_picture_key)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;

    // 2. Database query
    const result = await DBquery<UserTable_db>({
      text: queryString,
      params: [
        userId,
        fName,
        lName,
        currency,
        profilePictureURL,
        profilePictureKey,
      ],
    });

    if (!result?.length) throw new Error("Creation failed");

    // 3. Update Clerk metadata
    const clerk = await clerkClient();
    clerk.users.updateUserMetadata(userId, {
      unsafeMetadata: { onboardingComplete: true },
    });

    // 4. Return success
    return {
      status: "success" as const,
      data: result[0], // return the created user
    };
  } catch (error) {
    console.error("Server error:", JSON.stringify(error));
    return {
      status: "error" as const,
      error:
        error instanceof Error ? error.message.toString() : "Onboarding failed",
    };
  }
}

export async function editUserProfile({
  fName,
  lName,
  currency,
}: EditUserProfileProps_func) {
  try {
    // 1. Authentication
    const { userId } = await auth();

    if (!userId) throw new Error("User not authenticated");

    const queryString = `
      UPDATE users
      SET f_name = $1, l_name = $2, currency = $3
      WHERE user_id = $4
      RETURNING *;
    `;

    // 2. Database query
    const result = await DBquery<EditUserProfileProps_db>({
      text: queryString,
      params: [fName, lName, currency, userId],
    });

    if (!result?.length) throw new Error("Update failed");

    // 3. Return success
    return { status: "success" as const, data: result[0] };
  } catch (error) {
    console.error(`Database error editing user: ${error}`);
    return {
      status: "error" as const,
      error:
        error instanceof Error
          ? error.message.toString()
          : "Updating user failed",
    };
  }
}

export async function createNewTransaction({
  amount,
  category,
  transactionDate,
  description,
  type,
}: CreateNewTransaction_func) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    // 1. Get category_id from categories table
    const categoryResult = await getCategoryId({
      category,
      type,
      userId,
    });

    if (categoryResult.status === "error") {
      throw new Error(categoryResult.error);
    }

    const categoryId = categoryResult.data;

    // 2. Insert transaction into transactions table
    const transactionQueryString = `
      INSERT INTO transactions (user_id, amount_cents, type, category_id, created_date, transaction_date, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const amountInCents = Math.round(amount * 100);
    const currentDate = new Date();

    const result = await DBquery({
      text: transactionQueryString,
      params: [
        userId,
        amountInCents,
        type,
        categoryId,
        currentDate,
        transactionDate,
        description || null,
      ],
    });

    if (!result?.length) throw new Error("Transaction creation failed");

    // 3. Return success
    return {
      status: "success" as const,
      data: result[0],
    };
  } catch (error) {
    console.error(`Database error recording new transaction: ${error}`);
    return {
      status: "error" as const,
      error:
        error instanceof Error
          ? error.message.toString()
          : "New transaction entry failed",
    };
  }
}

export async function deleteTransaction({
  transactionId,
}: {
  transactionId: string;
}) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    const queryString = `
      DELETE FROM transactions
      WHERE transaction_id = $1 AND user_id = $2
      RETURNING *;
    `;

    const result = await DBquery({
      text: queryString,
      params: [transactionId, userId],
    });

    if (!result?.length) {
      throw new Error("Transaction not found or unauthorized");
    }

    return {
      status: "success" as const,
      data: result[0],
    };
  } catch (error) {
    console.error(`Database error deleting transaction: ${error}`);
    return {
      status: "error" as const,
      error:
        error instanceof Error
          ? error.message.toString()
          : "Failed to delete transaction",
    };
  }
}

export async function updateTransaction({
  transactionId,
  amount,
  category,
  transactionDate,
  description,
  type,
}: {
  transactionId: string;
  amount: number;
  category: string;
  transactionDate: Date;
  description: string | undefined;
  type: "income" | "expense";
}) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    // 1. Get category_id from categories table
    const categoryResult = await getCategoryId({
      category,
      type,
      userId,
    });

    if (categoryResult.status === "error") {
      throw new Error(categoryResult.error);
    }

    const categoryId = categoryResult.data;

    // 2. Update transaction in transactions table
    const transactionQueryString = `
      UPDATE transactions 
      SET amount_cents = $1, type = $2, category_id = $3, transaction_date = $4, description = $5
      WHERE transaction_id = $6 AND user_id = $7
      RETURNING *;
    `;

    const amountInCents = Math.round(amount * 100);

    const result = await DBquery({
      text: transactionQueryString,
      params: [
        amountInCents,
        type,
        categoryId,
        transactionDate,
        description || null,
        transactionId,
        userId,
      ],
    });

    if (!result?.length) {
      throw new Error("Transaction not found or unauthorized");
    }

    // 3. Return success
    return {
      status: "success" as const,
      data: result[0],
    };
  } catch (error) {
    console.error(`Database error updating transaction: ${error}`);
    return {
      status: "error" as const,
      error:
        error instanceof Error
          ? error.message.toString()
          : "Failed to update transaction",
    };
  }
}
