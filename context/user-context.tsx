"use client";

import useAuthApi from "@/hooks/use-auth-api";
import { getUserProfile } from "@/services/auth-service";
import React from "react";
import { createContext } from "react";

// Define a proper User interface instead of complex type inference
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  [key: string]: any; // Allow additional properties
}

const UserContext = createContext<{
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  loading: boolean;
}>({
  user: null,
  setUser: () => {},
  loading: false,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const { execute, loading, data, error } = useAuthApi(getUserProfile);
  const hasAttemptedFetch = React.useRef(false);

  React.useEffect(() => {
    // console.log("UserContext: data received", data);
    if (data) {
      setUser(data as UserProfile);
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
    const fetchUser = async () => {
      // console.log("UserContext: useEffect triggered", {
      //   user,
      //   loading,
      //   hasAttemptedFetch: hasAttemptedFetch.current,
      // });

      // Only execute once on mount if user is null and not currently loading
      // Also check if we're not on an auth page to avoid unnecessary calls
      if (!user && !loading && !hasAttemptedFetch.current) {
        const isOnAuthPage =
          typeof window !== "undefined" &&
          window.location.pathname.startsWith("/auth/");

        // console.log("UserContext: isOnAuthPage", isOnAuthPage);

        // Only fetch user profile if we're not on an auth page or landing page
        const currentPathname =
          typeof window !== "undefined" ? window.location.pathname : "";
        if (!isOnAuthPage && currentPathname !== "/") {
          hasAttemptedFetch.current = true;
          // console.log("UserContext: executing getUserProfile");
          const data = await execute();
          // console.log("UserContext: data received", data);
          setUser(data as UserProfile);
        } else {
          // Mark as attempted to prevent future attempts on auth pages or landing page
          hasAttemptedFetch.current = true;
          // console.log("UserContext: on auth page or landing page, skipping fetch");
        }
      }
    };

    fetchUser();
  }, []); // Empty dependency array - only run once on mount

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
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
