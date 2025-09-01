"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

import { useUser } from "@/context/user-context";
import { removeToken } from "@/helpers/logout";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  MessageSquare,
  Calendar,
  FileText,
  Settings,
  Menu,
  X,
  LogOut,
  UserCheck,
  Clock,
  BarChart3,
  Bell,
  Heart,
} from "lucide-react";
import { TopToastProvider } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Logo from "@/components/logo";

interface TherapistLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/therapist",
    icon: LayoutDashboard,
  },
  {
    name: "Profile",
    href: "/therapist/profile",
    icon: User,
  },
  {
    name: "Sessions",
    href: "/therapist/sessions",
    icon: MessageSquare,
  },
  {
    name: "Schedule",
    href: "/therapist/schedule",
    icon: Calendar,
  },
  {
    name: "Patients",
    href: "/therapist/patients",
    icon: Heart,
  },
  {
    name: "Reports",
    href: "/therapist/reports",
    icon: FileText,
  },
  {
    name: "Analytics",
    href: "/therapist/analytics",
    icon: BarChart3,
  },
  {
    name: "Notifications",
    href: "/therapist/notifications",
    icon: Bell,
  },
  {
    name: "Settings",
    href: "/therapist/settings",
    icon: Settings,
  },
];

export default function TherapistLayout({ children }: TherapistLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, setUser } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await removeToken();
      setUser(null);
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <TopToastProvider>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Mobile sidebar */}
          <div
            className={cn(
              "fixed inset-0 z-50 lg:hidden",
              sidebarOpen ? "block" : "hidden"
            )}
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-800">
              <div className="flex h-16 items-center justify-between px-4">
                <div className="flex items-center">
                  <UserCheck className="h-8 w-8 text-green-600" />
                  <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                    Therapist Portal
                  </span>
                </div>

                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                        isActive
                          ? "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className={cn(
                          "mr-3 h-5 w-5 flex-shrink-0",
                          isActive
                            ? "text-green-500"
                            : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                        )}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              {/* User info in mobile sidebar */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <User className="h-4 w-4 text-green-600 dark:text-green-300" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {(user as any)?.name || (user as any)?.first_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(user as any)?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop sidebar */}
          <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
            <div className="flex flex-col flex-grow bg-white dark:bg-white/70 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Logo />
                <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-dark-green">
                  Therapist Portal
                </span>
              </div>
              <nav className="mt-8 flex-1 space-y-1 px-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                        isActive
                          ? "bg-green/20 font-bold text-green dark:bg-white/30 dark:text-white"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "mr-3 h-5 w-5 flex-shrink-0",
                          isActive
                            ? "text-green dark:text-light-green"
                            : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                        )}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              {/* User info in desktop sidebar */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-green/20 dark:bg-green-900 flex items-center justify-center">
                      <User className="h-4 w-4 text-green-600 dark:text-green-300" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {(user as any)?.name || (user as any)?.first_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(user as any)?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:pl-64">
            {/* Top bar */}
            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 lg:hidden dark:text-gray-300"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>

              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <div className="flex flex-1" />
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                  <ThemeToggle />
                  <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:bg-gray-700" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Page content */}
            <main className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </ThemeProvider>
    </TopToastProvider>
  );
}
