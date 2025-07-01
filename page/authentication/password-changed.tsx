import React from "react";
import { AuthLayout } from "@/components/layout/authentication-layout";
import Button from "@/components/ui/button/button";
import { Icon } from "@/components/ui/icon/icon";
import Link from "next/link";

const PasswordChangedPage = () => {
  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 space-y-6 flex flex-col items-center">
        <Icon
          name="check"
          className="w-12 h-12 text-yellow-500 dark:text-yellow-400 mb-2"
        />
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Password changed!
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
          Your password has been successfully updated.
        </p>
        <Link href="/auth/login" className="w-full">
          <Button className="w-full">Return to Login</Button>
        </Link>
      </div>
    </AuthLayout>
  );
};

export default PasswordChangedPage;
