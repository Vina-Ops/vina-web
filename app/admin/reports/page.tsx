"use client";

import React, { useState } from "react";
import {
  Download,
  Calendar,
  Filter,
  FileText,
  BarChart3,
  Users,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Eye,
  RefreshCw,
} from "lucide-react";

interface Report {
  id: string;
  name: string;
  type: "user" | "therapist" | "session" | "revenue" | "system";
  status: "generating" | "completed" | "failed";
  createdAt: string;
  completedAt?: string;
  fileSize?: string;
  recordCount?: number;
}

const mockReports: Report[] = [
  {
    id: "1",
    name: "User Registration Report - January 2024",
    type: "user",
    status: "completed",
    createdAt: "2024-01-20 10:30:00",
    completedAt: "2024-01-20 10:32:00",
    fileSize: "2.3 MB",
    recordCount: 156,
  },
  {
    id: "2",
    name: "Therapist Performance Report - Q4 2023",
    type: "therapist",
    status: "completed",
    createdAt: "2024-01-19 14:15:00",
    completedAt: "2024-01-19 14:18:00",
    fileSize: "1.8 MB",
    recordCount: 89,
  },
  {
    id: "3",
    name: "Chat Session Analytics - December 2023",
    type: "session",
    status: "completed",
    createdAt: "2024-01-18 09:45:00",
    completedAt: "2024-01-18 09:47:00",
    fileSize: "4.2 MB",
    recordCount: 1234,
  },
  {
    id: "4",
    name: "Revenue Report - 2023",
    type: "revenue",
    status: "completed",
    createdAt: "2024-01-17 16:20:00",
    completedAt: "2024-01-17 16:25:00",
    fileSize: "3.1 MB",
    recordCount: 456,
  },
  {
    id: "5",
    name: "System Performance Report - January 2024",
    type: "system",
    status: "generating",
    createdAt: "2024-01-20 15:00:00",
  },
];

const reportTypes = [
  { value: "user", label: "User Reports", icon: Users },
  { value: "therapist", label: "Therapist Reports", icon: Users },
  { value: "session", label: "Session Reports", icon: MessageSquare },
  { value: "revenue", label: "Revenue Reports", icon: TrendingUp },
  { value: "system", label: "System Reports", icon: BarChart3 },
];

const statusColors = {
  generating:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const statusLabels = {
  generating: "Generating",
  completed: "Completed",
  failed: "Failed",
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("30d");

  const filteredReports = reports.filter((report) => {
    return selectedType === "all" || report.type === selectedType;
  });

  const handleGenerateReport = () => {
    const newReport: Report = {
      id: Date.now().toString(),
      name: `New Report - ${new Date().toLocaleDateString()}`,
      type: "user",
      status: "generating",
      createdAt: new Date().toISOString(),
    };
    setReports([newReport, ...reports]);
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reports
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Generate and manage system reports and analytics
          </p>
        </div>
        <button
          onClick={handleGenerateReport}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Reports
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {reports.length}
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
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Completed
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {reports.filter((r) => r.status === "completed").length}
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
                <RefreshCw className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Generating
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {reports.filter((r) => r.status === "generating").length}
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
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Failed
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {reports.filter((r) => r.status === "failed").length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Report Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Report Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                {reportTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
                <option value="all">All time</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end justify-end text-sm text-gray-500 dark:text-gray-400">
              {filteredReports.length} of {reports.length} reports
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {report.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="capitalize">{report.type} Report</span>
                      <span>Created: {formatDateTime(report.createdAt)}</span>
                      {report.completedAt && (
                        <span>
                          Completed: {formatDateTime(report.completedAt)}
                        </span>
                      )}
                      {report.recordCount && (
                        <span>{report.recordCount} records</span>
                      )}
                      {report.fileSize && <span>{report.fileSize}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusColors[report.status]
                    }`}
                  >
                    {statusLabels[report.status]}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {report.status === "completed" && (
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Download className="h-4 w-4" />
                      </button>
                    )}
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No reports found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your filter criteria or generate a new report.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Report Templates
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reportTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  className="relative group bg-gray-50 dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 ring-4 ring-white dark:ring-gray-800">
                      <Icon className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {type.label}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Generate detailed {type.label.toLowerCase()}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
