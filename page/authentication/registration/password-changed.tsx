"use client";

import React from "react";
import Button from "@/components/ui/button/button";
import { Icon } from "@/components/ui/icon/icon";
import Link from "next/link";
import { motion } from "framer-motion";

const PasswordChangedPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="w-full max-w-lg bg-white rounded-lg space-y-6 flex flex-col items-center"
    >
      <Icon
        name="Check"
        className="w-12 h-12 text-yellow-500 dark:text-yellow-400 mb-2"
      />
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-dark-green">
        Password changed!
      </h2>
      <p className="text-center text-gray-600 dark:text-dark-green mb-4">
        Your password has been successfully updated.
      </p>
      <Link href="/auth/login" className="w-full">
        <Button className="w-full">Return to Login</Button>
      </Link>
    </motion.div>
  );
};

export default PasswordChangedPage;
