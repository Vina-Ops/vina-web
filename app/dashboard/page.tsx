"use client";

import React from "react";
import { UserRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/auth-context";
import {
  User,
  MessageSquare,
  Calendar,
  Heart,
  Activity,
  Settings,
  Bell,
  Clock,
  Star,
} from "lucide-react";

export default function UserDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Sessions",
      value: "12",
      change: "2",
      changeType: "positive" as const,
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      title: "This Month",
      value: "3",
      change: "1",
      changeType: "positive" as const,
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: "Mood Score",
      value: "8.5",
      change: "0.5",
      changeType: "positive" as const,
      icon: <Heart className="h-4 w-4" />,
    },
    {
      title: "Streak",
      value: "7 days",
      change: "2",
      changeType: "positive" as const,
      icon: <Activity className="h-4 w-4" />,
    },
  ];

  const recentActivities = [
    {
      id: "1",
      type: "session",
      title: "Therapy Session",
      description: "Completed session with Dr. Sarah Johnson",
      time: "2 hours ago",
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      id: "2",
      type: "mood",
      title: "Mood Check-in",
      description: "Recorded your daily mood as 'Good'",
      time: "1 day ago",
      icon: <Heart className="h-4 w-4" />,
    },
    {
      id: "3",
      type: "exercise",
      title: "Breathing Exercise",
      description: "Completed 10-minute breathing session",
      time: "2 days ago",
      icon: <Activity className="h-4 w-4" />,
    },
  ];

  return (
    <UserRoute>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Here's your mental wellness overview for today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {stat.title}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {stat.value}
                        </div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                          <span>+{stat.change}</span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="relative group bg-white dark:bg-gray-700 p-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <div>
                    <span className="rounded-lg inline-flex p-2 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 ring-4 ring-white dark:ring-gray-800">
                      <MessageSquare className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Start Chat
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Talk to Vina AI
                    </p>
                  </div>
                </button>

                <button className="relative group bg-white dark:bg-gray-700 p-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <div>
                    <span className="rounded-lg inline-flex p-2 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 ring-4 ring-white dark:ring-gray-800">
                      <Heart className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Mood Check
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Record your mood
                    </p>
                  </div>
                </button>

                <button className="relative group bg-white dark:bg-gray-700 p-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <div>
                    <span className="rounded-lg inline-flex p-2 bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300 ring-4 ring-white dark:ring-gray-800">
                      <Calendar className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Book Session
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Schedule therapy
                    </p>
                  </div>
                </button>

                <button className="relative group bg-white dark:bg-gray-700 p-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <div>
                    <span className="rounded-lg inline-flex p-2 bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 ring-4 ring-white dark:ring-gray-800">
                      <Activity className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Exercises
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Wellness activities
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="flow-root">
                <ul className="-mb-8">
                  {recentActivities.map((activity, activityIdx) => (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {activityIdx !== recentActivities.length - 1 ? (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                              {activity.icon}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {activity.title}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {activity.description}
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                              <time dateTime={activity.time}>
                                {activity.time}
                              </time>
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
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Therapy Session
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      3:00 PM - 4:00 PM with Dr. Sarah Johnson
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
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <Activity className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Daily Mood Check
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Due in 2 hours
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                    Pending
                  </span>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserRoute>
  );
}
