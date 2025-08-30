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
  Star,
  Award,
  BookOpen,
  Clock,
  Globe,
  Camera,
} from "lucide-react";

interface TherapistProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  specialization: string;
  bio: string;
  experience: number;
  education: string;
  certifications: string[];
  languages: string[];
  avatar: string;
  rating: number;
  totalSessions: number;
  joinDate: string;
  availability: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
}

const mockProfile: TherapistProfile = {
  id: "1",
  name: "Dr. Sarah Johnson",
  email: "sarah.johnson@therapy.com",
  phone: "+1 (555) 123-4567",
  location: "New York, NY",
  specialization: "Anxiety & Depression, Trauma & PTSD, Couples Therapy",
  bio: "I am a licensed clinical psychologist with over 10 years of experience helping individuals and couples navigate life's challenges. My approach combines evidence-based therapies with a warm, empathetic style that creates a safe space for healing and growth.",
  experience: 10,
  education: "Ph.D. in Clinical Psychology, Columbia University",
  certifications: [
    "Licensed Clinical Psychologist (NY)",
    "Certified EMDR Therapist",
    "Gottman Method Couples Therapy Level 2",
    "Cognitive Behavioral Therapy Specialist",
  ],
  languages: ["English", "Spanish"],
  avatar:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
  rating: 4.8,
  totalSessions: 156,
  joinDate: "2023-01-15",
  availability: {
    monday: { start: "09:00", end: "17:00", available: true },
    tuesday: { start: "09:00", end: "17:00", available: true },
    wednesday: { start: "09:00", end: "17:00", available: true },
    thursday: { start: "09:00", end: "17:00", available: true },
    friday: { start: "09:00", end: "17:00", available: true },
    saturday: { start: "10:00", end: "14:00", available: true },
    sunday: { start: "", end: "", available: false },
  },
};

export default function TherapistProfilePage() {
  const [profile, setProfile] = useState<TherapistProfile>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<TherapistProfile>(mockProfile);

  const handleSave = () => {
    setProfile(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof TherapistProfile, value: any) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleAvailabilityChange = (day: string, field: string, value: any) => {
    setEditData({
      ...editData,
      availability: {
        ...editData.availability,
        [day]: {
          ...editData.availability[day as keyof typeof editData.availability],
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Profile
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your professional profile and preferences
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    className="h-24 w-24 rounded-full object-cover"
                    src={profile.avatar}
                    alt={profile.name}
                  />
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-green-500 text-white p-1 rounded-full hover:bg-green-600">
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="block w-full text-center border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    />
                  ) : (
                    profile.name
                  )}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.specialization}
                      onChange={(e) =>
                        handleInputChange("specialization", e.target.value)
                      }
                      className="block w-full text-center border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    />
                  ) : (
                    profile.specialization
                  )}
                </p>
                <div className="mt-4 flex items-center justify-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">
                    {profile.rating}
                  </span>
                  <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                    ({profile.totalSessions} sessions)
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-gray-400 mr-3" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    />
                  ) : (
                    <span className="text-gray-900 dark:text-white">
                      {profile.email}
                    </span>
                  )}
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 text-gray-400 mr-3" />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    />
                  ) : (
                    <span className="text-gray-900 dark:text-white">
                      {profile.phone}
                    </span>
                  )}
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    />
                  ) : (
                    <span className="text-gray-900 dark:text-white">
                      {profile.location}
                    </span>
                  )}
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-500 dark:text-gray-400">
                    Member since{" "}
                    {new Date(profile.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                About Me
              </h3>
              {isEditing ? (
                <textarea
                  rows={4}
                  value={editData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          {/* Credentials */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                Credentials
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Education
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.education}
                      onChange={(e) =>
                        handleInputChange("education", e.target.value)
                      }
                      className="block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">
                      {profile.education}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Experience
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editData.experience}
                      onChange={(e) =>
                        handleInputChange(
                          "experience",
                          parseInt(e.target.value)
                        )
                      }
                      className="block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">
                      {profile.experience} years
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Certifications
                  </label>
                  {isEditing ? (
                    <div className="space-y-2">
                      {editData.certifications.map((cert, index) => (
                        <input
                          key={index}
                          type="text"
                          value={cert}
                          onChange={(e) => {
                            const newCerts = [...editData.certifications];
                            newCerts[index] = e.target.value;
                            handleInputChange("certifications", newCerts);
                          }}
                          className="block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        />
                      ))}
                      <button
                        onClick={() =>
                          handleInputChange("certifications", [
                            ...editData.certifications,
                            "",
                          ])
                        }
                        className="text-sm text-green-600 hover:text-green-500"
                      >
                        + Add Certification
                      </button>
                    </div>
                  ) : (
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      {profile.certifications.map((cert, index) => (
                        <li key={index}>{cert}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Languages
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.languages.join(", ")}
                      onChange={(e) =>
                        handleInputChange(
                          "languages",
                          e.target.value.split(", ")
                        )
                      }
                      className="block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                      placeholder="English, Spanish, French"
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">
                      {profile.languages.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                Availability
              </h3>
              <div className="space-y-3">
                {Object.entries(profile.availability).map(([day, schedule]) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {day}
                    </span>
                    <div className="flex items-center space-x-2">
                      {isEditing ? (
                        <>
                          <input
                            type="checkbox"
                            checked={
                              editData.availability[
                                day as keyof typeof editData.availability
                              ].available
                            }
                            onChange={(e) =>
                              handleAvailabilityChange(
                                day,
                                "available",
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          {editData.availability[
                            day as keyof typeof editData.availability
                          ].available && (
                            <>
                              <input
                                type="time"
                                value={
                                  editData.availability[
                                    day as keyof typeof editData.availability
                                  ].start
                                }
                                onChange={(e) =>
                                  handleAvailabilityChange(
                                    day,
                                    "start",
                                    e.target.value
                                  )
                                }
                                className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                              />
                              <span className="text-gray-500">to</span>
                              <input
                                type="time"
                                value={
                                  editData.availability[
                                    day as keyof typeof editData.availability
                                  ].end
                                }
                                onChange={(e) =>
                                  handleAvailabilityChange(
                                    day,
                                    "end",
                                    e.target.value
                                  )
                                }
                                className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                              />
                            </>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {schedule.available
                            ? `${schedule.start} - ${schedule.end}`
                            : "Not available"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
