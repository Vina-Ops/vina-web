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
  User,
  UserX,
  Mail,
  Calendar,
  Clock,
  Shield,
  Ban,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "suspended" | "pending";
  role: "user" | "premium" | "admin";
  joinDate: string;
  lastLogin: string;
  sessionsCount: number;
  avatar: string;
  location: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    status: "active",
    role: "user",
    joinDate: "2023-01-15",
    lastLogin: "2024-01-20 14:30",
    sessionsCount: 23,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    location: "New York, NY",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    status: "active",
    role: "premium",
    joinDate: "2023-03-22",
    lastLogin: "2024-01-20 12:15",
    sessionsCount: 45,
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    location: "Los Angeles, CA",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    status: "suspended",
    role: "user",
    joinDate: "2023-06-10",
    lastLogin: "2024-01-15 09:45",
    sessionsCount: 8,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    location: "Chicago, IL",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    status: "active",
    role: "user",
    joinDate: "2023-08-05",
    lastLogin: "2024-01-20 16:20",
    sessionsCount: 12,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    location: "Houston, TX",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.brown@example.com",
    status: "pending",
    role: "user",
    joinDate: "2024-01-18",
    lastLogin: "2024-01-18 10:30",
    sessionsCount: 0,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    location: "Miami, FL",
  },
  {
    id: "6",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    status: "active",
    role: "premium",
    joinDate: "2023-11-12",
    lastLogin: "2024-01-20 11:45",
    sessionsCount: 67,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    location: "Seattle, WA",
  },
];

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  suspended: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
};

const statusLabels = {
  active: "Active",
  suspended: "Suspended",
  pending: "Pending",
};

const roleColors = {
  user: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  premium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  admin:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

const roleLabels = {
  user: "User",
  premium: "Premium",
  admin: "Admin",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleStatusChange = (userId: string, newStatus: User["status"]) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Users Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage user accounts, permissions, and access
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
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
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="premium">Premium</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-end text-sm text-gray-500 dark:text-gray-400">
              {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center space-x-4">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={user.avatar}
                    alt={user.name}
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {user.email}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Joined {new Date(user.joinDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Last login: {user.lastLogin}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        {user.sessionsCount} sessions
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {user.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusColors[user.status]
                    }`}
                  >
                    {statusLabels[user.status]}
                  </span>

                  {/* Role Badge */}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      roleColors[user.role]
                    }`}
                  >
                    {roleLabels[user.role]}
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

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <UserX className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No users found
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
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Active Users
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {users.filter((u) => u.status === "active").length}
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
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Premium Users
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {users.filter((u) => u.role === "premium").length}
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
                <Ban className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Suspended Users
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {users.filter((u) => u.status === "suspended").length}
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
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Pending Users
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {users.filter((u) => u.status === "pending").length}
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
