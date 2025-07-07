import { fetchMonthlyTotals } from "@/db/query";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await fetchMonthlyTotals();

    if (result.status === "error") {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 