"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  UserCheck,
  MessageSquare,
  Clock,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Filter,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({
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
                {changeType === "positive" ? (
                  <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                ) : (
                  <TrendingDown className="self-center flex-shrink-0 h-4 w-4" />
                )}
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

interface ChartPlaceholderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ChartPlaceholder: React.FC<ChartPlaceholderProps> = ({
  title,
  description,
  icon,
}) => (
  <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
    <div className="px-4 py-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          {title}
        </h3>
        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <Download className="h-5 w-5" />
        </button>
      </div>
      <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="text-center">
          {icon}
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");

  const metrics = [
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

  const topTherapists = [
    { name: "Dr. Sarah Johnson", sessions: 156, rating: 4.8 },
    { name: "Dr. Emily Rodriguez", sessions: 203, rating: 4.9 },
    { name: "Dr. Lisa Thompson", sessions: 134, rating: 4.7 },
    { name: "Dr. James Wilson", sessions: 89, rating: 4.6 },
    { name: "Dr. Michael Chen", sessions: 67, rating: 4.5 },
  ];

  const userGrowthData = [
    { month: "Jan", users: 1200 },
    { month: "Feb", users: 1350 },
    { month: "Mar", users: 1500 },
    { month: "Apr", users: 1650 },
    { month: "May", users: 1800 },
    { month: "Jun", users: 2000 },
    { month: "Jul", users: 2200 },
    { month: "Aug", users: 2400 },
    { month: "Sep", users: 2600 },
    { month: "Oct", users: 2700 },
    { month: "Nov", users: 2800 },
    { month: "Dec", users: 2847 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Platform performance metrics and insights
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="block px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-dark-green/50 focus:border-dark-green/50"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-green/50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Growth Chart */}
        <ChartPlaceholder
          title="User Growth"
          description="Chart component will show user growth over time"
          icon={<BarChart3 className="mx-auto h-12 w-12 text-gray-400" />}
        />

        {/* Session Activity Chart */}
        <ChartPlaceholder
          title="Session Activity"
          description="Chart component will show chat session activity"
          icon={<Activity className="mx-auto h-12 w-12 text-gray-400" />}
        />

        {/* User Demographics */}
        <ChartPlaceholder
          title="User Demographics"
          description="Pie chart component will show user age and location distribution"
          icon={<PieChart className="mx-auto h-12 w-12 text-gray-400" />}
        />

        {/* Top Therapists */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Top Performing Therapists
            </h3>
            <div className="space-y-4">
              {topTherapists.map((therapist, index) => (
                <div
                  key={therapist.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-dark-green/50 dark:bg-dark-green/90 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-dark-green dark:text-olive-green">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {therapist.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {therapist.sessions} sessions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {therapist.rating}★
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Platform Usage */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Platform Usage
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Daily Active Users
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  1,234
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Weekly Active Users
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  8,567
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Monthly Active Users
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  24,890
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Avg. Session Duration
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  15.2 min
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Metrics */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Revenue Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Monthly Revenue
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  $45,678
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Premium Subscriptions
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  1,234
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Conversion Rate
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  8.5%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Avg. Revenue per User
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  $16.05
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Performance Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  System Uptime
                </span>
                <span className="text-sm font-medium text-green-600">
                  99.9%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Avg. Response Time
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  2.3s
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Error Rate
                </span>
                <span className="text-sm font-medium text-red-600">0.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Customer Satisfaction
                </span>
                <span className="text-sm font-medium text-green-600">
                  4.8/5
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Recent Activity Summary
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                156
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                New Users Today
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                89
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Active Sessions
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                23
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                New Messages
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                12
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Support Tickets
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
