// Role-based routing utility
export type UserRole = "admin" | "therapist" | "customer";

export interface User {
  id: string;
  role: UserRole;
  email: string;
  first_name?: string;
  last_name?: string;
}

/**
 * Get the appropriate redirect path based on user role
 * @param user - The user object with role information
 * @returns The path to redirect to
 */
export const getRoleBasedRedirectPath = (user: User | null): string => {
  if (!user) {
    return "/auth/login";
  }

  switch (user.role) {
    case "admin":
      return "/admin";
    case "therapist":
      return "/therapist";
    case "customer":
      return "/home";
    default:
      return "/home";
  }
};

/**
 * Check if user has access to a specific route
 * @param user - The user object with role information
 * @param allowedRoles - Array of roles that can access the route
 * @returns boolean indicating if user has access
 */
export const hasRouteAccess = (
  user: User | null,
  allowedRoles: UserRole[]
): boolean => {
  if (!user) {
    return false;
  }

  return allowedRoles.includes(user.role);
};

/**
 * Get the display name for a role
 * @param role - The user role
 * @returns The display name for the role
 */
export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case "admin":
      return "Administrator";
    case "therapist":
      return "Therapist";
    case "customer":
      return "Customer";
    default:
      return "User";
  }
};

/**
 * Get the default page title for a role
 * @param role - The user role
 * @returns The default page title
 */
export const getRolePageTitle = (role: UserRole): string => {
  switch (role) {
    case "admin":
      return "Admin Dashboard";
    case "therapist":
      return "Therapist Dashboard";
    case "customer":
      return "Home";
    default:
      return "Dashboard";
  }
};
