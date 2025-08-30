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
} from "lucide-react";

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
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
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
    </div>
  );
}
