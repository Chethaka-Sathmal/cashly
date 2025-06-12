import DBquery from "./connection";
import { auth } from "@clerk/nextjs/server";

export async function fetchUserInfo() {
  const { userId } = await auth();
  try {
    const queryString = `
        SELECT * FROM users
        WHERE user_id = $1;
    `;

    const result = await DBquery({ text: queryString, params: [userId] });
    return { status: "success", data: result[0] };
  } catch (error) {
    console.error(`Error fetching user data ${JSON.stringify(error)}`);
  }
}
