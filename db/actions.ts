"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import DBquery from "./connection";
import {
  CreateUserOnboardingProps_func,
  UserTable_db,
  EditUserProfileProps_func,
  EditUserProfileProps_db,
} from "@/types";

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
