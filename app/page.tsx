"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon/icon";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useSearchParams } from "next/navigation";
import { BaseLayout } from "@/components/layout/base-layout";
import { AuthLayout } from "@/components/layout/authentication-layout";
import { FcGoogle } from "react-icons/fc";

export default function HomePage() {
  const searchParams = useSearchParams();
  const isStart = searchParams.get("start") === "1";

  if (isStart) {
    // Render your landing/start page UI
    return (
      <BaseLayout background="https://res.cloudinary.com/ddynvenje/image/upload/v1751293217/vina/vina-background_w4kipf.svg">
        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2 archivo">
            Vina
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Here To Always Listen
          </p>
          <div className="w-full max-w-md flex flex-col gap-4">
            <Link href="/auth/login">
              <button className="w-full py-2 rounded-lg bg-green text-white font-semibold text-lg shadow hover:bg-green-800 transition">
                Log In
              </button>
            </Link>
            <button className="w-full py-2 mt-6 rounded-lg bg-[#F5F4F5] dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 text-[#18181B] font-bold dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              {/* Google SVG icon inline */}
              <FcGoogle className="w-5 h-5" />
              Continue with Google
            </button>
            <Link href="/auth/register">
              <button className="w-full py-2 rounded-lg bg-[#F5F4F5] dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 text-[#18181B] font-bold dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <Icon name="Mail" className="w-5 h-5" /> Sign up with Email
              </button>
            </Link>
          </div>
        </main>
      </BaseLayout>
    );
  }

  // Default home page content here
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Welcome to the Home Page</h1>
    </div>
  );
}
