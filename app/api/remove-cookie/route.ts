import { cookies } from "next/headers";
import { deleteCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const res = new NextResponse();
  deleteCookie("access_token", { cookies });

  return NextResponse.json(
    { message: "token removed successfully" },
    { status: 200 }
  );
}
