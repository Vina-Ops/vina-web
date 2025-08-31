"use client";

import React, { useState } from "react";
import {
  Search,
  Star,
  MapPin,
  Clock,
  MessageCircle,
  Filter,
} from "lucide-react";
import {
  FixedNavbar,
  defaultNavItems,
} from "@/components/navigation/FixedNavbar";
import { usePathname } from "next/navigation";

// Mock data for therapists
const mockTherapists = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialization: "Anxiety & Depression",
    rating: 4.8,
    reviewCount: 127,
    location: "New York, NY",
    languages: ["English", "Spanish"],
    availability: "Available today",
    hourlyRate: "$150",
    avatar: "SJ",
    isOnline: true,
    experience: "8 years",
    approach: "Cognitive Behavioral Therapy",
    description:
      "Specialized in treating anxiety disorders and depression with evidence-based approaches.",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialization: "Stress Management",
    rating: 4.9,
    reviewCount: 89,
    location: "San Francisco, CA",
    languages: ["English", "Mandarin"],
    availability: "Available tomorrow",
    hourlyRate: "$180",
    avatar: "MC",
    isOnline: false,
    experience: "12 years",
    approach: "Mindfulness-Based Therapy",
    description:
      "Expert in stress management and work-life balance with mindfulness techniques.",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialization: "Family Therapy",
    rating: 4.7,
    reviewCount: 156,
    location: "Los Angeles, CA",
    languages: ["English", "Spanish"],
    availability: "Available today",
    hourlyRate: "$140",
    avatar: "ER",
    isOnline: true,
    experience: "10 years",
    approach: "Family Systems Therapy",
    description:
      "Dedicated to helping families improve communication and resolve conflicts.",
  },
  {
    id: "4",
    name: "Dr. David Thompson",
    specialization: "Trauma & PTSD",
    rating: 4.9,
    reviewCount: 203,
    location: "Chicago, IL",
    languages: ["English"],
    availability: "Available next week",
    hourlyRate: "$200",
    avatar: "DT",
    isOnline: false,
    experience: "15 years",
    approach: "EMDR Therapy",
    description:
      "Specialized in trauma recovery and PTSD treatment with EMDR therapy.",
  },
  {
    id: "5",
    name: "Dr. Lisa Park",
    specialization: "Relationship Counseling",
    rating: 4.6,
    reviewCount: 94,
    location: "Seattle, WA",
    languages: ["English", "Korean"],
    availability: "Available today",
    hourlyRate: "$160",
    avatar: "LP",
    isOnline: true,
    experience: "6 years",
    approach: "Gottman Method",
    description:
      "Focused on helping couples build stronger, healthier relationships.",
  },
  {
    id: "6",
    name: "Dr. James Wilson",
    specialization: "Addiction Recovery",
    rating: 4.8,
    reviewCount: 178,
    location: "Austin, TX",
    languages: ["English"],
    availability: "Available tomorrow",
    hourlyRate: "$170",
    avatar: "JW",
    isOnline: false,
    experience: "14 years",
    approach: "Motivational Interviewing",
    description: "Expert in addiction recovery and substance abuse treatment.",
  },
];

export default function TherapistsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [selectedTherapist, setSelectedTherapist] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();

  // Update navigation items to reflect current path
  const updatedNavItems = defaultNavItems.map((item) => ({
    ...item,
    isActive: item.href
      ? pathname === item.href || pathname.startsWith(item.href)
      : false,
  }));

  const specializations = [
    "all",
    "Anxiety & Depression",
    "Stress Management",
    "Family Therapy",
    "Trauma & PTSD",
    "Relationship Counseling",
    "Addiction Recovery",
  ];

  const filteredTherapists = mockTherapists.filter((therapist) => {
    const matchesSearch =
      therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      therapist.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization =
      selectedSpecialization === "all" ||
      therapist.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  const handleTherapistClick = (therapist: any) => {
    setSelectedTherapist(therapist);
    setShowModal(true);
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
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8 ml-4 md:ml-0">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Find Your Therapist
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Connect with licensed therapists who can help you on your
                  mental wellness journey
                </p>
              </div>

              {/* Search and Filters */}
              <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search therapists by name or specialization..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green focus:border-transparent"
                  >
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec === "all" ? "All Specializations" : spec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Results Count */}
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredTherapists.length} therapist
                  {filteredTherapists.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {/* Therapists Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredTherapists.map((therapist) => (
                  <div
                    key={therapist.id}
                    onClick={() => handleTherapistClick(therapist)}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
                  >
                    <div className="p-4 md:p-6">
                      <div className="flex items-start space-x-3 md:space-x-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-green rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {therapist.avatar}
                          </div>
                          {therapist.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green border-2 border-white dark:border-gray-800 rounded-full"></div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {therapist.name}
                          </h3>
                          <p className="text-sm text-green font-medium mb-2">
                            {therapist.specialization}
                          </p>

                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                                {therapist.rating}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              ({therapist.reviewCount} reviews)
                            </span>
                          </div>

                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {therapist.location}
                          </div>

                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <Clock className="w-4 h-4 mr-1" />
                            {therapist.availability}
                          </div>

                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="text-lg font-semibold text-green">
                              {therapist.hourlyRate}/hr
                            </span>
                            <button className="px-3 md:px-4 py-2 bg-green text-white rounded-lg hover:bg-green/80 transition-colors text-sm font-medium">
                              Book Session
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTherapists.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No therapists found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your search criteria or filters
                  </p>
                </div>
              )}
            </div>

            {/* Therapist Detail Modal */}
            {showModal && selectedTherapist && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-4 md:p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-20 h-20 bg-green rounded-full flex items-center justify-center text-white font-semibold text-xl">
                            {selectedTherapist.avatar}
                          </div>
                          {selectedTherapist.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green border-2 border-white dark:border-gray-800 rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {selectedTherapist.name}
                          </h2>
                          <p className="text-lg text-green font-medium">
                            {selectedTherapist.specialization}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          About
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {selectedTherapist.description}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Details
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Experience:
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {selectedTherapist.experience}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Approach:
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {selectedTherapist.approach}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Languages:
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {selectedTherapist.languages.join(", ")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Rate:
                            </span>
                            <span className="text-green font-semibold">
                              {selectedTherapist.hourlyRate}/hr
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <button className="flex-1 px-4 py-3 bg-green text-white rounded-lg hover:bg-green/80 transition-colors font-medium">
                        Book Session
                      </button>
                      <button className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
