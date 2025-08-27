"use client";

import React, { PropsWithChildren, Suspense } from "react";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "../theme/ThemeToggle";

interface BaseLayoutProps {
  className?: string;
  background?: string;
  minHeight?: string;
}

export const BaseLayout = (props: PropsWithChildren<BaseLayoutProps>) => {
  const {
    children,
    className = "",
    background = "",
    minHeight = "h-screen",
  } = props;
  return (
    <main className="bg-[#EFFAF7] dark:bg-gray-900 min-h-screen">
      {background && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{ backgroundImage: `url(${background})` }}
          aria-hidden="true"
        />
      )}

      <Suspense>
        <div className="md:max-w-[90%] mx-auto py-10 px-8 md:px-0 relative">
          <span className="sticky top-10 z-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="https://res.cloudinary.com/ddynvenje/image/upload/v1751293217/vina/vina-logo_jeyist.svg"
                alt="Via Logo"
                width={91}
                height={48}
                className="object-cover"
              />
            </Link>

            <span className="sticky top-10 right-0 z-20">
              <ThemeToggle />
            </span>
          </span>
          <div className={`${background}  ${className} `}>{children}</div>
        </div>
      </Suspense>
    </main>
  );
};
