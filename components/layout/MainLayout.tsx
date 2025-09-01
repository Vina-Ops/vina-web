"use client";

import React from "react";
import {
  FixedNavbar,
  defaultNavItems,
} from "@/components/navigation/FixedNavbar";
import { useUser } from "@/context/user-context";
import { usePathname } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, loading } = useUser();
  const pathname = usePathname();

  // Don't show navbar on auth pages or landing page
  const hideNavbarPaths = ["/auth/login", "/auth/register", "/", "/?start=1"];

  const shouldHideNavbar = hideNavbarPaths.some(
    (path) => pathname === path || pathname?.startsWith(path.replace("?", ""))
  );

  if (shouldHideNavbar || loading || !user) {
    return <>{children}</>;
  }

  // Update navigation items to reflect current path
  const updatedNavItems = defaultNavItems.map((item) => ({
    ...item,
    isActive: item.href
      ? pathname === item.href || pathname?.startsWith(item.href)
      : false,
  }));

  return (
    <div className="flex h-screen">
      <FixedNavbar
        navItems={updatedNavItems}
        showSearch={true}
        showConnectionStatus={true}
        showThemeToggle={true}
      />
      <div className="flex flex-col flex-1 md:ml-64">
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};
