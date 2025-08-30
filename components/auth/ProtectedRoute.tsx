"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Spinner } from "@/components/ui/spinner/spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("user" | "therapist" | "admin")[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles = ["user", "therapist", "admin"],
  redirectTo = "/auth/login",
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // If user has no role or role is not allowed, redirect
      if (!user?.role || !allowedRoles.includes(user.role)) {
        // Redirect based on user role
        if (user?.role === "admin") {
          router.push("/admin");
        } else if (user?.role === "therapist") {
          router.push("/therapist");
        } else if (user?.role === "user") {
          router.push("/dashboard");
        } else {
          router.push(redirectTo);
        }
        return;
      }
    }
  }, [user, loading, isAuthenticated, allowedRoles, redirectTo, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Spinner className="h-8 w-8 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated or role not allowed, don't render children
  if (!isAuthenticated || !user?.role || !allowedRoles.includes(user.role)) {
    return null;
  }

  // User is authenticated and has proper role, render children
  return <>{children}</>;
}

// Specific route protectors for different user types
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["admin"]} redirectTo="/auth/login">
      {children}
    </ProtectedRoute>
  );
}

export function TherapistRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["therapist"]} redirectTo="/auth/login">
      {children}
    </ProtectedRoute>
  );
}

export function UserRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["user"]} redirectTo="/auth/login">
      {children}
    </ProtectedRoute>
  );
}

export function AuthenticatedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute
      allowedRoles={["user", "therapist", "admin"]}
      redirectTo="/auth/login"
    >
      {children}
    </ProtectedRoute>
  );
}
