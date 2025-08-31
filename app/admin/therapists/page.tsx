"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Clock,
  X,
  Save,
} from "lucide-react";
import { registerTherapist } from "@/services/general-service";

interface Therapist {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  location: string;
  status: "active" | "pending" | "inactive";
  rating: number;
  sessionsCompleted: number;
  joinDate: string;
  avatar: string;
}

const mockTherapists: Therapist[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@therapy.com",
    phone: "+1 (555) 123-4567",
    specialization: "Anxiety & Depression",
    location: "New York, NY",
    status: "active",
    rating: 4.8,
    sessionsCompleted: 156,
    joinDate: "2023-01-15",
    avatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    email: "michael.chen@therapy.com",
    phone: "+1 (555) 234-5678",
    specialization: "Trauma & PTSD",
    location: "Los Angeles, CA",
    status: "pending",
    rating: 0,
    sessionsCompleted: 0,
    joinDate: "2024-01-20",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@therapy.com",
    phone: "+1 (555) 345-6789",
    specialization: "Couples Therapy",
    location: "Chicago, IL",
    status: "active",
    rating: 4.9,
    sessionsCompleted: 203,
    joinDate: "2022-08-10",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    email: "james.wilson@therapy.com",
    phone: "+1 (555) 456-7890",
    specialization: "Addiction Recovery",
    location: "Houston, TX",
    status: "inactive",
    rating: 4.6,
    sessionsCompleted: 89,
    joinDate: "2023-03-22",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "5",
    name: "Dr. Lisa Thompson",
    email: "lisa.thompson@therapy.com",
    phone: "+1 (555) 567-8901",
    specialization: "Child & Adolescent",
    location: "Miami, FL",
    status: "active",
    rating: 4.7,
    sessionsCompleted: 134,
    joinDate: "2023-06-05",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
];

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  inactive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const statusLabels = {
  active: "Active",
  pending: "Pending",
  inactive: "Inactive",
};

export default function TherapistsPage() {
  const [therapists, setTherapists] = useState<Therapist[]>(mockTherapists);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(
    null
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    gender: "",
    dob: "",
    tagline: "",
    bio: "",
    license_number: "",
    licensing_body: "",
    license_status: "active",
    years_of_experience: 0,
    specialties: [] as string[],
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const filteredTherapists = therapists.filter((therapist) => {
    const matchesSearch =
      therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      therapist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      therapist.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || therapist.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (
    therapistId: string,
    newStatus: Therapist["status"]
  ) => {
    setTherapists(
      therapists.map((t) =>
        t.id === therapistId ? { ...t, status: newStatus } : t
      )
    );
  };

  const handleDeleteTherapist = (therapistId: string) => {
    setTherapists(therapists.filter((t) => t.id !== therapistId));
  };

  const handleCreateTherapist = async () => {
    try {
      setIsCreating(true);
      setCreateError(null);
      
      const response = await registerTherapist(createForm);
      
      // Add the new therapist to the list (you might want to fetch the updated list instead)
      const newTherapist: Therapist = {
        id: response.id || Date.now().toString(),
        name: `${createForm.first_name} ${createForm.last_name}`,
        email: createForm.email,
        phone: "",
        specialization: "",
        location: "",
        status: "pending",
        rating: 0,
        sessionsCompleted: 0,
        joinDate: new Date().toISOString().split('T')[0],
        avatar: "",
      };
      
      setTherapists([...therapists, newTherapist]);
      setShowCreateModal(false);
      setCreateForm({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        gender: "",
        dob: "",
        tagline: "",
        bio: "",
        license_number: "",
        licensing_body: "",
        license_status: "active",
        years_of_experience: 0,
        specialties: [],
      });
    } catch (error: any) {
      setCreateError(error.response?.data?.message || "Failed to create therapist");
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setCreateForm(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Therapists Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage therapist accounts, applications, and profiles
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Therapist
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search therapists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-end text-sm text-gray-500 dark:text-gray-400">
              {filteredTherapists.length} of {therapists.length} therapists
            </div>
          </div>
        </div>
      </div>

      {/* Therapists List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            {filteredTherapists.map((therapist) => (
              <div
                key={therapist.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center space-x-4">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={therapist.avatar}
                    alt={therapist.name}
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {therapist.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {therapist.email}
                      </span>
                      <span className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {therapist.phone}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {therapist.location}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        {therapist.specialization}
                      </span>
                      {therapist.rating > 0 && (
                        <span className="flex items-center text-yellow-600">
                          <Star className="h-4 w-4 mr-1 fill-current" />
                          {therapist.rating}
                        </span>
                      )}
                      <span className="flex items-center text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        {therapist.sessionsCompleted} sessions
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusColors[therapist.status]
                    }`}
                  >
                    {statusLabels[therapist.status]}
                  </span>

                  {/* Actions */}
                  <div className="relative">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTherapists.length === 0 && (
            <div className="text-center py-12">
              <UserX className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No therapists found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Active Therapists
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {therapists.filter((t) => t.status === "active").length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Pending Approval
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {therapists.filter((t) => t.status === "pending").length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserX className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Inactive
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {therapists.filter((t) => t.status === "inactive").length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Sessions
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {therapists.reduce(
                      (sum, t) => sum + t.sessionsCompleted,
                      0
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Therapist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Add New Therapist
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {createError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">{createError}</p>
                </div>
              )}

              <form onSubmit={(e) => { e.preventDefault(); handleCreateTherapist(); }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={createForm.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="therapist@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={createForm.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter password"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={createForm.first_name}
                        onChange={(e) => handleInputChange("first_name", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={createForm.last_name}
                        onChange={(e) => handleInputChange("last_name", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                                     <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                       Gender *
                     </label>
                     <select
                       required
                       value={createForm.gender}
                       onChange={(e) => handleInputChange("gender", e.target.value)}
                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     >
                       <option value="">Select Gender</option>
                       <option value="male">Male</option>
                       <option value="female">Female</option>
                       <option value="other">Other</option>
                     </select>
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                       Date of Birth *
                     </label>
                     <input
                       type="date"
                       required
                       value={createForm.dob}
                       onChange={(e) => handleInputChange("dob", e.target.value)}
                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                       Tagline
                     </label>
                     <input
                       type="text"
                       value={createForm.tagline}
                       onChange={(e) => handleInputChange("tagline", e.target.value)}
                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="Brief professional tagline"
                       maxLength={100}
                     />
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                       Bio
                     </label>
                     <textarea
                       value={createForm.bio}
                       onChange={(e) => handleInputChange("bio", e.target.value)}
                       rows={3}
                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                       placeholder="Professional bio and background"
                     />
                   </div>

                   <div className="grid grid-cols-2 gap-3">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                         License Number
                       </label>
                       <input
                         type="text"
                         value={createForm.license_number}
                         onChange={(e) => handleInputChange("license_number", e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         placeholder="License number"
                         maxLength={20}
                       />
                     </div>

                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                         License Status
                       </label>
                       <select
                         value={createForm.license_status}
                         onChange={(e) => handleInputChange("license_status", e.target.value)}
                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       >
                         <option value="active">Active</option>
                         <option value="suspended">Suspended</option>
                         <option value="expired">Expired</option>
                         <option value="under_review">Under Review</option>
                         <option value="none">None</option>
                       </select>
                     </div>
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                       Licensing Body
                     </label>
                     <input
                       type="text"
                       value={createForm.licensing_body}
                       onChange={(e) => handleInputChange("licensing_body", e.target.value)}
                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="Licensing organization"
                       maxLength={255}
                     />
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                       Years of Experience
                     </label>
                     <input
                       type="number"
                       min="0"
                       value={createForm.years_of_experience}
                       onChange={(e) => handleInputChange("years_of_experience", e.target.value)}
                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="0"
                     />
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                       Specialties
                     </label>
                     <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700">
                       <div className="grid grid-cols-2 gap-2">
                         {[
                           "Anxiety", "Depression", "Bipolar Disorder", "Panic Attacks",
                           "Grief & Loss", "Anger Management", "Seasonal Affective Disorder (SAD)",
                           "Post-Traumatic Stress Disorder (PTSD)", "Complex PTSD (C-PTSD)",
                           "Childhood Trauma", "Sexual Abuse Recovery", "Domestic Violence Support",
                           "Couples Therapy", "Family Therapy", "Communication Issues",
                           "Divorce & Separation", "Codependency", "Parenting Challenges",
                           "Self-Esteem & Confidence", "Life Purpose & Direction",
                           "Body Image Issues", "Spiritual & Existential Issues", "Burnout",
                           "Career Counseling", "Work-Life Balance", "Impostor Syndrome",
                           "Academic/Student Stress", "Addiction (alcohol, drugs)",
                           "Gambling Disorder", "Internet/Social Media Addiction",
                           "Self-Harm", "Obsessive-Compulsive Disorder (OCD)",
                           "Teen Anxiety/Depression", "Behavioral Issues in Children",
                           "ADHD in Children or Teens", "School-Related Stress",
                           "Social Skills & Peer Relationships", "Chronic Illness Support",
                           "Insomnia & Sleep Issues", "Eating Disorders (Anorexia, Bulimia, BED)",
                           "Mindfulness & Stress Management"
                         ].map((specialty) => (
                           <label key={specialty} className="flex items-center space-x-2 text-sm">
                             <input
                               type="checkbox"
                               checked={createForm.specialties.includes(specialty)}
                               onChange={() => handleSpecialtyToggle(specialty)}
                               className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                             />
                             <span className="text-gray-700 dark:text-gray-300">{specialty}</span>
                           </label>
                         ))}
                       </div>
                     </div>
                   </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isCreating ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Save className="h-4 w-4 mr-2" />
                        Create Therapist
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
