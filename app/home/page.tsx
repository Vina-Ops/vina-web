"use client";

import React from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import { useUser } from "@/context/user-context";
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
import {
  defaultNavItems,
  FixedNavbar,
} from "@/components/navigation/FixedNavbar";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const { user } = useUser();
  const router = useRouter();
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
    <div className="flex h-screen">
      <FixedNavbar
        navItems={defaultNavItems}
        showSearch={true}
        showConnectionStatus={true}
        showThemeToggle={true}
      />
      <div className="flex flex-col flex-1 md:ml-64 p-4 md:p-6 pb-10">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, {(user as any)?.name || (user as any)?.first_name}
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
                      <div className="w-8 h-8 bg-green/20 dark:bg-green-900 rounded-md flex items-center justify-center text-green dark:text-light-green">
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
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green dark:text-light-green">
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
                  <button
                    className="relative group bg-white dark:bg-gray-700 p-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                    onClick={() => router.push("/chat")}
                  >
                    <div>
                      <span className="rounded-lg inline-flex p-2 bg-green/20 dark:bg-green-900 text-green dark:text-light-green ring-4 ring-white dark:ring-gray-800">
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

                  <button
                    className="relative group bg-white dark:bg-gray-700 p-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                    onClick={() => router.push("/mood-check")}
                  >
                    <div>
                      <span className="rounded-lg inline-flex p-2 bg-green/20 dark:bg-green-900 text-green dark:text-light-green ring-4 ring-white dark:ring-gray-800">
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

                  <button
                    className="relative group bg-white dark:bg-gray-700 p-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                    onClick={() => router.push("/therapists")}
                  >
                    <div>
                      <span className="rounded-lg inline-flex p-2 bg-green/20 dark:bg-green-900 text-green dark:text-light-green ring-4 ring-white dark:ring-gray-800">
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

                  <button
                    className="relative group bg-white dark:bg-gray-700 p-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                    onClick={() => router.push("/exercises")}
                  >
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
                              <span className="h-8 w-8 rounded-full bg-green/20 dark:bg-green flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
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
                      <div className="w-10 h-10 bg-green/20 dark:bg-green rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-green dark:text-light-green" />
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green/20 dark:bg-green-900 text-green dark:text-light-green">
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
      </div>
    </div>
  );
}
