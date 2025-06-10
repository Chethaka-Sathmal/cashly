"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import DBquery from "./connection";
import { CreateUserOnboardingProps, UserTable } from "@/types";

export async function createUserOnboarding({
  fName,
  lName,
  currency,
  profilePictureURL,
}: CreateUserOnboardingProps) {
  try {
    // 1. Authentication
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    const queryString = `
        INSERT INTO users (user_id, f_name, l_name, currency, profile_picture_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;

    // 2. 2. Database query
    const result = await DBquery<UserTable>({
      text: queryString,
      params: [userId, fName, lName, currency, profilePictureURL],
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
