"use client";

import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "therapist" | "user";
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  requiredRole,
  redirectTo = "/auth/login",
}: AuthGuardProps) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If still loading, wait
    if (loading) {
      // console.log("Still loading, waiting...");
      return;
    }

    // If no user after loading is complete, redirect to login
    if (!user && !loading) {
      // console.log("No user found after loading, redirecting to login");
      router.push(redirectTo);
      return;
    }

    // If role is required, check user role
    if (requiredRole && (user as any).role !== requiredRole) {
      // console.log("User role mismatch, redirecting to appropriate dashboard");
      // Redirect based on user's actual role
      switch ((user as any).role) {
        case "admin":
          router.push("/admin");
          break;
        case "therapist":
          router.push("/therapist");
          break;
        case "user":
        case "customer": // Treat customer as user
          router.push("/dashboard");
          break;
        default:
          router.push("/dashboard");
      }
    } else {
      // console.log("User authenticated and has correct role, allowing access");
    }
  }, [user, requiredRole, redirectTo, router, loading]);

  // Show loading while checking authentication
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // If role is required and user doesn't have the right role, show loading
  if (requiredRole && (user as any).role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // User is authenticated and has the right role (if required)
  // console.log("AuthGuard: Rendering children");
  return <>{children}</>;
}
