"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { getRoleBasedRedirectPath, User } from "@/utils/role-routing";

interface RoleBasedRedirectProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleBasedRedirect: React.FC<RoleBasedRedirectProps> = ({
  children,
  fallback,
}) => {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect while loading
    if (loading) return;

    // If user is authenticated, redirect to their role-based page
    if (user) {
      const redirectPath = getRoleBasedRedirectPath(user as User);

      // Only redirect if we're not already on the correct page
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (currentPath !== redirectPath) {
          router.push(redirectPath);
        }
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green"></div>
        </div>
      )
    );
  }

  // If no user, show children (login form, etc.)
  if (!user) {
    return <>{children}</>;
  }

  // If user exists, show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          Redirecting to your dashboard...
        </p>
      </div>
    </div>
  );
};
