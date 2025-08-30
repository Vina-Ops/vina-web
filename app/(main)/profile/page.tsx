"use client";

import React, { useState } from "react";
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

// Mock user data
const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  dateOfBirth: "1990-05-15",
  location: "New York, NY",
  avatar: "JD",
  interests: [
    "Anxiety Management",
    "Stress Relief",
    "Mindfulness",
    "Depression Support",
  ],
  emergencyContact: {
    name: "Jane Doe",
    relationship: "Spouse",
    phone: "+1 (555) 987-6543",
  },
  preferences: {
    notifications: true,
    emailUpdates: true,
    darkMode: false,
    language: "English",
  },
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(mockUser);
  const [activeTab, setActiveTab] = useState("personal");

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    console.log("Saving user data:", userData);
  };

  const handleCancel = () => {
    setUserData(mockUser);
    setIsEditing(false);
  };

  const updateField = (field: string, value: any) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateEmergencyContact = (field: string, value: string) => {
    setUserData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value,
      },
    }));
  };

  const updatePreferences = (field: string, value: any) => {
    setUserData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }));
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Profile
            </h1>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green text-white rounded-lg hover:bg-green/80 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-green text-white rounded-lg hover:bg-green/80 transition-colors flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Avatar and Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              {/* Avatar Section */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-green rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                    {userData.avatar}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-600">
                      <Camera className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {userData.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Member since 2024
                </p>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Sessions
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    24
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Hours
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    48
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Streak
                  </span>
                  <span className="font-semibold text-green">7 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: "personal", label: "Personal Info" },
                    { id: "emergency", label: "Emergency Contact" },
                    { id: "preferences", label: "Preferences" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "border-green text-green"
                          : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Personal Information Tab */}
                {activeTab === "personal" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={userData.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={userData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={userData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={userData.dateOfBirth}
                          onChange={(e) =>
                            updateField("dateOfBirth", e.target.value)
                          }
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={userData.location}
                        onChange={(e) =>
                          updateField("location", e.target.value)
                        }
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Interests
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {userData.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green/10 text-green rounded-full text-sm"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Emergency Contact Tab */}
                {activeTab === "emergency" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Contact Name
                        </label>
                        <input
                          type="text"
                          value={userData.emergencyContact.name}
                          onChange={(e) =>
                            updateEmergencyContact("name", e.target.value)
                          }
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Relationship
                        </label>
                        <input
                          type="text"
                          value={userData.emergencyContact.relationship}
                          onChange={(e) =>
                            updateEmergencyContact(
                              "relationship",
                              e.target.value
                            )
                          }
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={userData.emergencyContact.phone}
                        onChange={(e) =>
                          updateEmergencyContact("phone", e.target.value)
                        }
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === "preferences" && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            Push Notifications
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Receive notifications about your sessions and
                            reminders
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={userData.preferences.notifications}
                            onChange={(e) =>
                              updatePreferences(
                                "notifications",
                                e.target.checked
                              )
                            }
                            disabled={!isEditing}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green/20 dark:peer-focus:ring-green/80 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            Email Updates
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Receive email updates about your progress
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={userData.preferences.emailUpdates}
                            onChange={(e) =>
                              updatePreferences(
                                "emailUpdates",
                                e.target.checked
                              )
                            }
                            disabled={!isEditing}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green/20 dark:peer-focus:ring-green/80 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green"></div>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Language
                      </label>
                      <select
                        value={userData.preferences.language}
                        onChange={(e) =>
                          updatePreferences("language", e.target.value)
                        }
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
