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
      // Set maxAge only if rememberMe is true
      const accessTokenOptions: any = {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        path: "/",
      };
      if (rememberMe) {
        accessTokenOptions.maxAge = 60 * 60; // 1 hour
      }

      const refreshTokenOptions: any = {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        path: "/",
      };
      if (rememberMe) {
        refreshTokenOptions.maxAge = 60 * 60 * 24 * 30; // 30 days
      }

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
