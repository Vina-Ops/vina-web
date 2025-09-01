import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

/**
 * POST request handler for setting access and refresh tokens as cookies.
 *
 * @param {Request} req - The incoming request object.
 * @param {NextApiResponse} res - The response object to send back.
 *
 * @returns {NextResponse} - A Next.js response object with JSON content.
 */
export async function POST(req: Request) {
  if (req.method === "POST") {
    // Parse the request body as JSON and extract both tokens and rememberMe
    const { accessToken, refreshToken, rememberMe } = await req.json();

    if (accessToken && refreshToken) {
      // Always set maxAge for persistent cookies (avoid session cookies)
      const accessTokenOptions: any = {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        path: "/",
        maxAge: rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24, // 7 days if rememberMe, 1 day otherwise
      };

      const refreshTokenOptions: any = {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        path: "/",
        maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7, // 30 days if rememberMe, 7 days otherwise
      };

      const accessTokenSerialized = serialize(
        "access_token",
        accessToken,
        accessTokenOptions
      );
      const refreshTokenSerialized = serialize(
        "refresh_token",
        refreshToken,
        refreshTokenOptions
      );

      const response = NextResponse.json({
        message: "Cookies set successfully",
      });

      response.headers.set("Set-Cookie", accessTokenSerialized);
      response.headers.append("Set-Cookie", refreshTokenSerialized);

      return response;
    } else {
      return NextResponse.json(
        { message: "Access token and refresh token are required" },
        { status: 400 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }
}
