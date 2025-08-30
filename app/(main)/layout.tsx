"use client";

import React from "react";
import {
  FixedNavbar,
  defaultNavItems,
} from "@/components/navigation/FixedNavbar";
import { useAuth } from "@/context/auth-context";
import { usePathname } from "next/navigation";
import { AuthenticatedRoute } from "@/components/auth/ProtectedRoute";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Update navigation items to reflect current path
  const updatedNavItems = defaultNavItems.map((item) => ({
    ...item,
    isActive: item.href
      ? pathname === item.href || pathname.startsWith(item.href)
      : false,
  }));

  return (
    <AuthenticatedRoute>
      <div className="flex h-screen">
        <FixedNavbar
          navItems={updatedNavItems}
          showSearch={true}
          showConnectionStatus={true}
          showThemeToggle={true}
        />
        <div className="flex flex-col flex-1 ml-64">
          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
            {children}
          </main>
        </div>
      </div>
    </AuthenticatedRoute>
  );
}
