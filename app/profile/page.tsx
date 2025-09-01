"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
} from "lucide-react";
import {
  FixedNavbar,
  defaultNavItems,
} from "@/components/navigation/FixedNavbar";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/user-context";
import { getUserProfileByUuid } from "@/services/general-service";

// Interface for user profile data based on API response
interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  dob: string;
  tagline: string | null;
  bio: string | null;
  licensing_body: string | null;
  years_of_experience: number | null;
  image_url: string | null;
  role: string;
  created_at: string;
  license_number: string | null;
  license_status: string;
  specialties: string[];
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editedUser, setEditedUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useUser();
  const pathname = usePathname();

  // Update navigation items to reflect current path
  const updatedNavItems = defaultNavItems.map((item) => {
    if (!item.href) return { ...item, isActive: false };

    let isActive = false;

    // Handle exact matches first
    if (pathname === item.href) {
      isActive = true;
    }
    // Handle sub-pages (but not for home)
    else if (item.href !== "/" && pathname?.startsWith(item.href + "/")) {
      isActive = true;
    }

    return { ...item, isActive };
  });

  // Helper function to get user initials
  const getUserInitials = (user: UserProfile) => {
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  // Helper function to get role display name
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "customer":
        return "Customer";
      case "therapist":
        return "Therapist";
      case "admin":
        return "Administrator";
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  const handleEdit = () => {
    setEditedUser(user);
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if ((currentUser as any)?.id) {
        try {
          setLoading(true);
          const data = await getUserProfileByUuid((currentUser as any).id);
          setUser(data);
          setEditedUser(data);
          setError(null);
        } catch (err) {
          setError("Failed to load profile");
          console.error("Error fetching user profile:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [(currentUser as any)?.id]);

  const handleInputChange = (field: string, value: string) => {
    setEditedUser((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="flex h-screen">
      <FixedNavbar
        navItems={updatedNavItems}
        showSearch={true}
        showConnectionStatus={true}
        showThemeToggle={true}
      />
      <div className="flex flex-col flex-1 md:ml-64">
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="p-4 md:p-6">
            <div className="">
              {/* Header */}
              <div className="mb-8 ml-4 md:ml-0">
                <div>
                  <div className="flex items-start justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      Profile
                    </h1>

                    {!isEditing && !loading && user && (
                      <button
                        onClick={handleEdit}
                        className="flex items-center space-x-2 px-4 py-2 bg-green text-white rounded-lg hover:bg-green/80 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                    )}
                    {isEditing && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleSave}
                          className="flex items-center space-x-2 px-4 py-2 bg-green text-white rounded-lg hover:bg-green/80 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage your personal information and preferences
                  </p>
                </div>
              </div>

              {/* Error State */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Loading profile...
                  </p>
                </div>
              )}

              {/* Profile Content */}
              {!loading && user && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Picture Section */}
                  <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                      <div className="text-center">
                        <div className="relative inline-block">
                          <div className="w-32 h-32 bg-green rounded-full flex items-center justify-center text-white font-semibold text-3xl mx-auto mb-4">
                            {getUserInitials(user)}
                          </div>
                          <button className="absolute bottom-4 right-4 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:shadow-lg transition-shadow">
                            <Camera className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </button>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                          {user.first_name} {user.last_name}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Member since{" "}
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                        {!isEditing && (
                          <div className="text-left">
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                              Bio
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {user.bio}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Profile Information */}
                  <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Personal Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            First Name
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedUser?.first_name || ""}
                              onChange={(e) =>
                                handleInputChange("first_name", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green focus:border-transparent"
                            />
                          ) : (
                            <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                              <User className="w-4 h-4 text-gray-400" />
                              <span>{user.first_name}</span>
                            </div>
                          )}
                        </div>

                        {/* Last Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Last Name
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedUser?.last_name || ""}
                              onChange={(e) =>
                                handleInputChange("last_name", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green focus:border-transparent"
                            />
                          ) : (
                            <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                              <User className="w-4 h-4 text-gray-400" />
                              <span>{user.last_name}</span>
                            </div>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                          </label>
                          {isEditing ? (
                            <input
                              type="email"
                              value={editedUser?.email || ""}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green focus:border-transparent"
                            />
                          ) : (
                            <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span>{user.email}</span>
                            </div>
                          )}
                        </div>

                        {/* Gender */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Gender
                          </label>
                          {isEditing ? (
                            <select
                              value={editedUser?.gender || ""}
                              onChange={(e) =>
                                handleInputChange("gender", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green focus:border-transparent min-w-0"
                              style={{
                                width: "100%",
                                padding: "8px 12px",
                                fontSize: "14px",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                backgroundColor: "white",
                                WebkitAppearance: "none",
                                MozAppearance: "none",
                                appearance: "none",
                                backgroundImage: "none",
                              }}
                            >
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                          ) : (
                            <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                              <User className="w-4 h-4 text-gray-400" />
                              <span>
                                {user.gender
                                  ? user.gender.charAt(0).toUpperCase() +
                                    user.gender.slice(1)
                                  : "Not specified"}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Date of Birth */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Date of Birth
                          </label>
                          {isEditing ? (
                            <input
                              type="date"
                              value={editedUser?.dob || ""}
                              onChange={(e) =>
                                handleInputChange("dob", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green focus:border-transparent"
                            />
                          ) : (
                            <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>
                                {user.dob
                                  ? formatDate(user.dob)
                                  : "Not specified"}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Role */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Role
                          </label>
                          <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>{getRoleDisplayName(user.role)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bio (when editing) */}
                      {isEditing && (
                        <div className="mt-6">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Bio
                          </label>
                          <textarea
                            value={editedUser?.bio || ""}
                            onChange={(e) =>
                              handleInputChange("bio", e.target.value)
                            }
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green focus:border-transparent resize-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
