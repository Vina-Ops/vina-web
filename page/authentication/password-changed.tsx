import React from "react";
import { AuthLayout } from "@/components/layout/authentication-layout";
import Button from "@/components/ui/button/button";
import { Icon } from "@/components/ui/icon/icon";
import Link from "next/link";

const PasswordChangedPage = () => {
  return (
    <div className="w-full max-w-lg bg-white rounded-lg p-8 space-y-6 flex flex-col items-center">
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
    </div>
  );
};

export default PasswordChangedPage;
