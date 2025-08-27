import { getCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = getCookie("refresh_token", { req });
  return NextResponse.json({ token }, { status: 200 });
}
