"use client";

import React from "react";
import {
  Users,
  MessageSquare,
  Clock,
  TrendingUp,
  Calendar,
  Star,
  Heart,
  Activity,
  BarChart3,
  Settings,
  Bell,
  UserCheck,
  User,
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
          <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center text-white">
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

interface RecentSessionProps {
  sessions: Array<{
    id: string;
    patientName: string;
    date: string;
    duration: string;
    status: "completed" | "scheduled" | "cancelled";
    rating?: number;
  }>;
}

const RecentSessions: React.FC<RecentSessionProps> = ({ sessions }) => (
  <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
    <div className="px-4 py-5 sm:p-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
        Recent Sessions
      </h3>
      <div className="mt-5 flow-root">
        <ul className="-mb-8">
          {sessions.map((session, sessionIdx) => (
            <li key={session.id}>
              <div className="relative pb-8">
                {sessionIdx !== sessions.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                      <MessageSquare className="h-4 w-4 text-white" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Session with{" "}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {session.patientName}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {session.duration} • {session.status}
                      </p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      <time dateTime={session.date}>{session.date}</time>
                      {session.rating && (
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1">{session.rating}</span>
                        </div>
                      )}
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

function TherapistDashboardContent() {
  const stats = [
    {
      title: "Active Patients",
      value: "24",
      change: "12%",
      changeType: "positive" as const,
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Sessions This Month",
      value: "156",
      change: "8%",
      changeType: "positive" as const,
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      title: "Avg. Session Duration",
      value: "45m",
      change: "5%",
      changeType: "positive" as const,
      icon: <Clock className="h-4 w-4" />,
    },
    {
      title: "Patient Satisfaction",
      value: "4.8",
      change: "2%",
      changeType: "positive" as const,
      icon: <Star className="h-4 w-4" />,
    },
  ];

  const recentSessions = [
    {
      id: "1",
      patientName: "John Doe",
      date: "2 hours ago",
      duration: "45 minutes",
      status: "completed" as const,
      rating: 5,
    },
    {
      id: "2",
      patientName: "Jane Smith",
      date: "1 day ago",
      duration: "60 minutes",
      status: "completed" as const,
      rating: 4,
    },
    {
      id: "3",
      patientName: "Mike Johnson",
      date: "2 days ago",
      duration: "30 minutes",
      status: "completed" as const,
      rating: 5,
    },
    {
      id: "4",
      patientName: "Sarah Wilson",
      date: "Tomorrow, 2:00 PM",
      duration: "45 minutes",
      status: "scheduled" as const,
    },
    {
      id: "5",
      patientName: "David Brown",
      date: "Tomorrow, 4:00 PM",
      duration: "60 minutes",
      status: "scheduled" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, Dr. Sarah Johnson
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Here's what's happening with your practice today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts and Sessions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chart Placeholder */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Session Activity
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

        {/* Recent Sessions */}
        <RecentSessions sessions={recentSessions} />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Quick Actions
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="relative group bg-white dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 ring-4 ring-white dark:ring-gray-800">
                  <MessageSquare className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Start Session
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Begin a new therapy session
                </p>
              </div>
            </button>

            <button className="relative group bg-white dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 ring-4 ring-white dark:ring-gray-800">
                  <Calendar className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  View Schedule
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Check your upcoming appointments
                </p>
              </div>
            </button>

            <button className="relative group bg-white dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300 ring-4 ring-white dark:ring-gray-800">
                  <Heart className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Patient List
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Manage your patient records
                </p>
              </div>
            </button>

            <button className="relative group bg-white dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 ring-4 ring-white dark:ring-gray-800">
                  <Bell className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Notifications
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Check your messages and alerts
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Today's Schedule
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-green-600 dark:text-green-300" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    John Doe
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    2:00 PM - 2:45 PM
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Upcoming
                </span>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <MessageSquare className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Jane Smith
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    4:00 PM - 5:00 PM
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  Scheduled
                </span>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <MessageSquare className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TherapistDashboard() {
  return <TherapistDashboardContent />;
}
