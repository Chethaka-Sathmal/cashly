import DBquery from "./connection";
import { auth } from "@clerk/nextjs/server";
import { FooterInfoProps_db } from "@/types";

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
    // console.log(`Query data: ${result[0].profile_picture_url}`);
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
