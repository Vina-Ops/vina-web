"use client";

import React from "react";
import {
  Users,
  UserCheck,
  MessageSquare,
  TrendingUp,
  Activity,
  Calendar,
  Clock,
  Eye,
  BarChart3,
  Settings,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
}) => (
  <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-dark-green/50 rounded-md flex items-center justify-center text-white">
            {icon}
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {value}
              </div>
              <div
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}
              >
                <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                <span className="sr-only">
                  {changeType === "positive" ? "Increased" : "Decreased"} by
                </span>
                {change}
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

interface RecentActivityProps {
  activities: Array<{
    id: string;
    type: string;
    description: string;
    time: string;
    user: string;
  }>;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => (
  <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
    <div className="px-4 py-5 sm:p-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
        Recent Activity
      </h3>
      <div className="mt-5 flow-root">
        <ul className="-mb-8">
          {activities.map((activity, activityIdx) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {activityIdx !== activities.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-dark-green/50 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                      <Activity className="h-4 w-4 text-white" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.description}{" "}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {activity.user}
                        </span>
                      </p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      <time dateTime={activity.time}>{activity.time}</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

function AdminDashboardContent() {
  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "12%",
      changeType: "positive" as const,
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Active Therapists",
      value: "156",
      change: "8%",
      changeType: "positive" as const,
      icon: <UserCheck className="h-4 w-4" />,
    },
    {
      title: "Chat Sessions",
      value: "1,234",
      change: "23%",
      changeType: "positive" as const,
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      title: "Avg. Response Time",
      value: "2.3s",
      change: "5%",
      changeType: "negative" as const,
      icon: <Clock className="h-4 w-4" />,
    },
  ];

  const recentActivities = [
    {
      id: "1",
      type: "user_registered",
      description: "New user registered",
      time: "2 minutes ago",
      user: "john.doe@example.com",
    },
    {
      id: "2",
      type: "therapist_approved",
      description: "Therapist profile approved",
      time: "15 minutes ago",
      user: "Dr. Sarah Johnson",
    },
    {
      id: "3",
      type: "chat_session",
      description: "Chat session completed",
      time: "1 hour ago",
      user: "user_8472",
    },
    {
      id: "4",
      type: "user_login",
      description: "User logged in",
      time: "2 hours ago",
      user: "jane.smith@example.com",
    },
    {
      id: "5",
      type: "therapist_application",
      description: "New therapist application",
      time: "3 hours ago",
      user: "Dr. Michael Chen",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chart Placeholder */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              User Growth
            </h3>
            <div className="mt-5 h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Chart component will be implemented here
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity activities={recentActivities} />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Quick Actions
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="relative group bg-white dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-dark-green/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-dark-green/50 dark:bg-dark-green/90 text-white dark:text-olive-green ring-4 ring-white dark:ring-white">
                  <UserCheck className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Add Therapist
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Approve new therapist applications
                </p>
              </div>
            </button>

            <button className="relative group bg-white dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-dark-green/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-dark-green/50 dark:bg-dark-green/90 text-white dark:text-olive-green ring-4 ring-white dark:ring-white">
                  <Users className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Manage Users
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  View and manage user accounts
                </p>
              </div>
            </button>

            <button className="relative group bg-white dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-dark-green/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-dark-green/50 dark:bg-dark-green/90 text-white dark:text-olive-green ring-4 ring-white dark:ring-white">
                  <BarChart3 className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  View Analytics
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Check platform performance metrics
                </p>
              </div>
            </button>

            <button className="relative group bg-white dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-dark-green/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-dark-green/50 dark:bg-dark-green/90 text-white dark:text-olive-green ring-4 ring-white dark:ring-white">
                  <Settings className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  System Settings
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Configure platform settings
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return <AdminDashboardContent />;
}
