import { getCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const wsToken = getCookie("ws_token", { req });
  const fetchedWsToken = await wsToken;

  return NextResponse.json({ ws_token: fetchedWsToken }, { status: 200 });
}
