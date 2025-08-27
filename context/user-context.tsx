"use client";

import useAuthApi from "@/hooks/use-auth-api";
import { getUserProfile } from "@/services/auth-service";
import React from "react";
import { createContext } from "react";

type UserProfile = ReturnType<typeof getUserProfile> extends Promise<infer T>
  ? T
  : unknown;

const UserContext = createContext<{
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const { execute, loading, data, error } = useAuthApi(getUserProfile);
  const hasAttemptedFetch = React.useRef(false);

  React.useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  React.useEffect(() => {
    if (error) {
      console.error("Error fetching user profile:", error);
      // Don't log errors on auth pages to avoid spam
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/auth/")
      ) {
        console.error("Error fetching user profile:", error);
      }
    }
  }, [error]);

  React.useEffect(() => {
    // Only execute once on mount if user is null and not currently loading
    // Also check if we're not on an auth page to avoid unnecessary calls
    if (!user && !loading && !hasAttemptedFetch.current) {
      const isOnAuthPage =
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/auth/");

      // Only fetch user profile if we're not on an auth page
      if (!isOnAuthPage) {
        hasAttemptedFetch.current = true;
        execute();
      } else {
        // Mark as attempted to prevent future attempts on auth pages
        hasAttemptedFetch.current = true;
      }
    }
  }, []); // Empty dependency array - only run once on mount

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
