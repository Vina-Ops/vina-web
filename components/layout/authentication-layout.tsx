"use client";

import { Suspense } from "react";
import { BaseLayout } from "./base-layout";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  logoComponent?: React.ComponentType<{ className?: string }>;
  backgroundImage?: string;
  className?: string;
  contentClassName?: string;
  showFooter?: boolean;
  footerContent?: React.ReactNode;
}

export const AuthLayout = ({
  children,
  title,
  subtitle,
  logoComponent: LogoComponent,
  backgroundImage,
  className = "",
  contentClassName = "",
  showFooter = true,
  footerContent,
}: AuthLayoutProps) => (
  <BaseLayout
    className={`flex items-start md:items-center justify-center bg-green bg-[#EFFAF7 pt-10 md:py-20 px-4 sm:px-6 lg:px-8 ${className}`}
  >
    {/* Background Image/Pattern */}
    {backgroundImage && (
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        aria-hidden="true"
      />
    )}

    <div className="relative z-10 w-full space-y-8">
      {/* Header Section */}
      {/* Content Area */}
      <div
        className={`${contentClassName} flex justify-center items-center h-full`}
      >
        <Suspense>{children}</Suspense>
      </div>
    </div>
  </BaseLayout>
);
