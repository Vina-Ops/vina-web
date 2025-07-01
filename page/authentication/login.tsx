import React from "react";
import { AuthLayout } from "@/components/layout/authentication-layout";
import { Input } from "@/components/ui/input/input";
import Button from "@/components/ui/button/button";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="w-full max-w-lg dark:bg-gray-900 p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        Log In
      </h2>
      <form className="space-y-4">
        <Input type="email" placeholder="Enter email" required />
        <Input type="password" placeholder="Enter password" required />
        <Button variant="primary" type="submit" className="w-full">
          Log In
        </Button>
      </form>
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-4">
        <Link href="#" className="hover:underline">
          Forgot your password?
        </Link>
        <Link href="/auth/register" className="hover:underline">
          Create a new account!
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
