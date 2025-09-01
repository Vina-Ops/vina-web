import { cookies } from "next/headers";
import { deleteCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const res = new NextResponse();
  // Remove all known token cookie variants for compatibility
  deleteCookie("access_token", { cookies });
  deleteCookie("accessToken", { cookies });
  deleteCookie("authToken", { cookies });
  deleteCookie("refresh_token", { cookies });
  deleteCookie("refreshToken", { cookies });

  return NextResponse.json(
    { message: "token removed successfully" },
    { status: 200 }
  );
}
