import { getCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = getCookie("access_token", { req });
  const fetchedToken = await token;

  return NextResponse.json({ token: fetchedToken }, { status: 200 });
}
