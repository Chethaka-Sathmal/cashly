import { NextResponse } from "next/server";
import { fetchFooterInfo } from "@/db/query";
import { FooterInfoProps_db } from "@/types";

export async function GET() {
  const result = await fetchFooterInfo();
  const data: FooterInfoProps_db | undefined = result.data;

  if (!data) {
    const response = { status: "error", error: "Error fetching footer data" };
    return NextResponse.json(response);
  }

  const response = { status: "success", data: data };
  return NextResponse.json(response);
}
