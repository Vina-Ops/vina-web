"use client";

import React from "react";
import RedisMonitor from "@/components/redis/RedisMonitor";

const RedisMonitorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Redis Database Monitor
          </h1>
          <p className="mt-2 text-gray-600">
            Monitor and manage your Redis database in real-time
          </p>
        </div>

        <RedisMonitor />
      </div>
    </div>
  );
};

export default RedisMonitorPage;
