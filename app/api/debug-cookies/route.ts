import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    // Get all relevant cookies
    const accessToken = cookieStore.get("access_token")?.value;
    const legacyAccessToken = cookieStore.get("accessToken")?.value;
    const authToken = cookieStore.get("authToken")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;
    const legacyRefreshToken = cookieStore.get("refreshToken")?.value;

    const debug = {
      cookies: {
        access_token: accessToken ? "exists" : "missing",
        accessToken: legacyAccessToken ? "exists" : "missing",
        authToken: authToken ? "exists" : "missing",
        refresh_token: refreshToken ? "exists" : "missing",
        refreshToken: legacyRefreshToken ? "exists" : "missing",
      },
      allCookies: Array.from(cookieStore.getAll()).map((cookie) => ({
        name: cookie.name,
        hasValue: !!cookie.value,
      })),
      requestHeaders: {
        cookie: request.headers.get("cookie"),
        authorization: request.headers.get("authorization"),
      },
    };

    return NextResponse.json(debug);
  } catch (error) {
    console.error("Error debugging cookies:", error);
    return NextResponse.json(
      { error: "Failed to debug cookies" },
      { status: 500 }
    );
  }
}
