"use client";

import React from "react";
import { Icon } from "@/components/ui/icon/icon";
import Link from "next/link";
import { motion } from "framer-motion";

const ErrorPage = ({ error }: { error: Error & { digest?: string } }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -40 }}
    transition={{ duration: 0.4, type: "spring" }}
    className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4"
  >
    <Icon
      name="Bug"
      className="w-24 h-24 text-red-400 dark:text-red-600 mb-6"
    />
    <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
      500
    </h1>
    <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
      Something went wrong on our end.
    </p>
    {error?.message && (
      <p className="text-sm text-gray-400 mb-4 max-w-lg text-center">
        {error.message}
      </p>
    )}
    <Link href="/">
      <button className="px-6 py-2 rounded-lg bg-green text-white font-semibold shadow hover:bg-primary-700 transition">
        Go Home
      </button>
    </Link>
  </motion.div>
);

export default ErrorPage;
