"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { hasRouteAccess, UserRole, User } from "@/utils/role-routing";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  fallback,
  redirectTo = "/auth/login",
}) => {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Don't check while loading
    if (loading) return;

    // If no user, redirect to login
    if (!user) {
      router.push(redirectTo);
      return;
    }

    // Check if user has access to this route
    if (!hasRouteAccess(user as User, allowedRoles)) {
      // Redirect to appropriate dashboard based on role
      const userRole = (user as User).role;
      switch (userRole) {
        case "admin":
          router.push("/admin");
          break;
        case "therapist":
          router.push("/therapist");
          break;
        case "customer":
          router.push("/dashboard");
          break;
        default:
          router.push("/dashboard");
      }
    }
  }, [user, loading, allowedRoles, router, redirectTo]);

  // Show loading state
  if (loading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green"></div>
        </div>
      )
    );
  }

  // If no user, show loading while redirecting
  if (!user) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Redirecting to login...
            </p>
          </div>
        </div>
      )
    );
  }

  // Check if user has access
  if (!hasRouteAccess(user as User, allowedRoles)) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Redirecting to your dashboard...
            </p>
          </div>
        </div>
      )
    );
  }

  // User has access, render children
  return <>{children}</>;
};
