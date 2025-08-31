"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { locales, defaultLocale } from "@/i18n";

export const LocaleDetector = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  useEffect(() => {
    // Check for stored preference and redirect if different from current locale
    const storedPreference = localStorage.getItem("preferred-locale");

    if (storedPreference && locales.includes(storedPreference as any)) {
      if (storedPreference !== currentLocale) {
        // Remove the current locale from the pathname
        const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "");

        // Navigate to the stored preference
        if (storedPreference === "en") {
          router.replace(pathWithoutLocale || "/");
        } else {
          router.replace(`/${storedPreference}${pathWithoutLocale}`);
        }
      }
    }
  }, [currentLocale, pathname, router]);

  return null; // This component doesn't render anything
};
