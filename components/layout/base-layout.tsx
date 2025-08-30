"use client";

import React, { PropsWithChildren, Suspense } from "react";

import { ThemeToggle } from "../theme/ThemeToggle";
import Logo from "../logo";

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
        <div className="md:max-w-[90%] mx-auto md:px-0 relative">
          <span className="sticky px-4 top-10 z-20 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-gray-500">
              <Logo /> Always Learning
            </span>

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
